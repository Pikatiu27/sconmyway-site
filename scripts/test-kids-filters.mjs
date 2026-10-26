import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { weekDates, regionKey, isFree, availabilityFor, matchEvent } from '../kids/event-filters.mjs';

const feed = { periodStart: '2026-10-23', periodEnd: '2026-10-30' };
const oneOff = { shareKey: 'stable-key', url: 'https://example.org/festival', tagEn: 'Inner West · Festival', priceEn: 'Free entry; food extra', endsOn: '2026-10-25' };
const paid = { ...oneOff, shareKey: 'paid', url: 'https://example.org/exhibition', priceEn: 'Adult $25; children free', endsOn: '2026-11-04' };
const metadata = { ...feed, items: { 'stable-key': { dates: ['2026-10-25'], dateReview: { checkedAt: '2026-10-23', url: oneOff.url, evidence: 'Official organiser: Sunday 25 October only.' } } } };
const blank = { area: '', date: '', free: false };
let checks = 0;
function check(condition, message) { checks++; assert.ok(condition, message); }
check(weekDates(feed.periodStart, feed.periodEnd).length === 7, 'Seven selectable days');
check(weekDates(feed.periodStart, feed.periodEnd).at(-1) === '2026-10-29', 'Following Friday excluded');
check(weekDates('invalid', feed.periodEnd).length === 0, 'Invalid date rejected');
check(regionKey(oneOff) === 'Inner West', 'Region is separate from category');
check(isFree(oneOff), 'Free entry with paid extras qualifies');
check(!isFree(paid), 'Child concession is not free family admission');
check(matchEvent(oneOff, blank, feed, metadata).match, 'No filters preserves event');
check(matchEvent(oneOff, { ...blank, area: 'Inner West' }, feed, metadata).match, 'Matching area');
check(!matchEvent(oneOff, { ...blank, area: 'Other' }, feed, metadata).match, 'Other area excluded');
check(matchEvent(oneOff, { ...blank, free: true }, feed, metadata).match, 'Free filter includes free event');
check(!matchEvent(paid, { ...blank, free: true }, feed, metadata).match, 'Free filter excludes paid event');
check(matchEvent(oneOff, { ...blank, date: '2026-10-25' }, feed, metadata).match, 'Verified event date included');
check(!matchEvent(oneOff, { ...blank, date: '2026-10-24' }, feed, metadata).match, 'Known non-session date excluded');
check(!matchEvent(oneOff, { ...blank, date: '2026-10-27' }, feed, metadata).match, 'Finished event excluded');
check(matchEvent(paid, { ...blank, date: '2026-10-27' }, feed, metadata).uncertain, 'Unknown calendar warns instead of inventing sessions');
check(availabilityFor(oneOff, feed, { ...metadata, periodEnd: '2026-11-06' }) === null, 'Wrong week ignored');
for (const patch of [{ dateReview: null }, { dateReview: { ...metadata.items['stable-key'].dateReview, checkedAt: '2026-10-16' } }, { dateReview: { ...metadata.items['stable-key'].dateReview, url: 'https://example.org/other' } }, { dateReview: { ...metadata.items['stable-key'].dateReview, evidence: '' } }, { dates: ['2026-10-30'] }, { dates: ['2026-10-25', 'invalid'] }]) {
  const invalid = { ...metadata, items: { 'stable-key': { ...metadata.items['stable-key'], ...patch } } };
  check(availabilityFor(oneOff, feed, invalid) === null, 'Unverified or malformed date metadata is ignored');
}

const presentation = JSON.parse(readFileSync('kids/data/event-presentation.json', 'utf8'));
const keys = new Set();
for (const filename of ['events.json', 'melbourne-events.json']) {
  const data = JSON.parse(readFileSync(`kids/data/${filename}`, 'utf8'));
  check(data.periodStart === presentation.periodStart && data.periodEnd === presentation.periodEnd, 'Presentation matches both city periods');
  for (const event of data.events) {
    const key = event.shareKey || event.url;
    keys.add(key);
    const item = presentation.items[key];
    if (item?.dates !== undefined) {
      const dates = availabilityFor(event, data, presentation);
      check(dates !== null, `Valid reviewed dates: ${key}`);
      check(new Set(dates).size === dates.length, 'No duplicate dates');
      check(dates.every(day => !event.endsOn || day <= event.endsOn), 'No date after the event ends');
      const validDays = new Set(weekDates(data.periodStart, data.periodEnd));
      check(dates.every(day => validDays.has(day)), 'Every date is inside the actual seven-day period');
    }
    check(matchEvent(event, blank, data, presentation).match, 'Current event remains without filters');
  }
}
check(Object.keys(presentation.items).every(key => keys.has(key)), 'No obsolete presentation entries');
console.log(`${checks} event filter and weekly metadata tests passed`);
