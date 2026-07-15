# Adding or editing vignettes

`config/vignettes.json` is the source of truth for public study content.

## Editing workflow

1. Open `config/vignettes.json`.
2. Find the condition by ID (`v01` through `v24`).
3. Edit its `title`, `body`, `conditionLabel`, metadata, or five question
   objects.
4. Replace all `[PLACEHOLDER]` question text before data collection.
5. Keep exactly five questions, ordered 1 through 5.
6. Run:

   ```bash
   npm test
   npm run lint
   npm run build
   ```

7. Deploy to a Vercel preview.
8. Verify `/study?vignette=...` and `/api/study-config/...`.
9. Verify that the wording shown inside Qualtrics matches the JSON.
10. Submit a test response and confirm the embedded condition data.

## Stable fields

After response collection begins, do not change:

- Vignette IDs (`v01`–`v24`)
- Question IDs (`q1`–`q5`)
- Qualtrics question IDs (`QID1`–`QID5`, once verified)
- Export tags (`VIGNETTE_Q1`–`VIGNETTE_Q5`)

Deleting and recreating Qualtrics questions can break response mappings.

## Question types and scales

The current question entries are explicit placeholders and use `type:
"text"` because the final constructs and scales were not provided. When
final wording is supplied, update each `type` and add `options` or
`anchors` as appropriate. For example:

```json
{
  "id": "q1",
  "order": 1,
  "exportTag": "VIGNETTE_Q1",
  "qualtricsQuestionId": "QID1",
  "type": "likert",
  "text": "Final approved question wording.",
  "required": true,
  "options": [
    { "value": 1, "label": "Strongly disagree" },
    { "value": 2, "label": "Disagree" },
    { "value": 3, "label": "Neither agree nor disagree" },
    { "value": 4, "label": "Agree" },
    { "value": 5, "label": "Strongly agree" }
  ]
}
```

Response controls remain native Qualtrics controls. The website does not
render or record a second set of answers.
