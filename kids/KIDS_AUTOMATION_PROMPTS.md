# Kids Weekly Codex Automation

## Purpose

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

## Primary Refresh Contract

1. Work only on `kids/` and the kids synchronization/validation helpers.
2. Read `kids/KIDS_PAGE_GUIDE.md` and `kids/PUBLIC_RELEASE_CHECKLIST.md` first.
3. Fetch the public Sydney and Melbourne JSON and inspect the local files.
4. Determine the current Friday-to-Friday publication period in Australia/Sydney.
5. Search current public sources again. Do not treat last week's JSON as a candidate source.
6. Cover Sydney and Melbourne councils, major venues, official event pages, family festivals, shows, markets, exhibitions, outdoor programs and community/open days.
7. Use social media and discovery sites only as leads, then verify against an organiser, council, venue or official ticketing page.
8. Remove expired, cancelled, date-unclear and weakly verified items.
9. Publish exactly 8 main events per city. Cards 1-4 must be newly found, one-off, short-window or concretely dated within the new publication week.
10. Put long-running attractions at card 5 or later. Put library/storytime, toddler-only and generic directory links in More or omit them.
11. Rewrite both JSON files completely, including `updatedAt`, `periodStart`, `periodEnd`, main events and More links.
12. Keep Chinese and English facts equivalent. English fields and English UI text must contain no Chinese.
13. Run `py -3 scripts/sync-kids-static.py`.
14. Validate JSON, UTF-8, Friday-to-Friday dates, 8+8 cards, English fields, official links, More links and `git diff --check`.
15. Commit only the intentional kids files, rebase on current `origin/main`, push with `git push origin HEAD:main`, and verify `origin/main`.
16. Fetch cache-busted public JSON and Pages HTML. Confirm the period, both first titles, 8+8 cards and mobile layout before reporting success.

Changing only the date, reusing old cards as fresh research, publishing fewer than 8 cards, or leaving expired cards in place is a failed run.

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
