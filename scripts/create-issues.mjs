#!/usr/bin/env node
// Creates labels, milestones and one issue per task of docs/plan/tasks.json. Idempotent.
//   node scripts/create-issues.mjs [--dry-run] [--refresh-bodies]
// Issues are found through their `task:<ID>` label. Pass 1 creates the missing issues,
// pass 2 fills the "Blocked by" links (issue links need all issue numbers to exist).
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPlan, readJson, repoName, gh, ghJson, loadIssuesByTask, taskLabel, sleep } from './lib.mjs';

const DRY = process.argv.includes('--dry-run');
const REFRESH = process.argv.includes('--refresh-bodies');
const { tasks, milestones, team } = loadPlan();
const details = readJson('docs/plan/task-details.json');
const repo = repoName(team);
const PENDING = '<!-- blocked-by-pending -->';

const ownerLabel = (o) => team[o].label;
const pkgOf = (req) => {
  const n = Number(req.slice(1));
  return n <= 6 ? 'pkg:core' : n <= 9 ? 'pkg:A' : 'pkg:B';
};
function examLabels(t) {
  if (t.type === 'feature') return ['exam:ingsw', 'exam:tecweb'];
  if (t.type === 'docs') return [t.id.startsWith('TW-') ? 'exam:tecweb' : 'exam:ingsw'];
  if (t.type === 'test') return ['exam:tecweb'];
  return [];
}
function labelsFor(t, status) {
  const l = [ownerLabel(t.owner), `type:${t.type}`, taskLabel(t.id), status, ...examLabels(t)];
  for (const r of t.requirements) l.push(`req:${r}`);
  const pkgs = new Set(t.requirements.map(pkgOf));
  if (pkgs.size === 1) l.push([...pkgs][0]);
  return l;
}

// ---- labels -------------------------------------------------------------------------
function allLabelDefs() {
  const defs = [];
  for (const o of ['P1', 'P2', 'P3']) defs.push([ownerLabel(o), '1f6feb', `Tasks owned by ${team[o].name}`]);
  for (const t of ['feature', 'docs', 'infra', 'test', 'bug', 'contract-change']) defs.push([`type:${t}`, '0e8a16', `Task type: ${t}`]);
  defs.push(['type:directive', 'd93f0b', 'Directive from the coordinator (P3) to a member'], ['priority:high', 'b60205', 'High priority']);
  const st = { blocked: 'b60205', ready: '0e8a16', 'in-progress': 'fbca04', 'in-review': '5319e7', done: '6e7781' };
  for (const [s, c] of Object.entries(st)) defs.push([`status:${s}`, c, `Task status: ${s}`]);
  for (let i = 1; i <= 12; i++) defs.push([`req:R${String(i).padStart(2, '0')}`, 'd4c5f9', `Requirement R${String(i).padStart(2, '0')}`]);
  for (const p of ['core', 'A', 'B']) defs.push([`pkg:${p}`, 'c5def5', `Package ${p}`]);
  for (const e of ['ingsw', 'tecweb']) defs.push([`exam:${e}`, 'bfdadc', `Exam: ${e.toUpperCase()}`]);
  for (const t of tasks) defs.push([taskLabel(t.id), 'ededed', `Plan task ${t.id}`]);
  return defs;
}
function ensureLabels() {
  const existing = new Set(ghJson(['label', 'list', '--repo', repo, '--limit', '500', '--json', 'name']).map((l) => l.name));
  let n = 0;
  for (const [name, color, desc] of allLabelDefs()) {
    if (existing.has(name)) continue;
    console.log(`label + ${name}`);
    if (!DRY) gh(['label', 'create', name, '--repo', repo, '--color', color, '--description', desc]);
    n++;
  }
  console.log(`Labels: ${n} created.`);
}

// ---- milestones ---------------------------------------------------------------------
const msTitle = (m) => `${m.id} ${m.title}`;
function ensureMilestones() {
  const existing = ghJson(['api', `repos/${repo}/milestones?state=all&per_page=100`]);
  for (const m of milestones) {
    if (existing.some((e) => e.title === msTitle(m))) continue;
    console.log(`milestone + ${msTitle(m)}`);
    if (!DRY) {
      gh(['api', '-X', 'POST', `repos/${repo}/milestones`, '-f', `title=${msTitle(m)}`, '-f', `due_on=${m.due}T23:59:59Z`, '-f', `description=Due ${m.due}`]);
    }
  }
}

