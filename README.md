# SConmyway Site

Public GitHub Pages site for SConmyway.

## Main Page

- Industry brief: `industry/`
- Public URL: `https://pikatiu27.github.io/sconmyway-site/industry/`
- Local repo: `C:\Users\silin\Documents\Codex\sconmyway-site`

## Industry Brief

Key files:

- `industry/index.html`
- `industry/daily-data.json`
- `industry/INDUSTRY_BRIEFING_GUIDE.md`
- `scripts/update-industry-briefing.py`

Update rule:

- Refresh all industry brief content every day at 05:00 Australia/Sydney.
- Do not only change the date.
- After rewriting `daily-data.json`, run the sync script to update the embedded fallback and validate the page.

