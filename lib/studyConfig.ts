import studyJson from "@/config/study.json";
import vignettesJson from "@/config/vignettes.json";
import type {
  PublicVignetteConfig,
  StudySettings,
  VignetteCondition,
} from "@/types/study";
import { validateStudyConfig } from "@/lib/validation";

export const studySettings = studyJson as StudySettings;
export const vignettes = vignettesJson as VignetteCondition[];

export function assertValidStudyConfig(): void {
  validateStudyConfig(studySettings, vignettes);
}

if (process.env.NODE_ENV === "development") {
  assertValidStudyConfig();
}

export function getVignetteById(
  vignetteId: string,
): VignetteCondition | undefined {
  return vignettes.find((vignette) => vignette.id === vignetteId);
}

export function getPublicVignetteConfig(
  vignetteId: string,
): PublicVignetteConfig | undefined {
  const vignette = getVignetteById(vignetteId);
  if (!vignette) return undefined;

  return {
    id: vignette.id,
    title: vignette.title,
    conditionLabel: vignette.conditionLabel,
    questions: vignette.questions,
  };
}
