#!/usr/bin/env node
/**
 * Validate Cursor Agent review.json against pr.diff, then submit a GitHub
 * pull-request review (summary + inline comments) via `gh api`.
 */
import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const MARKER = '<!-- cursor-agent-cr -->'
const REVIEW_PATH = process.env.REVIEW_PATH || 'review.json'
const DIFF_PATH = process.env.DIFF_PATH || 'pr.diff'
const PR_NUMBER = process.env.PR_NUMBER
const REPOSITORY = process.env.REPOSITORY
const HEAD_SHA = process.env.HEAD_SHA
const MAX_INLINE = Number(process.env.MAX_INLINE_COMMENTS || 10)

function fail(message) {
  console.error(`::error::${message}`)
  process.exit(1)
}

function loadJson(path) {
  if (!existsSync(path)) fail(`Missing review file: ${path}`)
  const raw = readFileSync(path, 'utf8').trim()
  // Agent sometimes wraps JSON in markdown fences; strip once.
  const unfenced = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  try {
    return JSON.parse(unfenced)
  } catch (err) {
    fail(`Invalid JSON in ${path}: ${err.message}`)
  }
}

function ensureFile(files, path) {
  if (!files.has(path)) {
    files.set(path, { right: new Set(), left: new Set() })
  }
  return files.get(path)
}

/**
 * Parse a unified diff into commentable lines.
 * Returns Map<path, { right: Set<number>, left: Set<number> }>
 */
export function parseCommentableLines(diffText) {
  const files = new Map()
  let oldPath = null
  let newPath = null
  let current = null
  let oldLine = 0
  let newLine = 0
  let inHunk = false

  for (const line of diffText.split(/\r?\n/)) {
    if (line.startsWith('diff --git ')) {
      oldPath = null
      newPath = null
      current = null
      inHunk = false
      continue
    }

    if (line.startsWith('--- ')) {
      const p = line.slice(4)
      oldPath = p === '/dev/null' ? null : p.replace(/^[ab]\//, '')
      continue
    }

    if (line.startsWith('+++ ')) {
      const p = line.slice(4)
      newPath = p === '/dev/null' ? null : p.replace(/^[ab]\//, '')
      const path = newPath || oldPath
      current = path ? ensureFile(files, path) : null
      inHunk = false
      continue
    }

    const hunk = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/)
    if (hunk) {
      oldLine = Number(hunk[1])
      newLine = Number(hunk[2])
      inHunk = true
      continue
    }

    if (!inHunk || !current) continue

    if (line.startsWith('+')) {
      // Only added lines are reliably commentable on the RIGHT side.
      current.right.add(newLine)
      newLine += 1
    } else if (line.startsWith('-')) {
      // Only deleted lines are reliably commentable on the LEFT side.
      current.left.add(oldLine)
      oldLine += 1
    } else if (line.startsWith('\\')) {
      // "\ No newline at end of file"
    } else {
      // Unchanged context lines inside the hunk — skip for commenting.
      oldLine += 1
      newLine += 1
    }
  }

  return files
}

function normalizeReview(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    fail('review.json root must be an object')
  }

  const body = typeof raw.body === 'string' ? raw.body.trim() : ''
  const comments = Array.isArray(raw.comments) ? raw.comments : []

  return {
    commit_id: typeof raw.commit_id === 'string' && raw.commit_id ? raw.commit_id : HEAD_SHA,
    event: 'COMMENT',
    body,
    comments,
  }
}

function filterComments(comments, commentable) {
  const kept = []
  const skipped = []

  for (const item of comments) {
    if (!item || typeof item !== 'object') {
      skipped.push({ reason: 'not-an-object', item })
      continue
    }
    const path = typeof item.path === 'string' ? item.path.replace(/^\.\//, '') : ''
    const line = Number(item.line)
    const side = item.side === 'LEFT' ? 'LEFT' : 'RIGHT'
    const body = typeof item.body === 'string' ? item.body.trim() : ''

    if (!path || !Number.isInteger(line) || line < 1 || !body) {
      skipped.push({ reason: 'invalid-fields', path, line, side })
      continue
    }

    const entry = commentable.get(path)
    if (!entry) {
      skipped.push({ reason: 'path-not-in-diff', path, line, side })
      continue
    }

    const set = side === 'LEFT' ? entry.left : entry.right
    if (!set.has(line)) {
      skipped.push({ reason: 'line-not-commentable', path, line, side })
      continue
    }

    kept.push({ path, line, side, body })
    if (kept.length >= MAX_INLINE) break
  }

  return { kept, skipped }
}

function ensureMarker(body) {
  if (body.includes(MARKER)) return body
  return `${MARKER}\n${body}`
}

function postReview(payload) {
  const result = spawnSync(
    'gh',
    ['api', '--method', 'POST', `repos/${REPOSITORY}/pulls/${PR_NUMBER}/reviews`, '--input', '-'],
    {
      input: JSON.stringify(payload),
      encoding: 'utf8',
      env: process.env,
    },
  )

  if (result.status !== 0) {
    console.error(result.stdout)
    console.error(result.stderr)
    fail(`gh api failed with exit code ${result.status}`)
  }

  console.log(result.stdout)
}

function main() {
  if (!PR_NUMBER || !REPOSITORY || !HEAD_SHA) {
    fail('PR_NUMBER, REPOSITORY, and HEAD_SHA env vars are required')
  }
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    fail('GH_TOKEN or GITHUB_TOKEN is required')
  }

  if (!existsSync(DIFF_PATH)) fail(`Missing diff file: ${DIFF_PATH}`)
  const diffText = readFileSync(DIFF_PATH, 'utf8')
  const commentable = parseCommentableLines(diffText)

  const review = normalizeReview(loadJson(REVIEW_PATH))
  review.commit_id = HEAD_SHA

  const { kept, skipped } = filterComments(review.comments, commentable)
  if (skipped.length) {
    console.log(`Filtered ${skipped.length} inline comment(s):`)
    for (const s of skipped) console.log(`  - ${JSON.stringify(s)}`)
  }

  let body = ensureMarker(review.body || '')
  if (!body.replace(MARKER, '').trim() && kept.length === 0) {
    body = ensureMarker('## Cursor Agent 代码评审\n\n未发现需要提交的明确问题。')
  } else if (!body.replace(MARKER, '').trim()) {
    body = ensureMarker(
      `## Cursor Agent 代码评审\n\n共提出 ${kept.length} 条行内建议，详见 inline 评论。`,
    )
  }

  const payload = {
    commit_id: HEAD_SHA,
    event: 'COMMENT',
    body,
    comments: kept,
  }

  console.log(
    `Submitting review on ${REPOSITORY}#${PR_NUMBER} with ${kept.length} inline comment(s).`,
  )
  postReview(payload)
  console.log('Review submitted.')
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('post-pr-review.mjs') ||
    process.argv[1].includes('post-pr-review.mjs'))

if (isDirectRun) {
  main()
}