// ---- issue bodies -------------------------------------------------------------------
const DOC_FILES = {
  'DOC-ARCH-DRAFT': ['docs/ingsw/02-design/architecture.md', 'docs/ingsw/02-design/technologies-and-communication.md', 'docs/uml/er.puml'],
  'DOC-STATE': ['docs/uml/participation-state.puml', 'docs/ingsw/02-design/dynamic-diagrams.md (state diagram)'],
  'DOC-UC01-DRAFT': ['docs/ingsw/01-srs/uc-01-accept-and-complete-secret-timed-mission.md', 'docs/ingsw/01-srs/mockups.md'],
  'DOC-DESIGN-DRAFT': ['docs/uml/domain-class.puml', 'docs/uml/components.puml', 'docs/ingsw/02-design/persistence.md', 'docs/ingsw/02-design/class-diagram.md'],
  'DOC-SRS': ['docs/ingsw/01-srs/ (glossary, actors-and-use-cases, personas, nfr-and-domain, assumptions)', 'docs/uml/use-cases.puml'],
  'TW-README': ['README.md'],
  'TW-SCHEDA': ['docs/tecweb/scheda-sintetica.md'],
  'DOC-GIT': ['docs/ingsw/03-process/git-analysis.md'],
  'DOC-UC01': ['docs/ingsw/01-srs/uc-01-accept-and-complete-secret-timed-mission.md', 'docs/ingsw/01-srs/mockups.md'],
  'DOC-TESTPLAN': ['docs/ingsw/04-testing/test-plan.md', 'docs/ingsw/04-testing/methodology.md'],
  'DOC-UNIT-TIMER': ['docs/ingsw/04-testing/unit-test-timer-policy.md', 'backend/tests/ (TimerPolicy tests)'],
  'DOC-DESIGN-EXAMPLE': ['docs/ingsw/02-design/design-example.md'],
  'DOC-ARCH': ['docs/ingsw/02-design/', 'docs/uml/', 'docs/ingsw/img/'],
  'DOC-SONAR': ['docs/ingsw/03-process/sonar-report.md'],
  'DOC-UNIT-TEAM': ['docs/ingsw/04-testing/unit-test-team-progress.md', 'backend/tests/ (TeamProgressReducer tests)'],
  'DOC-TRACE': ['docs/ingsw/05-traceability/', 'docs/ingsw/00-cover.md', 'package.json (pdf:ingsw)'],
  'REL-RC': ['CHANGELOG / tags', 'docs/'],
  'REL-DRYRUN': ['docs/meetings/'],
  STABILIZE: ['bug-fix PRs in any module (coordinate with the owner)'],
  'QA-SEED': ['backend/src/db/seeds/ (coordinate with the seed owners)'],
  'QA-RESPONSIVE': ['issues filed to the owners of each screen'],
};
const DEFAULT_CHECKLIST = {
  feature: ['Implement the requirement as described in `docs/reference/requirements.md` and the listed assumptions'],
  docs: ['Write the deliverable so that it matches the delivered code and the Appendix of the brief it covers', 'PlantUML drafts are redrawn in Visual Paradigm and exported to `docs/ingsw/img/` when UML is involved', 'Regenerate the PDF if applicable'],
  test: ['Deliver the tests/audit as described in the task title; file issues to the owners for anything found'],
  infra: ['Complete the task as described in the title and record the evidence in PROGRESS.md'],
  bug: ['Fix bugs only (no new features); every fix has a regression test where feasible'],
  'contract-change': ['Review the contract with the other two members, resolve comments, freeze and merge'],
};
const DOD = [
  'Backend: migration(s), models, domain classes, service, controller, routes; input validation with the shared `Validator`; authorization checked in the service layer; meaningful error codes; domain events emitted; OpenAPI fragment updated (`x-status: done`)',
  'Frontend: screens responsive at 360 px and at desktop size; loading, empty and error states; no secret data in the network responses where it is forbidden',
  'Tests: unit tests for the domain classes; integration tests with supertest including **at least one authorization-negative case**; the assigned E2E specs pass in CI',
  'Seeds updated with demo data that makes the feature demonstrable without physical travel',
  '`PROGRESS.md` updated in your section after every step, with a final "DONE" entry linking the PR',
  'Docs updated: the module README, your traceability row (`docs/ingsw/05-traceability/Px.md`), the README features table',
  'CI green. PR approved by your reviewer buddy. Squash-merged with `Closes #<issue>`',
];

