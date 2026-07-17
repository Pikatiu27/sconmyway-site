# Kids Page Backup Plan

Current policy: no API-based weekly generation. `kids-weekly-refresh` starts the Friday refresh at 05:00 Australia/Sydney and `kids-weekly-retry` performs a 07:00 no-op/recovery review. Both are local Codex automations that can research, update files, push GitHub and verify the public page. GitHub Actions is the independent watchdog: it performs one final audit at 08:30, but it does not generate event content.

The recurring Codex task is external to this repository. If that task is unavailable or disabled, GitHub will report a failed freshness check rather than silently reusing last week's page.

## Friday Refresh Contract

1. Clear the previous run assumptions first: do not reuse old DATA, do not roll dates forward, and do not keep ended events.
2. Search broadly across official council pages, major venue pages, city What's On pages, festival pages, and reliable discovery sources.
3. Verify each selected main-card activity against an official page or host page before it enters the top eight.
4. Put library storytime, toddler-only activities, and weakly verified discovery leads into More or skip them.
5. First four cards per city must be newly found or short-window current-week activities.
6. Continuing or long-running activities can remain only after fresher items.
7. Write both JSON files, then sync the static HTML fallback before pushing.
8. Verify public GitHub Pages after push; if Pages lags, wait and re-check rather than claiming success early.

## If Friday Push Fails

- Keep the current public page live; do not push a date-only update.
- Fix the local data first, then retry the GitHub push.
- If GitHub is temporarily unavailable, commit locally and retry later.
- If a source cannot be verified, remove it from the main eight and use a verified backup source.
- If More links fail or open blank pages, replace them with verified official category pages.
- At 07:00 Australia/Sydney, check the public page again. If the 05:00 refresh did not complete, rerun the same full research workflow; never perform a date-only retry.

## Refresh Checklist

- `kids/data/events.json` and `kids/data/melbourne-events.json` period: 2026-07-10 to 2026-07-17.
- Sydney has 8 main cards, Melbourne has 8 main cards.
- More sections contain real links, not placeholders.
- `kids/index.html` fallback cards match the JSON data.
- English page action labels and references remain English.
- No API key is required for the kids refresh.
