#!/usr/bin/env node
// Validates docs/plan/tasks.json: unique IDs, existing blockers, no cycles,
// dates consistent with blockers (warning) and inside the milestone (error).
import { loadPlan } from './lib.mjs';

const { tasks, milestones } = loadPlan();
const errors = [];
const warnings = [];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const OWNERS = new Set(['P1', 'P2', 'P3']);

const byId = new Map();
for (const t of tasks) {
  if (byId.has(t.id)) errors.push(`duplicate task id: ${t.id}`);
  byId.set(t.id, t);
}
const msById = new Map(milestones.map((m) => [m.id, m]));

for (const t of tasks) {
  if (!OWNERS.has(t.owner)) errors.push(`${t.id}: invalid owner ${t.owner}`);
  if (!ISO.test(t.start) || !ISO.test(t.due)) errors.push(`${t.id}: dates must be ISO YYYY-MM-DD`);
  else if (t.start > t.due) errors.push(`${t.id}: start ${t.start} is after due ${t.due}`);
  const ms = msById.get(t.milestone);
  if (!ms) errors.push(`${t.id}: unknown milestone ${t.milestone}`);
  else if (t.due > ms.due) errors.push(`${t.id}: due ${t.due} is after milestone ${ms.id} (${ms.due})`);
  for (const b of t.blockedBy) {
    const blocker = byId.get(b);
    if (!blocker) errors.push(`${t.id}: blockedBy refers to unknown task ${b}`);
    else if (blocker.due > t.start) {
      warnings.push(`${t.id} starts ${t.start}, before blocker ${b} is due (${blocker.due})`);
    }
  }
}

// Cycle detection (DFS with colours).
const colour = new Map();
const stack = [];
function visit(id) {
  colour.set(id, 1);
  stack.push(id);
  for (const b of byId.get(id)?.blockedBy ?? []) {
    if (!byId.has(b)) continue;
    if (colour.get(b) === 1) {
      errors.push(`dependency cycle: ${[...stack.slice(stack.indexOf(b)), b].join(' -> ')}`);
    } else if (!colour.has(b)) visit(b);
  }
  stack.pop();
  colour.set(id, 2);
}
for (const t of tasks) if (!colour.has(t.id)) visit(t.id);

for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
if (errors.length) {
  console.error(`\nPlan INVALID: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Plan OK: ${tasks.length} tasks, no cycles, ${warnings.length} warning(s).`);
