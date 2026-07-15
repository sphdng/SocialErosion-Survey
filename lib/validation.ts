import type {
  StudySettings,
  VignetteCondition,
} from "@/types/study";

const EXPECTED_IDS = Array.from(
  { length: 24 },
  (_, index) => `v${String(index + 1).padStart(2, "0")}`,
);

function requireText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} must not be empty.`);
  }
}

export function validateStudyConfig(
  settings: StudySettings,
  vignettes: VignetteCondition[],
): void {
  if (settings.totalVignettes !== 24 || vignettes.length !== 24) {
    throw new Error("Study configuration must contain exactly 24 vignettes.");
  }

  if (settings.questionsPerVignette !== 5) {
    throw new Error("questionsPerVignette must equal 5.");
  }

  const ids = vignettes.map((vignette) => vignette.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Vignette IDs must be unique.");
  }

  if (EXPECTED_IDS.some((id, index) => ids[index] !== id)) {
    throw new Error("Vignette IDs must run in order from v01 through v24.");
  }

  for (const vignette of vignettes) {
    requireText(vignette.id, "Vignette ID");
    requireText(vignette.slug, `${vignette.id} slug`);
    requireText(vignette.title, `${vignette.id} title`);
    requireText(vignette.body, `${vignette.id} body`);
    requireText(vignette.conditionLabel, `${vignette.id} conditionLabel`);

    if (vignette.questions.length !== settings.questionsPerVignette) {
      throw new Error(`${vignette.id} must contain exactly 5 questions.`);
    }

    const questionIds = vignette.questions.map((question) => question.id);
    if (new Set(questionIds).size !== questionIds.length) {
      throw new Error(`${vignette.id} contains duplicate question IDs.`);
    }

    for (const [index, question] of vignette.questions.entries()) {
      if (question.order !== index + 1) {
        throw new Error(
          `${vignette.id} question orders must run from 1 through 5.`,
        );
      }

      requireText(question.id, `${vignette.id} question ID`);
      requireText(question.text, `${vignette.id}/${question.id} text`);
      requireText(
        question.exportTag,
        `${vignette.id}/${question.id} exportTag`,
      );

      if (
        settings.qualtricsEnabled &&
        !question.qualtricsQuestionId?.trim()
      ) {
        throw new Error(
          `${vignette.id}/${question.id} needs a Qualtrics question ID.`,
        );
      }

      if (question.type === "likert") {
        if (!question.options || question.options.length < 2) {
          throw new Error(
            `${vignette.id}/${question.id} needs ordered Likert options.`,
          );
        }
        const numericValues = question.options.map((option) =>
          Number(option.value),
        );
        if (
          numericValues.some(
            (value, optionIndex) =>
              optionIndex > 0 && value <= numericValues[optionIndex - 1],
          )
        ) {
          throw new Error(
            `${vignette.id}/${question.id} Likert options are not ordered.`,
          );
        }
      }
    }

    const serialized = JSON.stringify(vignette).toLowerCase();
    if (
      serialized.includes("api_token") ||
      serialized.includes("api-key") ||
      serialized.includes("private_key")
    ) {
      throw new Error(`${vignette.id} may contain a secret.`);
    }
  }
}
