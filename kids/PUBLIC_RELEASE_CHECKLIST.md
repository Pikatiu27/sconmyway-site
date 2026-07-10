# Kids Public Release Outline

## 1. Page Purpose

- Help adults quickly choose a family outing in Sydney or Melbourne.
- Default state: Sydney + Events + Chinese.
- Keep Events and Playgrounds as separate views under the same city selection.
- Design for phone use first: short title, clear controls, compact cards, and one-row actions.

## 2. Weekly Event Selection

- Publication window is Friday to the following Friday.
- Search again every week; never reuse old cards by changing dates only.
- Remove ended, cancelled, weakly verified, and generic directory entries.
- Each city has 8 main cards. Cards 1-4 must be newly found, one-off, short-window, or clearly dated current-week outings.
- Prefer activities adults can enjoy with children: festivals, shows, markets, exhibitions, outdoor trails, major venues, and food-plus-activity outings.
- Put library storytime, baby/toddler-only sessions, generic venue pages, and lower-confidence leads in More or omit them.
- Verify date, time, location, price, age limits, booking conditions, and official URL against the organiser or venue page.

## 3. Copy Rules

- Chinese and English must communicate the same facts, not merely similar marketing language.
- English mode must contain no Chinese UI labels or Chinese event fields.
- Chinese mode uses natural Chinese for descriptions, regions, tags, actions, and source labels; official place and event names may remain in English.
- Each card uses one concise body paragraph: what it is, what the family will do, and who it suits.
- Do not show prefixes such as `亮点：`, `推荐理由：`, `Why go:`, or star ratings.
- Status labels describe timing only: `本周精选 / Weekly pick`, `继续推荐 / More picks`, `长期活动 / Ongoing`.

## 4. Card Structure

- Tag -> status -> title -> concise description -> time/location/price facts -> actions -> reference.
- Facts use icons instead of visible Time/Place/Cost words.
- Action order is always `官网 / Official`, `导航 / Map`, `分享 / Share`.
- Share links preserve city, language, view, and the exact card target.
- If no official page exists, keep Map and Share; do not show an empty Official button.

## 5. Layout and Interaction

- Hero title stays on one line on common phone widths.
- City and view selectors appear together in the finder controls; do not duplicate them elsewhere.
- At 430px and below, action buttons remain a three-column row.
- More and Sources remain collapsed by default.
- Playground filters apply to the selected city's complete directory and hide empty regions.
- Chinese mode translates region names, feature tags, actions, descriptions, and half-day suggestions.

## 6. Friday Schedule

- Friday 05:00 Australia/Sydney: recurring Codex task performs fresh research, rewrites both city JSON files, syncs the static HTML fallback, validates, commits, pushes, and checks the public page.
- Friday 07:00: freshness recovery check. If the 05:00 publication is missing or invalid, rerun the complete research workflow; never publish a date-only retry.
- GitHub Actions is the watchdog and deployment layer. It validates freshness and links but does not invent or select event content.
- No OpenAI API key is required for the manual-research publication path.

## 7. Release Gate

- Both JSON files decode as UTF-8 and contain exactly 8 main events.
- Period dates are Friday-to-Friday and `updatedAt` is the publication Friday.
- English fields contain no Chinese characters.
- JSON, generated HTML fallback, More links, and guide rules agree.
- Official and More links do not return known broken-page statuses.
- Default state is Sydney + Events; city, view, language, filters, navigation, and deep-link sharing work.
- Check phone-width layout for overflow, wrapping, overlaps, and three-button action rows.
- Push only after all checks pass, then verify `origin/main`, GitHub Pages deployment, public JSON, and the public page separately.