function buildBody(t, nums) {
  const d = details[t.id] ?? {};
  const reviewer = team[team[t.owner].reviewer];
  const issueLink = (id) => (nums.get(id) ? `#${nums.get(id)} (${id})` : id);
  const blocked = nums
    ? t.blockedBy.length ? t.blockedBy.map((b) => `- ${issueLink(b)}`).join('\n') : '- none'
    : `${PENDING}\n(filled in by the second pass)`;
  const checklist = d.checklist ?? DEFAULT_CHECKLIST[t.type] ?? [];
  const files = d.files ?? DOC_FILES[t.id] ?? [];
  const docs = ['docs/reference/requirements.md', ...(d.assumptions?.length ? ['docs/decisions/assumptions.md (' + d.assumptions.join(', ') + ')'] : []), ...(d.docs ?? [])];
  const lines = [
    `**Owner:** ${t.owner} – ${team[t.owner].name} (@${team[t.owner].github})`,
    `**Window:** ${t.start} → ${t.due}`,
    `**Reviewer:** ${team[team[t.owner].reviewer].name} (@${reviewer.github})`,
    `**Milestone:** ${t.milestone}`,
    t.requirements.length ? `**Requirements:** ${t.requirements.join(', ')}` : '',
    '',
    `## ${t.title}`,
    '',
    '### Blocked by',
    blocked,
    '',
    'A task may be **started** only when every blocker is DONE (issue closed by a merged PR). Check with `npm run deps -- ' + t.id + '`.',
    '',
    '### Acceptance checklist',
    ...checklist.map((c) => `- [ ] ${c}`),
    ...(t.type === 'feature' ? ['', '#### Definition of Done (docs/plan/PLAN.md §7, CONTRIBUTING.md)', ...DOD.map((c) => `- [ ] ${c}`)] : []),
    ...(d.e2e?.length ? ['', `### E2E specs (docs/tecweb/e2e-catalogue.md)`, ...d.e2e.map((e) => `- [ ] ${e}`)] : []),
    '',
    '### Files and folders the owner may touch',
    ...(files.length ? files.map((f) => `- \`${f}\``) : ['- (see CODEOWNERS; no owned code path)']),
    '',
    '### Related docs',
    ...docs.map((x) => `- ${x}`),
    `- Definition of Done: [CONTRIBUTING.md](https://github.com/${repo}/blob/develop/CONTRIBUTING.md#definition-of-done)`,
    '- Personal guide: `' + guideOf(t.owner) + '`',
  ];
  return lines.filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n');
}
const guideOf = (o) => ({ P1: 'docs/guides/P1-vincenzo-lubrano.md', P2: 'docs/guides/P2-matteo-marino.md', P3: 'docs/guides/P3-domenico-panaro.md' })[o];

// ---- main ---------------------------------------------------------------------------
async function main() {
  ensureLabels();
  ensureMilestones();
  const msByid = new Map(milestones.map((m) => [m.id, m]));
  let issues = DRY ? new Map() : loadIssuesByTask(repo);
  const tmp = mkdtempSync(join(tmpdir(), 'sq-issues-'));
  const bodyFile = (txt) => {
    const f = join(tmp, 'body.md');
    writeFileSync(f, txt);
    return f;
  };

  // pass 1: create missing issues
  for (const t of tasks) {
    if (issues.has(t.id)) continue;
    const status = t.blockedBy.length ? 'status:blocked' : 'status:ready';
    const args = ['issue', 'create', '--repo', repo, '--title', `[${t.id}] ${t.title}`, '--body-file', bodyFile(buildBody(t, null)), '--milestone', msTitle(msByid.get(t.milestone))];
    for (const l of labelsFor(t, status)) args.push('--label', l);
    if (t.owner === 'P3') args.push('--assignee', team.P3.github);
    console.log(`issue + [${t.id}]`);
    if (DRY) continue;
    gh(args);
    await sleep(1200); // be gentle with GitHub's secondary rate limits
  }
  if (DRY) return console.log('Dry run: nothing created.');

  // pass 2: fill the "Blocked by" links
  issues = loadIssuesByTask(repo);
  const nums = new Map([...issues].map(([id, i]) => [id, i.number]));
  for (const t of tasks) {
    const issue = issues.get(t.id);
    if (!issue) continue;
    if (!REFRESH && !issue.body.includes(PENDING)) continue;
    gh(['issue', 'edit', String(issue.number), '--repo', repo, '--body-file', bodyFile(buildBody(t, nums))]);
    console.log(`issue ~ #${issue.number} [${t.id}] blocked-by links`);
    await sleep(500);
  }
  rmSync(tmp, { recursive: true, force: true });
  console.log(`Done: ${issues.size} task issues.`);
}
main().catch((e) => {
  console.error(e.stderr?.toString() || e);
  process.exit(1);
});
