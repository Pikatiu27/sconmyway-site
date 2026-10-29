# Kids Research and Publication Automation

## Schedule - Effective 30 October 2026

All times are Australia/Sydney local time, including daylight saving. Keep the existing conversation and heartbeat kids-weekly-refresh; do not create new chats or duplicate automations. The old kids-weekly-retry remains paused.

| Day | 05:00 primary | 07:00 recovery | 08:30 GitHub watchdog |
| --- | --- | --- | --- |
| Friday | Full new-edition research and publication | Verify Friday success; recover only if incomplete | Check Friday freshness and links |
| Tuesday | Same-edition midweek research and publication | Verify Tuesday success; recover only if incomplete | Check Tuesday review freshness and links |

The 07:00 run is a failure compensation check, not an additional content edition. Stay quiet on unchanged healthy no-ops; notify on publication completion, failure or required user action. Preserve the notification policy. The app schedule follows Sydney local time; UTC candidates in the kids-only GitHub watchdog are filtered by scripts/kids-refresh-calendar.mjs.

## Friday Full Edition

- Determine the current Friday-to-next-Friday period in Australia/Sydney.
- Fresh-search Sydney and Melbourne across councils, local tourism/precinct pages, major venues, festivals, shows, markets, community/open days and verified family programs. Use discovery/social sites as leads only.
- Build a region/type/availability candidate matrix, aiming for about 20 real candidates per city before selection. Prefer adult-accompanied outings over child-only drop-off programs. Check the exact year, place, sessions, booking/availability, cancellations and weather notices.
- Replace the edition rather than reusing old cards with new dates. Target 8 verified main cards plus 3-5 checked More links per city. Cards 1-4 must be genuinely new, short-window or concretely dated current-week finds. Research replacements; document reduced coverage rather than pad with weak items.
- Remove ended, cancelled, sold-out, unrelated, empty or unverified items. Keep library/storytime/toddler-only items out of the main cards. Generic directories are labelled backup finders, not events.
- Set updatedAt = periodStart, lastReviewedAt = actual review date and refreshKind = weekly. Record real current linkReview evidence for every main and current More item.

## Tuesday Midweek Review

- Keep the same Friday-to-Friday period and original Friday updatedAt. Never roll the period to Tuesday or make up a new edition date.
- Search official sources again in both cities. Revisit every retained main and current More item, check tickets/sold-out/cancelled state, remove items ended before the actual review date and research new remaining-week replacements.
- Newly found remaining-week events go first; verified ongoing outings can follow. Aim for 8 plus 3-5, but do not force four new events or retain expired cards to fill slots. Publish fewer verified items with a documented shortfall.
- Set lastReviewedAt = actual research date and refreshKind = midweek, retaining updatedAt = periodStart. Renew each retained main/current More linkReview.checkedAt and evidence from the actual official pages, not by mechanically stamping dates.
- Remove obsolete presentation entries and recheck retained routes, opening calendars and bilingual display copy for the remaining days. Keep all presentation metadata in the same publication period with the same lastReviewedAt as both feeds.

## Recovery and No-op Proof

At 07:00 compare local, origin/main and cache-busted public feeds, presentation JSON, actual counts, ordering, first titles and current review evidence. On Friday prove the fresh new edition and first-four research; on Tuesday prove the midweek re-review, additions/removals or a concrete source-backed no-change audit. A matching Friday period alone is not enough on Tuesday. lastReviewedAt must cover the due run in both cities, and retained item reviews must support that date.

No-op only after all three states agree and that day's real work is proved. If not, resume the relevant Friday or Tuesday job in this chat; do not start a new conversation or retry old design tasks. Save candidates/evidence locally before lengthy work. A docs-only commit, passing layout test or successful Pages deployment with stale review data is not a successful research update. Report the unfinished stage on failure.

## Publication Data and Validation

