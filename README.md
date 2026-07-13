# Social Erosion Survey (NYU Qualtrics + Vercel)

Next.js App Router page that embeds the NYU Qualtrics survey at `/survey`.

## Qualtrics survey

```text
https://nyu.qualtrics.com/jfe/form/SV_by0axqrHkdSorA2
```

Responses are submitted directly to Qualtrics (not stored on Vercel).

## Local development

```bash
npm install
npm run dev
```

Open:

- http://localhost:3000/ → redirects to `/survey`
- http://localhost:3000/survey

## Environment variable

`.env.local` (already created locally; do not commit secrets beyond the public survey URL):

```bash
NEXT_PUBLIC_QUALTRICS_SURVEY_URL=https://nyu.qualtrics.com/jfe/form/SV_by0axqrHkdSorA2
```

## Deploy to Vercel

1. Push this repo to GitHub (or import the existing `cophee-lab/SocialErosion-Survey` repo).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variable:
   - Name: `NEXT_PUBLIC_QUALTRICS_SURVEY_URL`
   - Value: `https://nyu.qualtrics.com/jfe/form/SV_by0axqrHkdSorA2`
   - Environments: Production, Preview, Development
5. Deploy.
6. Share the Vercel URL + `/survey` with participants (root also redirects there).

## If the iframe is blocked

Some Qualtrics setups block embedding (`X-Frame-Options` / `frame-ancestors`). The page already includes an **Open survey** fallback link. If embedding fails for everyone, switch `app/survey/page.tsx` to a button-only layout as described in the project instructions.
