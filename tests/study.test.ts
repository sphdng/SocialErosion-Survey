import { describe, expect, it } from "vitest";
import { buildQualtricsUrl } from "@/lib/qualtrics";
import {
  getVignetteById,
  studySettings,
  vignettes,
} from "@/lib/studyConfig";
import { validateStudyConfig } from "@/lib/validation";
import { assignRandomVignette } from "@/lib/vignetteAssignment";

describe("study configuration", () => {
  it("passes validation", () => {
    expect(() =>
      validateStudyConfig(studySettings, vignettes),
    ).not.toThrow();
  });

  it("contains v01 through v24 with five questions each", () => {
    expect(vignettes).toHaveLength(24);
    expect(vignettes.map((vignette) => vignette.id)).toEqual(
      Array.from(
        { length: 24 },
        (_, index) => `v${String(index + 1).padStart(2, "0")}`,
      ),
    );
    expect(
      vignettes.every((vignette) => vignette.questions.length === 5),
    ).toBe(true);
  });

  it("looks up valid IDs and rejects invalid IDs", () => {
    expect(getVignetteById("v01")?.id).toBe("v01");
    expect(getVignetteById("v24")?.id).toBe("v24");
    expect(getVignetteById("v25")).toBeUndefined();
    expect(getVignetteById("invalid")).toBeUndefined();
  });
});

describe("Qualtrics URL construction", () => {
  it("encodes the condition and metadata", () => {
    const vignette = getVignetteById("v01");
    expect(vignette).toBeDefined();

    const result = new URL(
      buildQualtricsUrl(
        "https://nyu.qualtrics.com/jfe/form/SV_example",
        vignette!,
      ),
    );

    expect(result.searchParams.get("vignette_id")).toBe("v01");
    expect(result.searchParams.get("condition_label")).toBe(
      vignette!.conditionLabel,
    );
    expect(result.searchParams.get("task_type")).toBe(
      "information-seeking",
    );
    expect(result.searchParams.get("source")).toBe(
      "vercel-study-site",
    );
  });
});

describe("random assignment", () => {
  it("persists the first assignment for the browser session", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    expect(
      assignRandomVignette(["v01", "v02", "v03"], storage, () => 0.5),
    ).toBe("v02");
    expect(
      assignRandomVignette(["v01", "v02", "v03"], storage, () => 0),
    ).toBe("v02");
  });
});
