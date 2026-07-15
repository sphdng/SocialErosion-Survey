import { describe, expect, it } from "vitest";
import {
  counterbalanceConfig,
  getVignetteById,
  questionConfig,
  studySettings,
  vignettes,
} from "@/lib/studyConfig";
import {
  buildResponseRow,
  SubmissionValidationError,
} from "@/lib/submission";
import { validateStudyConfig } from "@/lib/validation";

const completeAnswers = {
  q1: "Agree",
  q2: "Strongly agree",
  q3: "Neither agree nor disagree",
  q4: "Disagree",
  q5: "Strongly disagree",
};

describe("study configuration", () => {
  it("passes validation", () => {
    expect(() =>
      validateStudyConfig(
        studySettings,
        vignettes,
        questionConfig,
        counterbalanceConfig,
      ),
    ).not.toThrow();
  });

  it("contains v01 through v24 and five shared questions", () => {
    expect(vignettes).toHaveLength(24);
    expect(vignettes.map((vignette) => vignette.id)).toEqual(
      Array.from(
        { length: 24 },
        (_, index) => `v${String(index + 1).padStart(2, "0")}`,
      ),
    );
    expect(questionConfig.questions).toHaveLength(5);
  });

  it("looks up valid IDs and rejects invalid IDs", () => {
    expect(getVignetteById("v01")?.id).toBe("v01");
    expect(getVignetteById("v24")?.id).toBe("v24");
    expect(getVignetteById("v25")).toBeUndefined();
  });
});

describe("response rows", () => {
  it("derives factor and vignette fields from server configuration", () => {
    const row = buildResponseRow(
      {
        pid: "P1",
        vignetteId: "v01",
        position: 1,
        answers: completeAnswers,
        timeSpentMs: 1000,
      },
      ["v01"],
    );

    expect(row).toMatchObject({
      pid: "P1",
      vignette_id: "v01",
      vignette_number: 1,
      task_type: "Information",
      iv2: "Human",
      iv3: "Generic",
      iv4: "Personal",
      q1_seek_input: "Agree",
      time_spent_ms: 1000,
    });
  });

  it("rejects missing answers and mismatched vignette positions", () => {
    expect(() =>
      buildResponseRow(
        {
          pid: "P1",
          vignetteId: "v02",
          position: 1,
          answers: completeAnswers,
          timeSpentMs: 1000,
        },
        ["v01"],
      ),
    ).toThrow(SubmissionValidationError);

    expect(() =>
      buildResponseRow(
        {
          pid: "P1",
          vignetteId: "v01",
          position: 1,
          answers: { ...completeAnswers, q5: "" },
          timeSpentMs: 1000,
        },
        ["v01"],
      ),
    ).toThrow("Every question requires a valid response.");
  });
});
