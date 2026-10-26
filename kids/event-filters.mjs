export function weekDates(start, end) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return [];
  const dates = [];
  for (let time = Date.parse(`${start}T12:00:00Z`); time < Date.parse(`${end}T12:00:00Z`) && dates.length < 7; time += 86400000) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }
  return dates;
}

export const regionKey = event => event.tagEn.split(' · ')[0];
export const isFree = event => /^Free\b/i.test(event.priceEn.trim());

export function availabilityFor(event, feed, availability) {
  if (!availability || availability.periodStart !== feed.periodStart || availability.periodEnd !== feed.periodEnd) return null;
  const item = availability.items?.[event.shareKey || event.url];
  const review = item?.dateReview;
  if (typeof review?.evidence !== 'string' || !review.evidence.trim() || review.url !== event.url || !/^\d{4}-\d{2}-\d{2}$/.test(review.checkedAt || '') || review.checkedAt < feed.periodStart || review.checkedAt >= feed.periodEnd) return null;
  const dates = item?.dates;
  if (!Array.isArray(dates) || !dates.every(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= feed.periodStart && date < feed.periodEnd)) return null;
  return dates;
}

export function matchEvent(event, filters, feed, availability) {
  if (filters.area && regionKey(event) !== filters.area) return { match: false, uncertain: false };
  if (filters.free && !isFree(event)) return { match: false, uncertain: false };
  if (!filters.date) return { match: true, uncertain: false };
  if (event.endsOn && event.endsOn < filters.date) return { match: false, uncertain: false };
  const dates = availabilityFor(event, feed, availability);
  return { match: dates === null || dates.includes(filters.date), uncertain: dates === null };
}
