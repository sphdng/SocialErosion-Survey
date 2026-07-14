# Keeping both GitHub remotes in sync

This repo has two remotes:

| Remote | Repo | Role |
|--------|------|------|
| `origin` | https://github.com/sphdng/SocialErosion-Survey | Your personal copy (default push/pull) |
| `upstream` | https://github.com/cophee-lab/SocialErosion-Survey | Lab / shared copy |

You're currently on branch `dev` for day-to-day work. `main` matches both remotes at setup time.

> Note: GitHub org policy blocked a true *fork* of `cophee-lab/SocialErosion-Survey`, so this is a mirrored personal repo with the same history and an `upstream` remote.

## Pull lab changes into your copy

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

Then update your working branch:

```bash
git checkout dev
git merge main
git push origin dev
```

## Push your changes to the lab repo

When you have write access to `cophee-lab/SocialErosion-Survey`:

```bash
git checkout main
git merge dev          # if your work lives on `dev`
git push origin main   # personal
git push upstream main # lab
```

Or push one branch to both remotes in one go:

```bash
git push origin main
git push upstream main
```

## Typical workflow

1. Work on `dev`
2. `git push origin` (updates your personal GitHub)
3. When ready to share with the lab, merge into `main` and `git push upstream main`
