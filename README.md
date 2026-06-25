# SConmyway Site

Public GitHub Pages repo for SConmyway.

## Pages

- Kids finder: `kids/`
  - Public URL: `https://pikatiu27.github.io/sconmyway-site/kids/`
  - Guide: `kids/KIDS_PAGE_GUIDE.md`
- Industry brief: `industry/`
  - Public URL: `https://pikatiu27.github.io/sconmyway-site/industry/`
  - Guide: `industry/INDUSTRY_BRIEFING_GUIDE.md`

## Kids Update Rule

Every Friday at 0:00 Australia/Sydney, the kids page must refresh the new Friday-to-Friday week.

The weekly job must:

- Re-fetch sources.
- Re-screen and re-rank activities.
- Delete expired activities.
- Add the newest relevant activities.
- Put new / short-date events first and ongoing activities later.
- Regenerate JSON data.
- Sync the HTML fallback cards.
- Validate UTF-8, JSON, English text, card counts and Friday-to-Friday dates.
- Commit, push and confirm `origin/main`.

Do not reuse old static DATA as this week’s content, and do not only change the date.

## Commands

```bash
npm run update:kids
```

GitHub Actions uses Node 20.

