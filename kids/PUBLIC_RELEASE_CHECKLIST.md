# Kids Public Release Outline

## Approved Compact Copy - 30 October 2026

Keep the approved15px body and existing palette,spacing,unframed groups and native sheets. Aim for one concrete experience sentence,about25-45Chinese characters or15-25English words and2-3lines on375-430px phones. These are editorial targets,not clipping rules; narrow screens,long official names and essential conditions may need more lines. No smaller body font,line clamps,ellipsis or extra disclosures.

Standalone family suitability is only for verified decision-relevant conditions,not generic family-friendly filler. Put charges in the price row once. Omit reminders that merely repeat free entry,purchases extra,included museum entry or an already-visible unknown fee/booking condition. Keep every material registration,age,accompaniment,stroller/access,weather,cancellation,source-conflict and separate start-location restriction visible; important multi-session timing may remain longer.

Reference text is organisation names only using same-edition referenceZh/referenceEn presentation fields and Source/来源 labels. The real checked date stays in the header; complete sources and evidence remain in canonical event data. Missing matching presentation metadata falls back safely to full original copy. Check bilingual equivalence,unclipped15px text,compact organisation sources and route/time/share/bookmark behaviour. A copy-only release preserves event identity,counts,order,dates,official/map links,prices,More,evidence and routes and is not a new research run. Primary and recovery tasks use this density without changing schedule or notifications.

## Approved Reading Hierarchy - 30 October 2026

This supersedes older type sizes and card ordering, without changing the palette, controls, weekly research rules or today's researched content. Preserve three unframed static groups: heading/facts; description/family suitability/reminder; route/actions/reference. Body is15px/1.7 in existing dark ink; family suitability is14px regular muted text below body; reminders are14px/1.65 with12px top spacing, flush-left with NO vertical rule or indentation. References are12px regular muted text after the action row with a quiet horizontal separator. Titles are18-19px on phones; the page title remains one line. City select stays16px and action targets46px.

Optional per-edition noteEmphasis {zh:[],en:[]} contains exact existing reminder phrases only. Safe static rendering must not alter copy, fabricate restrictions or retain old-week phrases; missing emphasis simply renders plain text. Never hardcode event-specific emphasis in runtime JS. Full hours sit beside time text and keep the native detail sheet. Routes, bookmarks, single-modal finished navigation and bilingual content remain intact.

Run the static hierarchy/emphasis test and scripts/check-kids-reading.js through Playwright CLI in addition to existing release gates. Check mobile languages for correct hiding of nested time spans, no overflow and one-row actions; resync twice to ensure the structure survives regeneration. Do not publish the old preview HTML or change feed dates for a typography-only release. This contract applies equally to Tuesday/Friday primary and recovery runs; schedule and notification policy are unchanged.

## Twice-Weekly Schedule - From 30 October 2026

- Tuesday/Friday 05:00 Australia/Sydney: primary research and publish; 07:00: failure recovery only; 08:30: kids-only GitHub freshness/link watchdog. Keep this conversation and the existing notification policy.
- Friday rebuilds the edition with four genuinely fresh leading candidates, replacing expired/cancelled/sold-out items. Tuesday re-researches and rechecks the remaining week, removes ended/sold-out/cancelled items and adds verified new finds without forcing four new entries.
- periodStart/periodEnd stay Friday-to-Friday and updatedAt stays that edition's Friday. lastReviewedAt is the actual latest research date; refreshKind is weekly or midweek. Both feeds and presentation metadata must agree on period and review date. Never roll the range to Tuesday or stamp a review date without real source checks.
- From the effective date validate must prove the latest due Tuesday/Friday review, including retained item evidence. Run test-kids-refresh-calendar.mjs as well as existing tests. Check AEST/AEDT gates, midweek review display and second-sync idempotence. A correct Friday period does not prove Tuesday success.
- Keep the current journal layout, native sheets, bookmarks, languages and source/Map/Share behaviour. Only the small checked-date value changes after a genuine midweek review; this schedule change does not alter activity content.

