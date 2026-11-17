#!/usr/bin/env node
// Builds the project history document: docs/history/overview.md (hand-written) followed by every
// PROGRESS.md entry of every section in chronological order, the commit history and the task status.
// The order comes from `git blame` (the commit that added each entry heading), because entries of
// the same day may have no time and the sections are interleaved.
//   node scripts/history.mjs [--md-only]
// Output: docs/history/HISTORY.md and docs/history/SideQuest_Group40_History.pdf (both gitignored;
// the PDF is published on every push to develop by .github/workflows/history.yml).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './lib.mjs';

const OUT_DIR = join(ROOT, 'docs/history');
const OUT_MD = join(OUT_DIR, 'HISTORY.md');
const OUT_PDF = join(OUT_DIR, 'SideQuest_Group40_History.pdf');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** Splits PROGRESS.md into entries: { section, heading, line (1-based), body }. */
export function parseProgress(text) {
  const entries = [];
  let section = null;
  let cur = null;
  text.split('\n').forEach((raw, i) => {
    const l = raw.replace(/\r$/, '');
    if (l.startsWith('## ')) {
      section = l.slice(3).trim();
      cur = null;
    } else if (l.startsWith('### ') && section) {
      cur = { section, heading: l.slice(4).trim(), line: i + 1, body: [] };
      entries.push(cur);
    } else if (cur) cur.body.push(l);
  });
  for (const e of entries) e.body = e.body.join('\n').trim();
  return entries;
}

/** Final line number -> { sha, time (epoch s), author } from `git blame --line-porcelain`. */
function blame(file) {
  const map = new Map();
  let out;
  try {
    out = git(['blame', '--line-porcelain', '--', file]);
  } catch {
    return map; // not a git checkout: every entry counts as uncommitted
  }
  let info = null;
  for (const l of out.split('\n')) {
    const h = l.match(/^([0-9a-f]{40}) \d+ (\d+)/);
    if (h) info = { sha: h[1], line: Number(h[2]) };
    else if (info && l.startsWith('author ')) info.author = l.slice(7);
    else if (info && l.startsWith('author-time ')) info.time = Number(l.slice(12));
    else if (info && l.startsWith('\t')) map.set(info.line, info);
  }
  return map;
}

/** Chronological order: commit time, then (same commit) older entries first = lower in the file. */
export function sortEntries(entries, blameMap, now = Date.now() / 1000) {
  return entries
    .map((e) => {
      const b = blameMap.get(e.line);
      const committed = b && !/^0+$/.test(b.sha);
      return { ...e, sha: committed ? b.sha.slice(0, 7) : null, time: committed ? b.time : now, author: committed ? b.author : null };
    })
    .sort((a, b) => a.time - b.time || (a.section === b.section ? b.line - a.line : 0));
}

const fmt = (t) => new Date(t * 1000).toISOString().slice(0, 16).replace('T', ' ');

function commitLog() {
  try {
    return git(['log', '--first-parent', '--reverse', '--date=format:%Y-%m-%d %H:%M', '--format=%h%x09%ad%x09%an%x09%s'])
      .trim().split('\n').filter(Boolean).map((l) => l.split('\t'));
  } catch {
    return [];
  }
}

function taskStatus() {
  try {
    return execFileSync(process.execPath, [join(ROOT, 'scripts/deps.mjs'), '--all'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return 'Not available (the GitHub CLI is not logged in or GitHub is unreachable).';
  }
}

function build() {
  const entries = sortEntries(parseProgress(readFileSync(join(ROOT, 'PROGRESS.md'), 'utf8')), blame('PROGRESS.md'));
  let branch = 'unknown';
  let head = 'unknown';
  try {
    branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    head = git(['rev-parse', '--short', 'HEAD']).trim();
  } catch { /* not a git checkout */ }

  const md = [];
  md.push(readFileSync(join(OUT_DIR, 'overview.md'), 'utf8').trim(), '');
  md.push('# Chronological log', '');
  md.push(`Every entry of \`PROGRESS.md\` (all sections), oldest first. Built from branch \`${branch}\` at commit \`${head}\`. Each step shows the commit that recorded it; "not committed yet" marks local work in progress.`, '');
  entries.forEach((e, i) => {
    md.push(`## Step ${i + 1} · ${e.heading}`, '');
    const where = e.sha ? `recorded in commit \`${e.sha}\` on ${fmt(e.time)} UTC by ${e.author}` : 'not committed yet';
    md.push(`*Section: ${e.section} · ${where}*`, '', e.body, '');
  });

  const log = commitLog();
  md.push('# Commit history', '', `The commits of \`${branch}\` in order (first parent only, so a squash-merged PR is one line).`, '');
  md.push('| # | Date | Commit | Author | Message |', '|---|---|---|---|---|');
  log.forEach(([h, d, a, s], i) => md.push(`| ${i + 1} | ${d} | \`${h}\` | ${a} | ${s.replace(/\|/g, '\\|')} |`));
  md.push('', '# Task status at generation time', '', '```text', taskStatus(), '```', '');

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_MD, md.join('\n'));
  console.log(`History written: docs/history/HISTORY.md (${entries.length} steps, ${log.length} commits)`);
}

// Runs only when called directly, so the parser can be imported by the self-check.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build();
  if (!process.argv.includes('--md-only')) {
    execFileSync(process.execPath, [join(ROOT, 'scripts/render-pdf.mjs'), '--title', 'SideQuest Group 40 - Project history', '--out', OUT_PDF, OUT_MD], { cwd: ROOT, stdio: 'inherit' });
  }
}
