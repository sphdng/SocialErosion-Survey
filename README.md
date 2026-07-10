# Social Erosion Vignette Survey

A single-page web app for administering a 3×2×2×2 factorial vignette survey on workplace AI use.

## Live site

See [DEPLOY.md](./DEPLOY.md) for full troubleshooting.

**Important:** This repo is currently private. For participants to access the survey without a GitHub login, the repo must be **public** (Settings → General → Change visibility).

After a successful deploy, find your URL at **Settings → Pages** in the repo.

- Participant survey: `/`
- Dev mode (password-gated): `/dev`

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