## Current Design Contract - 29 October 2026

This section supersedes older inline-disclosure and palette descriptions below. Preserve the approved cold-white, pale strawberry/aqua family journal and compact phone header, browser-local bookmarks for events/playgrounds, and the new family-journal CSS/JS alongside the existing filter and sync code. Cards have no inline arrow disclosures: route summaries and Full opening hours open native detail sheets, with closures/booking/critical family conditions still visible. Finished-this-week uses a View text entry and one sheet for list -> outing -> secondary details, with back/close controls, an explicit finished status and working historical share/saved targets. Never stack an outing detail modal inside the finished modal. More/Sources retain independent collapsed behaviour.

Weekly presentation fields are period-scoped: intro, familyFit, note and timeShort bilingual pairs, showFullTime, copyReview, and optional route.purposes aligned with checked route.steps. Facts, stops, dates and sources must be freshly verified, not hardcoded into runtime code or copied from a previous week. Missing fields fall back to complete event copy. No photographs, preview files, screenshots or private research attachments are published.

In addition to the tests below, run scripts/check-kids-family.js through Playwright CLI. Inspect current cards, saved list, finished list/detail/secondary navigation, all short-phone sheets and both languages. A layout-only release with unchanged event feeds must be reported as such, not as a content refresh.

## 1. Page Purpose

The [Link Publication Policy](LINK_PUBLICATION_POLICY.md) supersedes older fixed-count and all-links-must-pass rules. Run per-item preparation before static sync; publish verified items even when below the target count.

- Help adults quickly choose a family outing in Sydney or Melbourne.
- Default state: Sydney + Events + Chinese.
- Keep Events and Playgrounds as separate views under the same city selection.
- Design for phone use first: short title, clear controls, compact cards, and one-row actions.

## 2. Weekly Event Selection

- Publication window is Friday to the following Friday.
- Search again every week; never reuse old cards by changing dates only.
- Remove ended, cancelled, weakly verified, and generic directory entries.
- Each city targets 8 main cards; fewer verified cards are allowed. Cards 1-4 must be newly found, one-off, short-window, or clearly dated current-week outings.
- Prefer activities adults can enjoy with children: festivals, shows, markets, exhibitions, outdoor trails, major venues, and food-plus-activity outings.
- Put verified library storytime and baby/toddler-only sessions in More or omit them. Unverified leads are excluded, not moved to More. Generic directories may appear only as clearly labelled backup finders.
- Verify date, time, location, price, age limits, booking conditions, and official URL against the organiser or venue page.

## 3. Copy Rules

- Chinese and English must communicate the same facts, not merely similar marketing language.
- English mode must contain no Chinese UI labels or Chinese event fields.
- Chinese mode uses natural Chinese for descriptions, regions, tags, actions, and source labels; official place and event names may remain in English.
- Each card uses one concise body paragraph: what it is, what the family will do, and who it suits.
- Do not show prefixes such as `亮点：`, `推荐理由：`, `Why go:`, or star ratings.
- Small date tabs describe verified timing only; use `持续展出 / On now` for continuing exhibitions. No ratings or duplicate recommendation/category labels. Set `longTerm` explicitly after research.

## 4. Card Structure

- Small date tab -> title -> one region line -> time/location/price facts -> concise description -> optional collapsed half-day route -> actions -> reference.
- Public event cards contain no photographs or gallery. Local trial assets and screenshots are excluded from publication.
- Use white 8px cards and small category-coloured date tickets. On phones, time, place and cost each occupy a full-width icon row; only wider layouts may put place and cost in columns.
- Half-day disclosures use a title, a short summary and one right-aligned chevron. Expanded rows align phase and specific map-linked place; notes and sources remain inside the disclosure.
- Facts use icons instead of visible Time/Place/Cost words.
- Action order is always verified source, `导航 / Map`, `分享 / Share`. Source labels match their destination: `官网 / Official`, `官方公告 / Announcement`, or `购票 / Tickets`.
- Share links preserve city, language, view, and the exact card target.
- Playground cards without a relevant official page keep Map and Share. Event cards require a verified event detail page, announcement or official ticket page; otherwise replace or omit the event.

