# SConmyway Site

Personal public knowledge pages by SConmyway.

## Sections

- `industry/` - Daily industry briefing with technology news, structural engineering trend insights, and a daily structural design classroom note.

## GitHub Pages

Recommended repository name: `sconmyway-site`.

After pushing this repository to GitHub:

1. Go to repository `Settings`.
2. Open `Pages`.
3. Set `Build and deployment` to `GitHub Actions`.
4. The public page will be available at:

```text
https://<your-github-username>.github.io/sconmyway-site/industry/
```

If this repository is named `<your-github-username>.github.io`, the page will be:

```text
https://<your-github-username>.github.io/industry/
```

## Daily Updates

The current Codex automation updates the local `outputs/industry/` files. For a fully cloud-based daily update, connect a GitHub Actions workflow that updates `industry/daily-data.json`, syncs the fallback data inside `industry/index.html`, commits the result, and redeploys GitHub Pages.
