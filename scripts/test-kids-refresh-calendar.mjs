import assert from 'node:assert/strict';
import { auditWindow, dueRefreshDate, publicationPeriod, validateRefresh } from './kids-refresh-calendar.mjs';

let checks = 0;
const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
const passes = (data, now) => { validateRefresh(data, new Date(now)); checks++; };
const fails = (data, now) => { assert.throws(() => validateRefresh(data, new Date(now))); checks++; };
const friday = {
  periodStart:'2026-10-30', periodEnd:'2026-11-06', updatedAt:'2026-10-30',
  refreshKind:'weekly', lastReviewedAt:'2026-10-30',
  events:[{linkReview:{checkedAt:'2026-10-30'}}], moreLinks:[]
};
const tuesday = {...friday, refreshKind:'midweek', lastReviewedAt:'2026-11-03',events:[{linkReview:{checkedAt:'2026-11-03'}}]};
equal(publicationPeriod(new Date('2026-11-02T18:00:00Z')), {periodStart:'2026-10-30',periodEnd:'2026-11-06'});
equal(publicationPeriod(new Date('2026-10-29T18:00:00Z')), {periodStart:'2026-10-30',periodEnd:'2026-11-06'});
equal(dueRefreshDate(new Date('2026-11-02T17:59:00Z')), '2026-10-30');
equal(dueRefreshDate(new Date('2026-11-02T18:00:00Z')), '2026-11-03');
equal(dueRefreshDate(new Date('2026-11-02T20:00:00Z')), '2026-11-03');
equal(dueRefreshDate(new Date('2026-10-29T18:00:00Z')), '2026-10-30');
equal(auditWindow(new Date('2026-11-02T21:30:00Z')), true);
equal(auditWindow(new Date('2026-11-02T22:30:00Z')), false);
equal(auditWindow(new Date('2026-10-29T21:30:00Z')), true);
equal(auditWindow(new Date('2026-10-29T22:30:00Z')), false);
equal(auditWindow(new Date('2026-06-22T22:30:00Z')), true);
equal(auditWindow(new Date('2026-06-22T21:30:00Z')), false);
equal(auditWindow(new Date('2026-06-18T22:30:00Z')), true);
equal(auditWindow(new Date('2026-11-03T21:30:00Z')), false);
passes(friday, '2026-10-29T18:00:00Z');
passes({...friday,lastReviewedAt:'2026-10-31',events:[{linkReview:{checkedAt:'2026-10-31'}}]},'2026-10-31T01:00:00Z');
passes(friday, '2026-11-02T17:59:00Z');
fails(friday, '2026-11-02T18:00:00Z');
passes(tuesday, '2026-11-02T18:00:00Z');
passes(tuesday, '2026-11-04T23:00:00Z');
fails({...tuesday, updatedAt:'2026-11-03'}, '2026-11-02T20:00:00Z');
fails({...tuesday, lastReviewedAt:'2026-11-04'}, '2026-11-02T20:00:00Z');
fails({...tuesday, refreshKind:'weekly'}, '2026-11-02T20:00:00Z');
fails({...tuesday, events:friday.events}, '2026-11-02T20:00:00Z');
fails({...tuesday, moreLinks:[{linkReview:{checkedAt:'2026-10-30'}}]}, '2026-11-02T20:00:00Z');
fails({...tuesday, lastReviewedAt:undefined}, '2026-11-02T20:00:00Z');
fails(tuesday, '2026-11-05T18:00:00Z');
passes({periodStart:'2026-10-23',periodEnd:'2026-10-30',updatedAt:'2026-10-23',events:[]},'2026-10-28T23:00:00Z');
console.log(`${checks} twice-weekly calendar and freshness checks passed`);
