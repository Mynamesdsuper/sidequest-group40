#!/usr/bin/env node
// Builds the project history document (in Italian): docs/history/overview.md (hand-written),
// then every PROGRESS.md entry of every section in chronological order, the commit history and
// the task status. The order comes from the "YYYY-MM-DD HH:MM" at the start of each entry title
// (not from git blame: translations and squash merges rewrite the lines).
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

/** Splits PROGRESS.md into entries: { section, heading, line (1-based), body, key, timed }. */
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
      const heading = l.slice(4).trim();
      const m = heading.match(/^(\d{4}-\d{2}-\d{2})(?: (\d{2}:\d{2}))?/);
      cur = { section, heading, line: i + 1, body: [], key: m ? `${m[1]} ${m[2] ?? '00:00'}` : '9999-99-99 99:99', timed: Boolean(m?.[2]) };
      entries.push(cur);
    } else if (cur) cur.body.push(l);
  });
  for (const e of entries) e.body = e.body.join('\n').trim();
  return entries;
}

/** Oldest first by date and time; same minute and section: lower in the file is older. */
export const sortEntries = (entries) =>
  [...entries].sort((a, b) => a.key.localeCompare(b.key) || (a.section === b.section ? b.line - a.line : 0));

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
    return 'Non disponibile (GitHub CLI non autenticata o GitHub non raggiungibile).';
  }
}

function build() {
  const entries = sortEntries(parseProgress(readFileSync(join(ROOT, 'PROGRESS.md'), 'utf8')));
  for (const e of entries.filter((x) => !x.timed)) console.warn(`WARN  voce senza ora (AAAA-MM-GG HH:MM): ${e.section} › ${e.heading}`);
  let branch = 'sconosciuto';
  let head = 'sconosciuto';
  try {
    branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    head = git(['rev-parse', '--short', 'HEAD']).trim();
  } catch { /* not a git checkout */ }

  const md = [];
  md.push(readFileSync(join(OUT_DIR, 'overview.md'), 'utf8').trim(), '');
  md.push('# Registro cronologico', '');
  md.push(`Tutte le voci di \`PROGRESS.md\` (di tutte le sezioni), dalla più vecchia alla più recente. Generato dal branch \`${branch}\` al commit \`${head}\`.`, '');
  entries.forEach((e, i) => {
    md.push(`## Passo ${i + 1} · ${e.heading}`, '', `*Sezione: ${e.section}*`, '', e.body, '');
  });

  const log = commitLog();
  md.push('# Storia dei commit', '', `I commit di \`${branch}\` in ordine (solo il primo genitore: una PR mergiata con squash è una riga sola). I messaggi di commit sono in inglese, come il resto del codice.`, '');
  md.push('| # | Data | Commit | Autore | Messaggio |', '|---|---|---|---|---|');
  log.forEach(([h, d, a, s], i) => md.push(`| ${i + 1} | ${d} | \`${h}\` | ${a} | ${s.replace(/\|/g, '\\|')} |`));
  md.push('', '# Stato dei task al momento della generazione', '', 'Output di `npm run deps -- --all` (DONE = chiuso, READY = può iniziare, BLOCKED = aspetta i task indicati).', '', '```text', taskStatus(), '```', '');

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_MD, md.join('\n'));
  console.log(`Storia scritta: docs/history/HISTORY.md (${entries.length} passi, ${log.length} commit)`);
}

// Runs only when called directly, so the parser can be imported by the self-check.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build();
  if (!process.argv.includes('--md-only')) {
    execFileSync(process.execPath, [join(ROOT, 'scripts/render-pdf.mjs'), '--lang', 'it', '--title', 'SideQuest Gruppo 40 - Storia del progetto', '--out', OUT_PDF, OUT_MD], { cwd: ROOT, stdio: 'inherit' });
  }
}