## 5. Layout and Interaction

- Hero title stays on one line on common phone widths.
- Order: brand/language -> one-line title -> publication week -> city dropdown and view tabs on one row -> filters -> cards. The selection summary is screen-reader-only.
- The native city select is 16px on phones, at least 120px wide on narrow screens. Sydney and Melbourne must remain complete on one line.
- At 430px and below, action buttons remain a three-column row.
- More and Sources remain collapsed by default.
- More links use a title on the first line and a smaller source below, with bilingual fields and one disclosure icon.
- Show the publication week with a smaller update date beside it (wrapping only when needed); do not advance dates when someone opens the page.
- Use one title per card in the selected language; do not add a duplicate English subtitle in Chinese mode.
- Fold activities that have ended within the publication week, using Australia/Sydney dates, while keeping share targets and deep-link auto-expansion. Do not change publication dates or claim a weekly refresh for this display behaviour.
- Presentation metadata is matched by shareKey and exact publication period; missing or mismatched metadata must not inject old dates, copy or routes into a new week.
- Preserve existing unique share keys when correcting official URLs; do not give two cards the same share target.
- Playground filters apply to the selected city's complete directory and hide empty regions.
- Chinese mode translates region names, feature tags, actions, descriptions, and half-day suggestions.
- Phone descriptions are 15px/1.7; facts and primary actions are approximately 13px. Actions are 46px high. Do not solve overflow by shrinking the entire interface.
- Area/date/free-entry filters are functional and independent per city. A phone bottom sheet scrolls its choices while keeping close/apply reachable, including at 320x568 and with safe-area insets.
- `event-presentation.json` records optional verified publication-week `dates` plus `dateReview` (checkedAt, matching official URL, concrete evidence) per stable shareKey. Unknown calendars show a warning, not an assumed daily session. Never reuse mismatched-week dates.
- Preserve `field-notes.css`, `field-notes.js`, `event-filters.mjs`, journal behaviour and the generated static heading/facts/actions on every Friday refresh. Do not reintroduce preview paths, photographs, old CSS, duplicate headings or event-specific dates in runtime code.
- Fonts are self-hosted Unicode-range variable subsets with licenses, not a snapshot-only character subset.

## 6. Research Schedule

- Tuesday/Friday 05:00 Australia/Sydney: execute the respective midweek/full-edition research, sync, validation, commit, push and public verification.
- Tuesday/Friday 07:00: recover only if that day's research/publication is missing or invalid; never publish a date-only retry.
- GitHub Actions is the watchdog and deployment layer. It validates freshness and links but does not invent or select event content.
- No OpenAI API key is required for the manual-research publication path.

## 7. Release Gate

- Both JSON files decode as UTF-8 and contain at most 8 verified main events each. Target 8, but publish fewer after replacement research rather than pad with unverified items.
- Period dates are Friday-to-Friday and `updatedAt` is the publication Friday.
- English fields contain no Chinese characters.
- JSON, generated HTML fallback, More links, and guide rules agree.
- Verify the actual content of every selected event and More destination. Retry temporary failures, find verified alternatives, then replace or omit unresolved entries without blocking healthy items. HTTP status alone is not verification.
- Default state is Sydney + Events; city, view, language, filters, navigation, and deep-link sharing work.
- Check phone-width layout for overflow, wrapping, overlaps, and three-button action rows.
- Run `py -3 scripts/test-kids-static.py`, `node scripts/test-kids-publication.mjs`, and `node scripts/test-kids-filters.mjs`; check sync idempotence. Use the Playwright CLI with `scripts/check-kids-layout.js` for both cities/languages and common phone widths, including route/map/share and ended links.
- Push only after all checks pass, then verify `origin/main`, GitHub Pages deployment, public JSON, and the public page separately.
