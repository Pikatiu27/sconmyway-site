import { readFileSync } from 'node:fs';

export const policy = JSON.parse(readFileSync(new URL('../kids/refresh-policy.json', import.meta.url), 'utf8'));
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function localParts(date = new Date()) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: policy.timezone, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
}
export function dateKey(date = new Date()) {
  const parts = localParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function shiftDay(iso, amount) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
export function publicationPeriod(date = new Date()) {
  const today = dateKey(date);
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const start = shiftDay(today, -((weekday - dayNames.indexOf(policy.periodAnchor) + 7) % 7));
  return { periodStart: start, periodEnd: shiftDay(start, 7) };
}
export function dueRefreshDate(date = new Date()) {
  const parts = localParts(date);
  const today = dateKey(date);
  for (let offset = 0; offset < 7; offset++) {
    const candidate = shiftDay(today, -offset);
    const weekday = dayNames[new Date(`${candidate}T12:00:00Z`).getUTCDay()];
    if (policy.refreshDays.includes(weekday) && (offset > 0 || Number(parts.hour) >= policy.primaryHour)) return candidate;
  }
  throw new Error('No scheduled refresh date found');
}
export function auditWindow(date = new Date()) {
  const parts = localParts(date);
  return policy.refreshDays.includes(parts.weekday) && Number(parts.hour) === policy.auditHour && Number(parts.minute) === policy.auditMinute;
}
export function validateRefresh(data, date = new Date()) {
  const today = dateKey(date);
  const period = publicationPeriod(date);
  if (data.periodStart !== period.periodStart || data.periodEnd !== period.periodEnd || data.updatedAt < period.periodStart) {
    throw new Error('Feed was not refreshed for the current Australia/Sydney publication week');
  }
  if (data.periodStart < policy.effectiveFrom) return;
  if (data.updatedAt !== data.periodStart || !['weekly', 'midweek'].includes(data.refreshKind)) {
    throw new Error('Expected Friday edition updatedAt and weekly/midweek refreshKind');
  }
  const due = dueRefreshDate(date);
  const reviewed = data.lastReviewedAt;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewed || '') || reviewed < data.periodStart || reviewed < due || reviewed > today || reviewed >= data.periodEnd) {
    throw new Error(`Both-city review must be current for the ${due} research run`);
  }
  const expectedKind = due <= data.periodStart ? 'weekly' : 'midweek';
  if (data.refreshKind !== expectedKind) throw new Error('refreshKind does not match the due weekly/midweek job');
  for (const item of [...data.events, ...(data.moreLinks || []).filter(item => item.kind !== 'backup')]) {
    if (!item.linkReview?.checkedAt || item.linkReview.checkedAt < reviewed || item.linkReview.checkedAt > today) {
      throw new Error('Every retained activity and current More link needs review evidence for this run');
    }
  }
}
