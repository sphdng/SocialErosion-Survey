# Editing study content

## Vignettes

`config/vignettes.json` contains the 24 scenarios. Keep IDs in order from
`v01` through `v24`. Each vignette must include its title, body,
condition label, and these metadata fields:

- `task_type`
- `leadership`
- `knowledge_type`
- `impact_level`

Optional jitter values can be added as `task_type_jitter_v`,
`directedness_jitter_v`, `data_access_jitter_v`, and
`visibility_jitter_v`. Missing jitter values are intentionally stored as
null.

Changing vignette IDs or factor metadata requires regenerating the
300-participant assignment table:

```bash
npm run generate:counterbalance
```

The generator fails instead of writing an invalid design unless every
condition receives 75 exposures and the within-participant and positional
balance checks pass.

## Questions

`config/questions.json` is the single source of truth for the five
confirmed shared questions and response scale.

Do not change the `responseColumn` values after data collection begins:

- `q1_seek_input`
- `q2_incorporate`
- `q3_future_input_seeking`
- `q4_future_reliance`
- `q5_positive_relationship`

Run `npm test`, `npm run lint`, and `npm run build` after editing either
configuration file.
