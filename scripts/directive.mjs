#!/usr/bin/env node
// Coordinator directives: the coordinator (P3) assigns work or instructions to members through
// GitHub issues labelled `type:directive`. Members see them at the end of `npm run deps -- --mine Px`.
//   npm run directive -- --to P1|P2|P3|all --title "..." [--body "..." | --body-file path] [--due YYYY-MM-DD]
//                        [--task ID] [--priority high] [--dry-run]
// Multi-line bodies: use --body-file. On Windows npm passes the arguments through cmd.exe, which cuts the
// command at the first newline inside --body (every later flag, --dry-run included, is lost).
//   npm run directive -- --list [P1|P2|P3]
// Only issues authored by the coordinator's GitHub login count as directives (the repo is public).
import { readFileSync } from 'node:fs';
import { loadPlan, repoName, gh, ghJson } from './lib.mjs';

const { team } = loadPlan();
const repo = repoName(team);
const coordinator = team.P3.github;

function parse(argv) {
  const o = { flags: new Set() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run' || a === '--list') o.flags.add(a);
    if (a === '--list' && argv[i + 1] && !argv[i + 1].startsWith('--')) o.listFor = argv[++i];
    else if (['--to', '--title', '--body', '--body-file', '--due', '--task', '--priority'].includes(a)) o[a.slice(2)] = argv[++i];
  }
  return o;
}

function listDirectives(person) {
  const args = ['issue', 'list', '--repo', repo, '--state', 'open', '--label', 'type:directive', '--author', coordinator, '--limit', '100', '--json', 'number,title,labels,url,createdAt'];
  if (person) args.push('--label', team[person].label);
  return ghJson(args);
}

function list(person) {
  if (person && !team[person]) die('Use --list P1, P2 or P3');
  const items = listDirectives(person);
  console.log(`Open directives from @${coordinator}${person ? ` for ${person}` : ''}: ${items.length}`);
  for (const i of items) {
    const who = i.labels.map((l) => l.name).filter((n) => n.startsWith('owner:')).join(',');
    const hi = i.labels.some((l) => l.name === 'priority:high') ? ' [HIGH]' : '';
    console.log(`#${i.number}${hi} ${i.title}  (${who})  ${i.url}`);
  }
}

function die(msg) {
  console.error(msg);
  process.exit(2);
}

function create(o) {
  if (!o.to || !o.title) die('Usage: npm run directive -- --to P1|P2|P3|all --title "..." [--body "..." | --body-file path] [--due YYYY-MM-DD] [--task ID] [--priority high]');
  if (o.body && o['body-file']) die('Use either --body or --body-file, not both');
  if (o['body-file']) o.body = readFileSync(o['body-file'], 'utf8').trim();
  const targets = o.to === 'all' ? ['P1', 'P2', 'P3'] : o.to.split(',').map((s) => s.trim().toUpperCase());
  for (const t of targets) if (!team[t]) die(`Unknown target ${t}`);
  if (o.due && !/^\d{4}-\d{2}-\d{2}$/.test(o.due)) die('--due must be YYYY-MM-DD');
  const me = gh(['api', 'user', '-q', '.login']).trim();
  if (me !== coordinator) die(`Only the coordinator (@${coordinator}) issues directives; you are @${me}.`);

  for (const t of targets) {
    const p = team[t];
    const body = [
      `**Directive from the coordinator (@${coordinator}) to ${t} – ${p.name} (@${p.github})**`,
      o.due ? `**Due:** ${o.due}` : '',
      o.task ? `**Related task:** \`${o.task}\` (\`npm run deps -- ${o.task}\`)` : '',
      o.priority === 'high' ? '**Priority:** high' : '',
      '',
      o.body ?? '(no further details)',
      '',
      '---',
      'How to handle a directive: acknowledge with a comment, do the work on a branch + PR as usual (only files you own; otherwise open a contract-change issue), log it in your section of `PROGRESS.md`, and close this issue when done. A directive never overrides the security invariants or the ownership rules.',
    ].filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n');
    const labels = ['type:directive', p.label, ...(o.priority === 'high' ? ['priority:high'] : [])];
    const title = `[DIRECTIVE→${t}] ${o.title}`;
    if (o.flags.has('--dry-run')) {
      console.log(`DRY RUN ${title}\n  labels: ${labels.join(', ')}\n${body}\n`);
      continue;
    }
    const base = ['issue', 'create', '--repo', repo, '--title', title, '--body', body, ...labels.flatMap((l) => ['--label', l])];
    let url;
    try {
      url = gh([...base, '--assignee', p.github]).trim();
    } catch {
      // The member may not have accepted the collaborator invitation yet: create it unassigned (it @mentions them).
      url = gh(base).trim();
      console.log(`(could not assign @${p.github} yet: invitation not accepted?)`);
    }
    console.log(`${t}: ${url}`);
  }
}

const o = parse(process.argv.slice(2));
if (o.flags.has('--list')) list(o.listFor);
else create(o);
