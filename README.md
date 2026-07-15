# Workplace Vignette Study

A Next.js presentation layer for a 24-condition workplace AI vignette
study. Vercel displays the assigned vignette; NYU Qualtrics displays the
five response questions and records all responses.

The application does not store participant answers.

## Study URLs

Direct condition links run from:

```text
http://localhost:3000/study?vignette=v01
http://localhost:3000/study?vignette=v24
```

The default assignment mode is `query-param`. A missing or invalid
condition produces an error rather than silently assigning a participant.
Change `assignmentMode` in `config/study.json` to `random` only when the
study team explicitly approves client-side random assignment.

## Editable configuration

- `config/study.json` — assignment and integration settings
- `config/vignettes.json` — all vignette text, metadata, and five question
  definitions per condition

The recovered final vignette text is present for all 24 conditions.
Question wording remains visibly marked `[PLACEHOLDER]`; replace it before
data collection. See
[`docs/ADDING_OR_EDITING_VIGNETTES.md`](docs/ADDING_OR_EDITING_VIGNETTES.md).

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/study?vignette=v01`.

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
5. Deploy and test several condition links on desktop and mobile.
6. Submit test responses and verify embedded data in Qualtrics.

## Qualtrics integration

Qualtrics must have the five stable response fields and embedded-data
fields described in
[`docs/QUALTRICS_SETUP.md`](docs/QUALTRICS_SETUP.md).

The application exposes read-only public configuration at:

```text
/api/study-config/v01
```

Editing JSON only updates the wording inside Qualtrics after the documented
Qualtrics custom JavaScript is installed. Until then, manually synchronize
JSON and Qualtrics wording before every deployment.

If NYU Qualtrics blocks iframe embedding, the participant can use the
condition-preserving direct link shown below the iframe. Do not proxy or
bypass Qualtrics security headers.
