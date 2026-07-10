# Social Erosion Vignette Survey

A single-page web app for administering a 3×2×2×2 factorial vignette survey on workplace AI use.

## Live site

After deployment: **https://cophee-lab.github.io/SocialErosion-Survey/**

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
