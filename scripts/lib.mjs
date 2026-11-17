// Shared helpers for the planning scripts (Node.js, no npm dependencies).
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

export const loadPlan = () => ({
  tasks: readJson('docs/plan/tasks.json'),
  milestones: readJson('docs/plan/milestones.json'),
  team: readJson('docs/plan/team.json'),
});

export const repoName = (team) => process.env.GH_REPO || team.repo;

/** Runs the gh CLI and returns stdout. Throws on a non-zero exit code. */
export function gh(args, { input } = {}) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    input,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

export const ghJson = (args) => JSON.parse(gh(args) || 'null');

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Task ID -> label name used to find the issue of a task. */
export const taskLabel = (id) => `task:${id}`;

/** Loads every issue of the repo and maps task ID -> issue (via the task:<ID> label). */
export function loadIssuesByTask(repo) {
  const issues = ghJson([
    'issue', 'list', '--repo', repo, '--state', 'all', '--limit', '500',
    '--json', 'number,title,state,labels,url,body',
  ]);
  const map = new Map();
  for (const issue of issues) {
    for (const l of issue.labels) {
      if (l.name.startsWith('task:')) map.set(l.name.slice(5), issue);
    }
  }
  return map;
}
