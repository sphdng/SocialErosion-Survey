# Workplace Vignette Study

A Next.js presentation layer for a 24-condition workplace AI vignette
study. Each participant sees all 24 vignettes in order. Vercel keeps the
current vignette visible; NYU Qualtrics repeats the same five response
questions for each vignette and records all 120 answers.

The application does not store participant answers.

## Study flow

```text
Start page → 24 vignettes → five Qualtrics questions per vignette
```

Qualtrics Loop & Merge controls progression and only advances after all
five required questions for the current vignette are answered.

## Editable configuration

- `config/study.json` — assignment and integration settings
- `config/background.json` — start-page and background-dialog content
- `config/vignettes.json` — all vignette text, metadata, and question
  mappings

The recovered final vignette text is present for all 24 conditions.
Question wording remains visibly marked `[PLACEHOLDER]`; replace it before
data collection. See
[`docs/ADDING_OR_EDITING_VIGNETTES.md`](docs/ADDING_OR_EDITING_VIGNETTES.md).

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Validation and tests:

```bash
npm run lint
npm test
npm run build
```

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_QUALTRICS_SURVEY_URL=https://nyu.qualtrics.com/jfe/form/SV_by0axqrHkdSorA2
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The Qualtrics distribution URL is public, not a secret. Never add an API
token to a `NEXT_PUBLIC_` variable.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Keep the detected framework preset as **Next.js**.
3. Add both environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production Vercel domain.
5. Deploy and test the full 24-vignette flow on desktop and mobile.
6. Submit test responses and verify embedded data in Qualtrics.

## Qualtrics integration

Qualtrics must have the five stable response fields and embedded-data
fields described in
[`docs/QUALTRICS_SETUP.md`](docs/QUALTRICS_SETUP.md).

The application exposes read-only public configuration at:

```text
/api/study-config/v01
```

The documented Qualtrics message bridge tells the parent website when Loop
& Merge advances, allowing the left vignette panel and progress indicator
to stay synchronized without exposing answers.

If NYU Qualtrics blocks iframe embedding, the participant can use the
condition-preserving direct link shown below the iframe. Do not proxy or
bypass Qualtrics security headers.
