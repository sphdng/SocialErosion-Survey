# NYU Qualtrics setup

The website presents all 24 vignettes in order and keeps the current
vignette visible on the left. Qualtrics repeats the same five Alex-and-Sam
questions once for each vignette, validates every response, advances to the
next block, and records 120 vignette-linked answers.

## 1. Configure the five-question block

1. Keep exactly five native Qualtrics questions in one block.
2. Set every question to **Force Response**.
3. Keep these stable question numbers/export tags:
   - `VIGNETTE_Q1`
   - `VIGNETTE_Q2`
   - `VIGNETTE_Q3`
   - `VIGNETTE_Q4`
   - `VIGNETTE_Q5`
4. Put a page break after the block if other survey content follows.

## 2. Repeat the block 24 times

Open the block's three-dot menu and select **Loop & Merge**.

1. Turn looping on.
2. Add 24 rows.
3. Set the row values to `1` through `24`.
4. Do not randomize the loop rows; they map directly to `v01` through
   `v24`.

Qualtrics will now require the same five questions for each of the 24
vignettes before advancing.

## 3. Add Embedded Data fields

Near the beginning of **Survey Flow**, add an Embedded Data element with:

```text
source
vignette_ids
vignette_count
vignette_1
vignette_2
...
vignette_24
```

Leave their values blank. Qualtrics captures them from the website's query
parameters.

## 4. Notify the website when Qualtrics advances

The parent website cannot inspect Qualtrics pages directly because they
are on different domains. Add this JavaScript to the first question's
existing **Add On Ready** function:

```js
var position = Number("${lm://CurrentLoopNumber}");
var params = new URLSearchParams(window.location.search);
var vignetteId = params.get("vignette_" + position);

if (!position || !vignetteId) {
  console.error("Unable to identify the current vignette.");
  return;
}

window.parent.postMessage(
  {
    type: "vignette-study:progress",
    position: position,
    vignetteId: vignetteId
  },
  "*"
);
```

No question HTML is needed. If you previously added
`study-loop-context`, you may remove it. The wildcard allows both Vercel
preview and production domains to receive the public progress message; the
website independently verifies that it came from Qualtrics and matches one
of the 24 configured vignette IDs. No answers or participant identifiers
are sent.

## 5. Publish and test

Publish the survey and test the Vercel site from its start page.

Confirm:

- All 24 scenarios appear in order.
- Scenario 1 appears with the first five questions.
- Qualtrics prevents progression until all five are answered.
- The left panel changes to scenarios 2–24 after each block.
- The background icon opens and closes on every study page.
- One Qualtrics response contains all 24 loop iterations and 120 answers.
- `vignette_1` through `vignette_24` match the scenarios shown.
- The loop-specific answers map to the expected question export tags.

Remove test responses before launch if required by the study protocol.
