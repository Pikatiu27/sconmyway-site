# Kids Finder Token Usage

This report tracks OpenAI API tokens used by the weekly Sydney and Melbourne event updater.

It does **not** include Codex/ChatGPT conversation tokens, GitHub Actions runtime, GitHub Pages visits, map clicks, official-site clicks, or shared-link visits.

<!-- TOKEN_USAGE_ROWS_START -->
| Run time (Sydney) | Model / mode | Melbourne input | Melbourne output | Sydney input | Sydney output | Total tokens |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 04 July 2026 12:30 | Manual official-source refresh, no API call | 0 | 0 | 0 | 0 | 0 |
| 03 July 2026 05:23 | Fallback (no API tokens) | 0 | 0 | 0 | 0 | 0 |
<!-- TOKEN_USAGE_ROWS_END -->

Only the latest 26 runs are retained. Token counts come directly from the OpenAI Responses API `usage` object when the automated updater calls the API.
