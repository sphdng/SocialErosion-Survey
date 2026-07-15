import { getVignetteById, questionConfig } from "@/lib/studyConfig";

export const PID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export class SubmissionValidationError extends Error {}

function requireObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new SubmissionValidationError("Invalid submission.");
  }
  return value as Record<string, unknown>;
}

function displayFactor(
  value: unknown,
  labels: Record<string, string>,
): string {
  if (typeof value !== "string" || !labels[value]) {
    throw new SubmissionValidationError("Vignette metadata is incomplete.");
  }
  return labels[value];
}

function optionalMetadata(
  metadata: Record<string, string | number | boolean> | undefined,
  key: string,
): string | null {
  const value = metadata?.[key];
  return value === undefined ? null : String(value);
}

export function buildResponseRow(
  input: unknown,
  expectedVignetteOrder: readonly string[],
) {
  const body = requireObject(input);
  const pid = typeof body.pid === "string" ? body.pid.trim() : "";
  const vignetteId =
    typeof body.vignetteId === "string" ? body.vignetteId : "";
  const position = body.position;
  const timeSpentMs = body.timeSpentMs;
  const answers = requireObject(body.answers);

  if (!PID_PATTERN.test(pid)) {
    throw new SubmissionValidationError("Invalid participant ID.");
  }
  if (
    typeof position !== "number" ||
    !Number.isInteger(position) ||
    position < 1 ||
    position > expectedVignetteOrder.length ||
    expectedVignetteOrder[position - 1] !== vignetteId
  ) {
    throw new SubmissionValidationError("Invalid vignette position.");
  }
  if (
    typeof timeSpentMs !== "number" ||
    !Number.isInteger(timeSpentMs) ||
    timeSpentMs < 0 ||
    timeSpentMs > 86_400_000
  ) {
    throw new SubmissionValidationError("Invalid response time.");
  }

  const allowedValues = new Set(
    questionConfig.scale.map((option) => String(option.value)),
  );
  const responseValues: Record<string, string> = {};
  for (const question of questionConfig.questions) {
    const answer = answers[question.id];
    if (typeof answer !== "string" || !allowedValues.has(answer)) {
      throw new SubmissionValidationError(
        "Every question requires a valid response.",
      );
    }
    responseValues[question.responseColumn] = answer;
  }

  const vignette = getVignetteById(vignetteId);
  if (!vignette) {
    throw new SubmissionValidationError("Unknown vignette.");
  }
  const metadata = vignette.metadata;
  const now = Date.now();

  return {
    pid,
    vignette_id: vignette.id,
    vignette_number: position,
    task_type: displayFactor(metadata?.task_type, {
      "information-seeking": "Information",
      "brainstorming-ideation": "Brainstorming",
      "feedback-validation": "Feedback",
    }),
    task_type_jitter_v: optionalMetadata(metadata, "task_type_jitter_v"),
    iv2: displayFactor(metadata?.leadership, {
      "human-led": "Human",
      "ai-led": "AI",
    }),
    iv2_jitter_v: optionalMetadata(metadata, "iv2_jitter_v"),
    iv3: displayFactor(metadata?.knowledge_type, {
      generic: "Generic",
      "org-specific": "Org-Specific",
    }),
    iv3_jitter_v: optionalMetadata(metadata, "iv3_jitter_v"),
    iv4: displayFactor(metadata?.impact_level, {
      personal: "Personal",
      "team-level": "Team",
    }),
    iv4_jitter_v: optionalMetadata(metadata, "iv4_jitter_v"),
    full_vignette_text: vignette.body,
    q1_seek_input: responseValues.q1_seek_input,
    q2_incorporate: responseValues.q2_incorporate,
    q3: responseValues.q3,
    q4: responseValues.q4,
    q5: responseValues.q5,
    time_spent_ms: timeSpentMs,
    started_at: new Date(now - timeSpentMs).toISOString(),
    submitted_at: new Date(now).toISOString(),
  };
}
