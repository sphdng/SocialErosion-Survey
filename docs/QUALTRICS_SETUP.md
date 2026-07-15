# NYU Qualtrics setup

The Vercel application presents the vignette. Qualtrics owns consent,
validation, progression, responses, IDs, timestamps, and exports.

## Required survey structure

1. Publish the survey and use its approved distribution URL.
2. Add one block containing exactly five native Qualtrics response
   questions.
3. Keep stable export tags:
   - `VIGNETTE_Q1`
   - `VIGNETTE_Q2`
   - `VIGNETTE_Q3`
   - `VIGNETTE_Q4`
   - `VIGNETTE_Q5`
4. Add these Embedded Data fields near the start of Survey Flow:
   - `vignette_id`
   - `condition_label`
   - `source`
   - `task_type`
   - `leadership`
   - `knowledge_type`
   - `impact_level`
5. Configure required-response validation in Qualtrics.
6. Confirm that the survey's authentication settings match the protocol.

The study page uses `URLSearchParams` to append those fields to both the
iframe and direct fallback link.

## Dynamic question wording

The public endpoint returns the five configured questions:

```text
https://YOUR-VERCEL-DOMAIN/api/study-config/v01
```

For each Qualtrics question, put a deliberately stable element in its
question text:

```html
<span id="dynamic-question-q1">Loading question…</span>
```

Use the matching ID for `q2` through `q5`.

Then add custom JavaScript to each question. Replace the Vercel domain and
set `exportTag` to the corresponding stable export tag:

```js
Qualtrics.SurveyEngine.addOnReady(function () {
  var params = new URLSearchParams(window.location.search);
  var vignetteId = params.get("vignette_id");
  var exportTag = "VIGNETTE_Q1";
  var target = document.getElementById("dynamic-question-q1");
  var nextButton = document.getElementById("NextButton");

  if (!vignetteId || !target) {
    if (target) target.textContent = "Unable to load this question.";
    if (nextButton) nextButton.disabled = true;
    return;
  }

  fetch(
    "https://YOUR-VERCEL-DOMAIN/api/study-config/" +
      encodeURIComponent(vignetteId)
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load study configuration.");
      }
      return response.json();
    })
    .then(function (config) {
      var question = config.questions.find(function (item) {
        return item.exportTag === exportTag;
      });
      if (!question) {
        throw new Error("Question configuration not found.");
      }
      target.textContent = question.text;
    })
    .catch(function (error) {
      console.error(error);
      target.textContent =
        "This question could not be loaded. Please contact the research team.";
      if (nextButton) nextButton.disabled = true;
    });
});
```

This code must be tested in the current NYU Qualtrics survey-taking
experience. Do not rely on undocumented Qualtrics CSS classes.

If dynamic wording is unreliable, store the wording directly in Qualtrics
and manually compare it with `config/vignettes.json` before deployment.

## CORS

The configuration API permits reads from:

```text
https://nyu.qualtrics.com
```

If NYU serves the survey from a different host, update `corsHeaders` in
`app/api/study-config/[vignetteId]/route.ts`.

## Manual data test

Test several vignette IDs and confirm in **Data & Analysis**:

- The response was recorded.
- `vignette_id` and condition metadata are correct.
- Each answer appears under its expected export tag.
- The displayed wording matches the JSON.
- Completion status, response ID, and timestamps are present.

Remove test responses before launch if required by the study protocol.
