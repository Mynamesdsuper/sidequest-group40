// Self-check of the history ordering (built-in node:test, no dependency): node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProgress, sortEntries } from './history.mjs';

const progress = [
  '# Log', '',
  '## P1 – A', '',
  '### d · R01 · second', '- b', '',
  '### d · R01 · first', '- a', '',
  '## P3 – C', '',
  '### d · R10 · local', '- c', '',
].join('\n');

test('parses sections, headings and bodies', () => {
  const e = parseProgress(progress);
  assert.deepEqual(e.map((x) => [x.section, x.heading, x.body]), [
    ['P1 – A', 'd · R01 · second', '- b'],
    ['P1 – A', 'd · R01 · first', '- a'],
    ['P3 – C', 'd · R10 · local', '- c'],
  ]);
});

test('orders by commit time, same commit oldest-first, uncommitted last', () => {
  const e = parseProgress(progress);
  const sha = 'a'.repeat(40);
  const blame = new Map([
    [e[0].line, { sha, time: 100, author: 'x' }],
    [e[1].line, { sha, time: 100, author: 'x' }],
    [e[2].line, { sha: '0'.repeat(40), time: 1, author: 'Not Committed Yet' }],
  ]);
  const sorted = sortEntries(e, blame, 999);
  assert.deepEqual(sorted.map((x) => x.heading), ['d · R01 · first', 'd · R01 · second', 'd · R10 · local']);
  assert.equal(sorted[2].sha, null);
});
