// Self-check of the history ordering (built-in node:test, no dependency): node --test scripts/history.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProgress, sortEntries } from './history.mjs';

const progress = [
  '# Log', '',
  '## P1 – A', '',
  '### 2026-11-20 09:00 · R01 · newest of P1', '- c', '',
  '### 2026-11-18 10:00 · R01 · same minute, written second', '- b', '',
  '### 2026-11-18 10:00 · R01 · same minute, written first', '- a', '',
  '## P3 – C', '',
  '### 2026-11-19 08:00 · R10 · between', '- d', '',
  '### 2026-11-17 · SETUP · no time', '- e', '',
].join('\n');

test('parses sections, headings, bodies and the time flag', () => {
  const e = parseProgress(progress);
  assert.equal(e.length, 5);
  assert.deepEqual([e[0].section, e[0].body, e[0].timed], ['P1 – A', '- c', true]);
  assert.deepEqual([e[4].section, e[4].key, e[4].timed], ['P3 – C', '2026-11-17 00:00', false]);
});

test('orders across sections by date and time; same minute: lower in the file is older', () => {
  const titles = sortEntries(parseProgress(progress)).map((x) => x.heading.split(' · ').pop());
  assert.deepEqual(titles, ['no time', 'same minute, written first', 'same minute, written second', 'between', 'newest of P1']);
});
