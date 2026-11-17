#!/usr/bin/env node
// Dependency checker for the plan. Uses the gh CLI; no npm dependencies.
//   npm run deps -- <TASK-ID>          is the task READY or BLOCKED? (exit 0 / 1)
//   npm run deps -- --mine P2          the person's tasks grouped by state
//   npm run deps -- --all              whole team view
//   npm run deps -- --sync-labels      recompute status:blocked / status:ready (used by CI)
import { loadPlan, repoName, gh, loadIssuesByTask } from './lib.mjs';

const { tasks, team } = loadPlan();
const repo = repoName(team);
const byId = new Map(tasks.map((t) => [t.id, t]));
const issues = loadIssuesByTask(repo);
const loginOf = (owner) => team[owner]?.github;

const isDone = (id) => issues.get(id)?.state === 'CLOSED';
const openBlockers = (t) => t.blockedBy.filter((b) => !isDone(b));
const stateOf = (t) => (isDone(t.id) ? 'DONE' : openBlockers(t).length ? 'BLOCKED' : 'READY');
const link = (id) => {
  const i = issues.get(id);
  return i ? `#${i.number} ${i.url}` : '(no issue yet)';
};
const line = (t) => `${t.id.padEnd(20)} ${t.owner} ${t.start} -> ${t.due}  ${t.title}`;

function showOne(id) {
  const t = byId.get(id);
  if (!t) {
    console.error(`Unknown task ID: ${id}`);
    process.exit(2);
  }
  console.log(`${t.id}: ${t.title}  (${t.owner}, ${t.start} -> ${t.due})`);
  if (!t.blockedBy.length) console.log('  no blockers');
  for (const b of t.blockedBy) {
    const i = issues.get(b);
    console.log(`  - ${b.padEnd(18)} ${i ? i.state : 'NO ISSUE'}  ${link(b)}`);
  }
  const state = stateOf(t);
  console.log(state === 'BLOCKED' ? `BLOCKED (waiting for: ${openBlockers(t).join(', ')})` : state);
  process.exit(state === 'BLOCKED' ? 1 : 0);
}

function showMine(p) {
  if (!team[p] || !/^P[123]$/.test(p)) {
    console.error('Use --mine P1, P2 or P3');
    process.exit(2);
  }
  const mine = tasks.filter((t) => t.owner === p).sort((a, b) => a.start.localeCompare(b.start) || a.due.localeCompare(b.due));
  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  const groups = { DONE: [], READY: [], BLOCKED: [], PLANNED: [] };
  for (const t of mine) {
    const s = stateOf(t);
    if (s === 'BLOCKED' && t.start > horizon) groups.PLANNED.push(t);
    else groups[s].push(t);
  }
  const next = groups.READY[0];
  console.log(`Tasks of ${p} (${team[p].name}) - today ${today}`);
  console.log('PLANNED = blocked and starting more than 14 days from today.\n');
  for (const g of ['DONE', 'READY', 'BLOCKED', 'PLANNED']) {
    console.log(`== ${g} (${groups[g].length})`);
    for (const t of groups[g]) {
      const extra = g === 'BLOCKED' || g === 'PLANNED' ? `   <- waiting for ${openBlockers(t).join(', ')}` : '';
      console.log(`${t === next ? '>> NEXT ' : '        '}${line(t)}${extra}`);
    }
    console.log('');
  }
  console.log(next ? `Next task to do: ${next.id} - ${next.title}` : 'No READY task: follow the fallback order in your guide (docs, tests, reviews).');
}

function showAll() {
  console.log(`Whole team view (${repo})\n`);
  for (const t of tasks) {
    const s = stateOf(t);
    const why = s === 'BLOCKED' ? `  <- blocked by ${openBlockers(t).join(', ')}` : '';
    console.log(`${s.padEnd(8)} ${t.id.padEnd(20)} ${t.owner} ${t.due}${why}`);
  }
}

function ghLabels(issue) {
  return new Set(issue.labels.map((l) => l.name));
}

function syncLabels() {
  let changed = 0;
  for (const t of tasks) {
    const issue = issues.get(t.id);
    if (!issue) continue;
    const labels = ghLabels(issue);
    const state = stateOf(t);
    const num = String(issue.number);
    const add = [];
    const remove = [];
    if (state === 'DONE') {
      add.push('status:done');
      remove.push('status:blocked', 'status:ready', 'status:in-progress', 'status:in-review');
    } else {
      remove.push('status:done');
      if (!labels.has('status:in-progress') && !labels.has('status:in-review')) {
        if (state === 'READY') { add.push('status:ready'); remove.push('status:blocked'); }
        else { add.push('status:blocked'); remove.push('status:ready'); }
      } else {
        remove.push('status:blocked', 'status:ready');
      }
    }
    const toAdd = add.filter((l) => !labels.has(l));
    const toRemove = remove.filter((l) => labels.has(l));
    if (!toAdd.length && !toRemove.length) continue;
    const args = ['issue', 'edit', num, '--repo', repo];
    for (const l of toAdd) args.push('--add-label', l);
    for (const l of toRemove) args.push('--remove-label', l);
    gh(args);
    changed++;
    console.log(`#${num} ${t.id}: +[${toAdd}] -[${toRemove}]`);
    if (state === 'READY' && labels.has('status:blocked')) {
      const who = loginOf(t.owner);
      gh(['issue', 'comment', num, '--repo', repo, '--body', `@${who} ${t.id} is now unblocked (all blockers merged).`]);
      console.log(`  commented: ${t.id} unblocked`);
    }
  }
  console.log(`Labels synced (${changed} issue(s) changed).`);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: npm run deps -- <TASK-ID> | --mine P1|P2|P3 | --all | --sync-labels');
  process.exit(2);
}
if (args[0] === '--mine') showMine(args[1]);
else if (args[0] === '--all') showAll();
else if (args[0] === '--sync-labels') syncLabels();
else showOne(args[0]);
