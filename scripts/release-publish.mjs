#!/usr/bin/env node
/**
 * Publish Gate helper:
 * - shared bump all publishable packages (keep workspace: deps in git)
 * - build + publish to GitHub Packages
 * - write release-manifest.json
 * Git commit/tag/push is done by the workflow AFTER this succeeds.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const bump = process.argv[2];
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error('Usage: node scripts/release-publish.mjs <patch|minor|major>');
  process.exit(1);
}

const root = process.cwd();
const packagesDir = join(root, 'packages');
const dirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

function readPkg(dir) {
  return JSON.parse(readFileSync(join(packagesDir, dir, 'package.json'), 'utf8'));
}

function writePkg(dir, pkg) {
  writeFileSync(join(packagesDir, dir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
}

function bumpVersion(version, type) {
  const [maj, min, pat] = version.split('.').map(Number);
  if (type === 'major') return `${maj + 1}.0.0`;
  if (type === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

const versions = {};
for (const dir of dirs) {
  const pkg = readPkg(dir);
  if (pkg.private) continue;
  const next = bumpVersion(pkg.version, bump);
  pkg.version = next;
  writePkg(dir, pkg);
  versions[pkg.name] = next;
  console.log(`bump ${pkg.name}: ${next}`);
}

run('pnpm install', { cwd: root });
run('pnpm -r --filter "./packages/**" run build', { cwd: root });

run('pnpm -r --filter "./packages/**" publish --no-git-checks --access restricted', {
  cwd: root,
  env: {
    ...process.env,
    NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN || '',
  },
});

const manifest = {
  bumped: bump,
  createdAt: new Date().toISOString(),
  packages: versions,
  tags: Object.entries(versions).map(([name, ver]) => `${name}@${ver}`),
};

writeFileSync(join(root, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Wrote release-manifest.json');
console.log(JSON.stringify(manifest, null, 2));