- Work only on kids, its sync/validation helpers and the kids-only watchdog. Never touch industry.
- Read KIDS_PAGE_GUIDE.md, PUBLIC_RELEASE_CHECKLIST.md, this file and LINK_PUBLICATION_POLICY.md before work. No OPENAI_API_KEY or scripts/update-kids-events.mjs.
- For each main/current More item verify event identity, exact dates/place and booking details on organiser, council, venue or official ticketing pages. HTTP status alone is not proof. Record linkReview status/url/checkedAt/evidence and preserve unique stable shareKey values.
- refresh-policy.json defines the active Tue/Fri schedule from 30 October 2026. updatedAt remains the Friday edition date; lastReviewedAt is the actual latest review date. Never advance either without real research. Both city lastReviewedAt values must agree.
- event-presentation.json must match periodStart, periodEnd and lastReviewedAt. Rebuild verified date labels, actual session dates/dateReview, optional intro/familyFit/note/timeShort bilingual pairs, showFullTime and copyReview. Include only verified family conditions. Full original hours remain in event data and the time sheet; closure and booking warnings remain visible.
- Optional routes need named map-linked stops, purposes aligned with steps, original notes, official sources and actual checkedAt/evidence. Never invent journey durations, facilities or opening hours. Omit unverified routes. Missing/mismatched display metadata must not inject old facts.
- Run node scripts/check-kids-update.mjs prepare on both feeds and inspect the per-item reports. Individual link failures are replaced/removed without blocking healthy verified content; structural UTF-8/JSON/date/fallback defects block publication.
- Run validate-content and validate for both feeds. The latter enforces the due Tuesday/Friday review after the policy start date. Run scripts/test-kids-refresh-calendar.mjs, test-kids-publication.mjs, test-kids-filters.mjs and py -3 scripts/test-kids-static.py. Sync twice with py -3 scripts/sync-kids-static.py and compare hashes. Run git diff --check.
- Use Playwright CLI with scripts/check-kids-layout.js, scripts/check-kids-family.js and scripts/check-kids-reading.js on both cities/languages and common phone widths/short heights. Commit only intentional files, fetch/rebase origin/main, push git push origin HEAD:main, verify remote and Pages completion, then compare cache-busted public feeds/presentation/HTML and check the public mobile UI.

## Approved Mobile Journal - 30 October 2026

Preserve family-journal.css/js, journal.js, field-notes.*, event-filters.mjs, self-hosted fonts/icons and the sync template. Keep the cold-white, pale strawberry/aqua journal, compact header with saved outings/language in one row, one-line H1, native 16px city selector and Events/Playgrounds tabs, Area/Date/Free filters, small date tickets, full-width phone icon facts, concise intro and optional family fit/note, and one source/Map/Share action row.

No arrow expansion inside cards. Full opening hours and View route open native detail sheets. Finished-this-week uses a View text entry and one sheet for list -> outing -> secondary details, with back/close, an explicit finished status and direct historical share/saved links. Never stack modals or expose ended cards as available recommendations. Bookmarks remain browser-local with missing-edition and storage-failure handling. More/Sources stay independently collapsed. Keep the week range separate from the smaller last-reviewed date; do not change either when someone visits.

Never publish event photographs, gallery, duplicate subtitles, extra labels, kids/preview/, kids/output/, screenshots, trial assets or private research attachments. A schedule/data-rule change must not redesign the page. A design-only release is not a successful Friday or Tuesday research run.

Preserve the approved reading hierarchy in family-journal.css/js and sync-kids-static.py on every primary and recovery run. Generate three unframed groups: heading/facts; body then family suitability then important reminder; route/actions/reference. Body15px/1.7 uses existing dark ink; family text14px regular muted below body; reminders14px/1.65 are flush-left with12px top spacing, NO vertical rule, NO indentation and no extra visible labels. Source12px regular muted sits below the one-row46px actions with a quiet horizontal separator. Phone titles18-19px, compact date tabs and16px native city control remain. Put the Full opening hours link beside the time text; keep native route/time sheets, bookmarks and one-modal finished navigation. Optional noteEmphasis {zh:[],en:[]} must quote exact phrases in the newly verified noteZh/noteEn; omit when unnecessary, never copy old-week phrases or hardcode an event/date in runtime JS. Recheck bilingual meaning and run static hierarchy/emphasis plus browser hierarchy tests after regeneration. This preservation rule does not change the Tuesday/Friday05:00 and07:00 schedule or notification policy.
