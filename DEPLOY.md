# Deploying to GitHub Pages

## Why you might see "404 — There isn't a GitHub Pages site here"

This usually means one of three things:

### 1. The repo is private (most common for org repos)

`cophee-lab/SocialErosion-Survey` is **private**. On GitHub Free **organization** plans, Pages sites from private repos are **only visible to people with repo access** — participants without GitHub access will see a 404.

**Fix for a participant-facing survey:** make the repo public.

1. Go to https://github.com/cophee-lab/SocialErosion-Survey/settings
2. Scroll to **Danger Zone → Change repository visibility**
3. Set to **Public**

The app has no secrets worth hiding (the dev password is only casual access control).

### 2. GitHub Pages source is not set to Actions

1. Go to https://github.com/cophee-lab/SocialErosion-Survey/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch")
3. Save

### 3. The deploy workflow hasn't run or failed

1. Go to https://github.com/cophee-lab/SocialErosion-Survey/actions
2. Open **Deploy to GitHub Pages**
3. If the latest run failed, open it and read the error
4. If it says **"Waiting for approval"**, approve the `github-pages` environment deployment (org admins may need to do this once)
5. To re-deploy manually: **Actions → Deploy to GitHub Pages → Run workflow**

## Finding your live URL

After a successful deploy, the URL is shown on:

**Settings → Pages** (top of the page, green checkmark)

It will look like one of:

- `https://cophee-lab.github.io/SocialErosion-Survey/`
- `https://socialeosion-survey.pages.github.io/` (or similar)

Use **that exact URL** — don't guess.

| Page | Path |
|------|------|
| Survey | `/` |
| Dev mode | `/dev` |

## Local build check

```bash
npm run build
npm run preview
```

Visit http://localhost:4173 to confirm the app builds correctly before deploying.
