import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const source = JSON.parse(readFileSync('kids/data/events.json', 'utf8'));
const directory = mkdtempSync(join(tmpdir(), 'kids-publication-'));
let checks = 0;
function prepare(mutate, expected, expectFailure = false) {
  const data = structuredClone(source);
  mutate(data);
  const path = join(directory, 'events.json');
  writeFileSync(path, JSON.stringify(data));
  const result = spawnSync(process.execPath, ['scripts/check-kids-update.mjs', 'prepare', path], { encoding: 'utf8' });
  if (expectFailure) assert.notEqual(result.status, 0);
  else {
    assert.equal(result.status, 0, result.stderr);
    const prepared = JSON.parse(readFileSync(path, 'utf8'));
    assert.equal(prepared.events.length, expected);
    const report = JSON.parse(readFileSync(path.replace('.json', '.review.json'), 'utf8'));
    assert.equal(report.mainCount, expected);
  }
  checks++;
}
try {
  prepare(() => {}, 8);
  prepare(d => { d.events[0].linkReview.status = 'unrelated'; }, 7);
  prepare(d => { d.events[0].url = 'https://example.com/'; }, 7);
  prepare(d => { delete d.events[0].linkReview; }, 7);
  prepare(d => { d.events[0].summaryEn = '\u4e2d\u6587'; }, 7);
  prepare(d => { d.events[0].endsOn = '2020-01-01'; }, 7);
  prepare(d => { d.events[0].cancelled = true; }, 7);
  prepare(d => { d.events.forEach(e => e.linkReview.status = 'unavailable'); }, 0);
  prepare(d => { d.moreLinks.forEach(e => e.linkReview.status = 'empty'); }, 8);
  prepare(d => { d.events[0].timeEn += '; closed Tuesday'; }, 8);
  prepare(d => { d.periodEnd = d.periodStart; }, 0, true);
  console.log(`${checks} publication degradation tests passed`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
