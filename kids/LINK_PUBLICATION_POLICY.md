## Link Degradation and Publication Policy

- Target 8 main cards and 3-5 More links per city, not hard minimums. Research replacements first; publish fewer verified items when needed. Keep fresh dated events first and log shortfalls.
- Check exact event identity, dates, place and booking details on official sources. HTTP 200 alone proves nothing. A homepage redirect, empty page or unrelated directory is not an event detail link.
- Retry temporary failures and seek an organiser, council, venue, official announcement or official ticket page. A 403/timeout is inconclusive, not a cancellation.
- Record `linkReview: {status: "verified", url, checkedAt: "YYYY-MM-DD", evidence}` on every main and More item. URL must match the displayed URL; evidence must describe the verified facts, not just reachability.
- Use `linkType: "official" | "announcement" | "tickets"` and a verified alternative URL. Preserve a unique `shareKey` when changing destinations.
- Remove unverified, unrelated, cancelled or expired events; never use More as a holding area for failures. Generic directories are only backup finder links, not current events.
- Run `node scripts/check-kids-update.mjs prepare kids/data/events.json` and likewise for `melbourne-events.json`. Review `*.review.json`, then run `py -3 scripts/sync-kids-static.py`. Preparation filters individual failures and logs reduced counts; it does not browse or perform semantic verification itself.
- Run `validate-content` for both files and the static regression tests before publishing. Malformed JSON, UTF-8 errors, mismatched periods and HTML/data mismatch still block publication. Zero verified events must show an empty state, never stale cards.
- Transport audits report individual failures without rolling back healthy content. The next research/recovery run must review those warnings and replace/remove affected items.
- Playground cards without a relevant official detail page retain Map and Share only, in two columns. Do not label a generic council directory as a playground detail page.
- Verify actual counts, periods and first titles in public JSON and HTML after push. Reduced coverage never justifies a date-only refresh.

