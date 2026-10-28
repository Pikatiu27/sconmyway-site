# Kids Weekly Codex Automation

## Approved Journal Contract - 29 October 2026

This contract supersedes the 26 October colour and inline-disclosure instructions. On every 05:00 refresh and 07:00 recovery preserve family-journal.css, family-journal.js, journal.js, field-notes.*, event-filters.mjs, the self-hosted assets and sync template. Keep the pale strawberry/aqua, cold-white mobile journal; compact header with saved outings/language in one row; date tickets; separate icon facts; optional checked family-fit line; concise intro and practical note; route summary; source/Map/Share row; weak reference. No event photos or published preview assets.

No arrow expansion inside cards. Full opening hours and View route use native detail sheets. Finished-this-week uses View and a single sheet for the list, exact activity and secondary details; preserve back/close, finished status and direct historical share/saved links. Never nest modals or unhide ended cards in the main list. Bookmark data stays only in the visitor's browser, with missing-edition and storage-failure handling.

Refresh same-period presentation fields from current research: introZh/En, familyFitZh/En only if verified, noteZh/En, timeShortZh/En, showFullTime, copyReview with actual checkedAt/URL/evidence, and optional route.purposes paired with route.steps. Retain complete event time facts for details and visible closure/booking warnings. Never hardcode event identities or copy old-week display metadata. Keep exact shareKey stability. Run both scripts/check-kids-layout.js and scripts/check-kids-family.js via Playwright CLI after static sync, in addition to static/publication/filter/content/freshness checks.

Research coverage: apply the guide's region/type/availability candidate matrix. Search council plus local tourism/precinct pages, major venues, family festivals/shows/markets, cultural/community days, open days/fire displays and store-specific Bunnings events. Distinguish adult-accompanied outings from child-only drop-off programs. Verify exact year, local venue, live booking/sold-out/cancelled state and weather notices; sold-out entries do not belong in available recommendations. Discovery/social pages remain leads only. Keep library/storytime/toddler-only entries out of the main cards. Record gaps and rejected leads rather than pad. This changes neither the Friday schedule nor notification policy.

## Purpose

The [Link Publication Policy](LINK_PUBLICATION_POLICY.md) supersedes older fixed-count and all-links-must-pass rules. Run per-item preparation before static sync; publish verified items even when below the target count.

The kids page uses the same execution model as the Industry Review:

- A scheduled Codex task performs fresh public-web research and publication.
- Repository scripts only synchronize and validate files; they do not generate content.
- GitHub Actions is an 08:30 final watchdog. It reports stale or invalid data after both Codex runs but never rolls dates forward.
- No `OPENAI_API_KEY` is required.

## Schedule

| Task | Australia/Sydney time | Behaviour |
| --- | --- | --- |
| Primary refresh | Friday 05:00 | Research, rewrite, validate, commit, push, verify |
| Recovery review | Friday 07:00 | No-op if current and genuinely refreshed; otherwise research and republish |
| GitHub final audit | Friday 08:30 | Validate freshness, JSON and links after both Codex runs |

The automation RRULE is evaluated in the Codex app's local project schedule, matching the Industry Review setup.

As of 11 September 2026, both 05:00 and 07:00 use the same `kids-weekly-refresh` heartbeat in this conversation. The older standalone `kids-weekly-retry` cron is paused to avoid creating another conversation. The 07:00 run follows the same current-week comparison and stops only after verified success.

## Primary Refresh Contract

### Completion and recovery guard

- During a scheduled refresh or recovery, resume the current publication week after any interruption. Do not replace the task with older design/documentation requests from this conversation.
- After research, write the selected candidates and evidence to local files before continuing. The publication is unfinished until both event JSON files and the generated fallback contain the newly researched week.
- Run `validate` (current-week freshness) as well as `validate-content` for both city files. A passing layout test or successful documentation push does not prove a content refresh.
- Completion requires cache-busted public JSON to match local JSON for both cities, with current period, newly researched first four items, counts and first titles. Report failure if this proof is absent; never report a docs-only deployment as a weekly refresh.

