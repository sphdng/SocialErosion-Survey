# Social Erosion Vignette Survey

A single-page web app for administering a 3×2×2×2 factorial vignette survey on workplace AI use.

## Live site

Find your deployed URL under **Settings → Pages** in the repo (it will look like `https://something.pages.github.io/`).

- Participant survey: `/`
- Dev mode (password-gated): `/dev`

> **Note:** If the repo is **private**, only logged-in GitHub users with repo access can view the site. For a participant-facing survey, the repo should be **public** (Settings → General → Change visibility).

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically deploy via GitHub Actions.

To enable GitHub Pages the first time:

1. Go to **Settings → Pages** in the repo
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or re-run the workflow from the Actions tab)
