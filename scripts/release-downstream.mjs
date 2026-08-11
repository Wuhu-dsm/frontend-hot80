#!/usr/bin/env node
/**
 * Downstream Update Gate helper — best-effort sync with Exact Pin.
 */
import { execSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const selection = process.argv[2] || 'all';
if (selection === 'none') {
  console.log('downstreams=none, skip');
  process.exit(0);
}

const root = process.cwd();
const manifestPath = join(root, 'release-manifest.json');
if (!existsSync(manifestPath)) {
  console.error('release-manifest.json missing — Publish Gate must succeed first');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const catalogRaw = readFileSync(join(root, 'release/downstreams.yml'), 'utf8');
const all = parseDownstreams(catalogRaw);

const selectedIds =
  selection === 'all'
    ? all.map((d) => d.id)
    : selection.split(',').map((s) => s.trim()).filter(Boolean);

const token = process.env.RELEASE_PAT || process.env.GITHUB_TOKEN;
if (!token) {
  console.error('RELEASE_PAT or GITHUB_TOKEN required to push downstream repos');
  process.exit(1);
}

function parseDownstreams(yamlText) {
  // Minimal parser for our catalog shape (list of maps under downstreams:)
  const items = [];
  let current = null;
  for (const line of yamlText.split(/\r?\n/)) {
    const id = line.match(/^\s+-\s+id:\s*(.+)\s*$/);
    if (id) {
      current = { id: id[1].trim() };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const m = line.match(/^\s+(repo|branch|packageManager):\s*(.+)\s*$/);
    if (m) current[m[1]] = m[2].trim();
  }
  return items;
}

function runInherit(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function pinDeps(pkgJson, packages) {
  let changed = false;
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (!pkgJson[field]) continue;
    for (const [name, ver] of Object.entries(packages)) {
      if (Object.prototype.hasOwnProperty.call(pkgJson[field], name)) {
        if (pkgJson[field][name] !== ver) {
          pkgJson[field][name] = ver;
          changed = true;
        }
      }
    }
  }
  return changed;
}

const results = [];

for (const id of selectedIds) {
  const entry = all.find((d) => d.id === id);
  if (!entry) {
    results.push({ id, status: 'failed', reason: 'not in Downstream Catalog' });
    continue;
  }

  const work = mkdtempSync(join(tmpdir(), `downstream-${id}-`));
  try {
    const cloneUrl = `https://x-access-token:${token}@github.com/${entry.repo}.git`;
    runInherit(`git clone --depth 1 --branch ${entry.branch} "${cloneUrl}" "${work}"`);

    const pkgPath = join(work, 'package.json');
    if (!existsSync(pkgPath)) {
      results.push({ id, status: 'failed', reason: 'no package.json' });
      continue;
    }

    const pkgText = readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, '');
    const pkg = JSON.parse(pkgText);
    const changed = pinDeps(pkg, manifest.packages);
    if (!changed) {
      results.push({ id, status: 'noop', reason: 'no matching deps' });
      continue;
    }

    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    writeFileSync(
      join(work, '.npmrc'),
      [
        '@wuhu-dsm:registry=https://npm.pkg.github.com',
        `//npm.pkg.github.com/:_authToken=${token}`,
        '',
      ].join('\n'),
    );

    const pm = entry.packageManager || 'pnpm';
    runInherit(pm === 'pnpm' ? 'pnpm install' : 'npm install', {
      cwd: work,
      env: { ...process.env, NODE_AUTH_TOKEN: token },
    });

    // Never commit token-bearing .npmrc
    rmSync(join(work, '.npmrc'), { force: true });

    runInherit('git config user.name "github-actions[bot]"', { cwd: work });
    runInherit(
      'git config user.email "41898282+github-actions[bot]@users.noreply.github.com"',
      { cwd: work },
    );

    runInherit('git add -A', { cwd: work });
    // Ensure .npmrc not staged if recreated
    try {
      runInherit('git restore --staged .npmrc', { cwd: work });
    } catch {
      /* ignore */
    }

    const msg = `chore: pin @wuhu-dsm packages (${Object.entries(manifest.packages)
      .map(([n, v]) => `${n}@${v}`)
      .join(', ')})`;

    try {
      runInherit(`git commit -m "${msg}"`, { cwd: work });
    } catch {
      results.push({ id, status: 'noop', reason: 'nothing to commit' });
      continue;
    }

    runInherit(`git push origin "HEAD:${entry.branch}"`, { cwd: work });
    results.push({ id, status: 'updated', repo: entry.repo, branch: entry.branch });
  } catch (err) {
    console.error(err);
    results.push({ id, status: 'failed', reason: String(err.message || err) });
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

console.log(JSON.stringify({ results }, null, 2));
writeFileSync(join(root, 'downstream-results.json'), `${JSON.stringify({ results }, null, 2)}\n`);

process.exit(results.some((r) => r.status === 'failed') ? 1 : 0);