1. Work only on `kids/` and the kids synchronization/validation helpers.
2. Read `kids/KIDS_PAGE_GUIDE.md`, `kids/PUBLIC_RELEASE_CHECKLIST.md` and `kids/LINK_PUBLICATION_POLICY.md` first.
3. Fetch the public Sydney and Melbourne JSON and inspect the local files.
4. Determine the current Friday-to-Friday publication period in Australia/Sydney.
5. Search current public sources again. Do not treat last week's JSON as a candidate source.
6. Cover Sydney and Melbourne councils, major venues, official event pages, family festivals, shows, markets, exhibitions, outdoor programs and community/open days.
7. Use social media and discovery sites only as leads, then verify against an organiser, council, venue or official ticketing page.
8. Remove expired, cancelled, date-unclear and weakly verified items.
9. Target 8 main events per city; publish fewer if replacement research yields fewer verified events. Cards 1-4 must be newly found, one-off, short-window or concretely dated within the new publication week.
10. Put long-running attractions after fresh dated events, normally at card 5 or later. Only verified library/storytime and toddler-only items may go in More; generic directories must be labelled backup finders. Never put unresolved links in More.
11. Rewrite both JSON files completely, including `updatedAt`, `periodStart`, `periodEnd`, main events and More links.
    Refresh `kids/data/event-presentation.json` for that same period: verified date tabs, category, equivalent concise bilingual copy and optional evidence-backed half-day routes, keyed by stable shareKey. Omit uncertain routes. Never carry a previous period's dates or routes forward. Public cards remain text-only; do not commit local preview photographs, screenshots or preview files.
    Rebuild optional `dates` and `dateReview` for date filtering from current official session/opening facts. dates contains only actual ISO days within this publication week; dateReview stores checkedAt, the matching official URL and concrete evidence. Omit dates for unknown calendars rather than assuming daily opening. Never reuse a previous week's dates or hardcode current event identities/dates into the filter code.
12. Keep Chinese and English facts equivalent. English fields and English UI text must contain no Chinese.
13. Record matching current `linkReview` evidence for every selected main and More URL. Run `prepare` with `scripts/check-kids-update.mjs` for both JSON files, inspect both review reports, then run `py -3 scripts/sync-kids-static.py`. Resolve structural errors; individual rejected links must not block healthy content.
14. Validate JSON, UTF-8, Friday-to-Friday dates, actual per-city card counts (target 8+8), English fields, official links, More links and `git diff --check`.
15. Commit only the intentional kids files, rebase on current `origin/main`, push with `git push origin HEAD:main`, and verify `origin/main`.
16. Fetch cache-busted public JSON and Pages HTML. Confirm the period, both first titles, actual per-city card counts (target 8+8) and mobile layout before reporting success.

## Approved Mobile Layout, 26 October 2026

- The phone is the primary interface. Preserve `kids/field-notes.css`, `kids/field-notes.js`, `kids/event-filters.mjs`, existing journal behaviour and the static generator, not a frozen preview page.
- Header/language -> one-line H1 -> publication week -> 16px native city dropdown and adjacent Events/Playgrounds tabs -> Area/Date/Free filters -> white cards with small coloured date tickets.
- Phone facts use three full-width icon rows: time, place, cost. Description 15px/1.7, facts/actions about 13px. Source/Map/Share remain one 46px-high row. No photographs, coloured sidebars, duplicate titles or extra visible selection summary.
- Half-day disclosure retains its title, short summary and chevron; expanded phase/place rows have verified named map stops, notes and official sources inside.
- Preserve per-city filtering, verified session dates and unknown-calendar warning. The mobile filter sheet must keep actions visible on short screens and respect safe-area insets.
- Run static/publication/filter tests and sync twice to confirm no layout rollback. Use `scripts/check-kids-layout.js` via Playwright CLI on both cities/languages at common phone widths; inspect screenshots, route toggle, maps, share deep links and ended auto-expansion.
- Existing Friday 05:00 primary and 07:00 recovery schedule and notification policy stay unchanged. A design-only release is not a researched weekly content refresh.

Changing only the date, reusing old cards as fresh research, leaving unverified or expired cards in place is a failed run.

## Recovery Review Contract

At 07:00, compare:

- local Sydney and Melbourne JSON;
- `origin/main` Sydney and Melbourne JSON;
- cache-busted public Sydney and Melbourne JSON;
- the current Friday-to-Friday period;
- both first four title sets;
- the last successful kids commit.

Return `no-op verification` only when all three states match, the current period is correct, and the first four cards in each city are genuinely new or short-window selections. A date-only change is not current content.

If any check fails, execute the complete Primary Refresh Contract and report `retry publish` with the commit hash and public verification result.

## Local Automation IDs

- `kids-weekly-refresh`
- `kids-weekly-retry`

Their runtime configuration lives under `C:\Users\silin\.codex\automations`. This file is the repository-side source of truth for rebuilding the tasks if the local Codex configuration is moved or lost.
