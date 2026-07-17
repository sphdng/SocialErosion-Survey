# Workplace Vignette Study

A Next.js survey for a 24-condition workplace AI vignette study with 300
planned participants. Each participant receives six counterbalanced
vignettes, answers the same five questions in a fixed order, and saves one
long-format row per vignette to Supabase.

## Study flow

```text
Consent → Participant ID → timed background reading → 6 counterbalanced
vignettes → 5 required questions per vignette → completion
```

The consent page requires agreement and provides the full consent form
PDF. The background timer starts only after PID registration and counts
time while the introduction page is visible. Each Save and continue click
validates all five answers, writes the current row, and advances only
after Supabase confirms the save.

## Editable configuration

- `config/study.json` — study size and assignment mode
- `config/consent.json` — consent-page copy and PDF link
- `config/background.json` — background-page and dialog content
- `config/vignettes.json` — vignette text and factor metadata
- `config/questions.json` — the five shared questions and response scale
- `config/counterbalance.json` — all 300 six-vignette assignment orders
- `public/aise_consent_form.pdf` — downloadable consent form

All five shared questions have confirmed wording. See
[`docs/ADDING_OR_EDITING_VIGNETTES.md`](docs/ADDING_OR_EDITING_VIGNETTES.md).

The assignment table gives every vignette exactly 75 exposures. Every
participant receives two vignettes from each task type and a 3/3 split on
each binary factor. Vignette positions differ by at most one exposure.
Regenerate and validate the table with `npm run generate:counterbalance`.

## Local setup

Local Supabase requires Docker Desktop.

```bash
npm install
npx supabase start
npx supabase status
```

Copy `.env.example` to `.env.local`, then copy the local service-role key
reported by `npx supabase status`:

```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

The service-role key is server-only. Never rename it with a
`NEXT_PUBLIC_` prefix or commit `.env.local`.

Start the website:

```bash
npm run dev
```

Open `http://localhost:3000`. The migration creates:

- `participants` — one row per PID
- `vignette_responses` — one row per PID and vignette
- `analysis_responses` — a view with the column names shown in the target
  analysis schema, including introduction reading time and descriptive
  IV/DV labels

Reset the local database and reapply migrations with:

```bash
npx supabase db reset
```

## Validation

```bash
npm run lint
npm test
npm run build
```

## Vercel and hosted Supabase

For production, link the local Supabase project to a hosted Supabase
project and apply the migration. Add its URL and service-role key as
server-side Vercel environment variables. The browser never receives
database credentials; all writes go through validated Next.js API routes.
