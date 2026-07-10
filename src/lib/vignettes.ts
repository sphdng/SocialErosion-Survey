import vignettesData from "../data/vignettes.json";
import { PLACEHOLDER_OPTIONS, PLACEHOLDER_QUESTION } from "../config";
import type { Choice, Vignette, VignettesData } from "../types";

const data = vignettesData as VignettesData;

export const vignettes: Vignette[] = data.vignettes;
export const vignetteMeta = data.meta;

export function getVignetteById(id: number): Vignette | undefined {
  return vignettes.find((v) => v.id === id);
}

export function findVignetteByFactors(
  factors: Pick<
    Vignette,
    "taskType" | "directedness" | "dataAccess" | "visibility"
  >,
): Vignette | undefined {
  return vignettes.find(
    (v) =>
      v.taskType === factors.taskType &&
      v.directedness === factors.directedness &&
      v.dataAccess === factors.dataAccess &&
      v.visibility === factors.visibility,
  );
}

export function getQuestion(vignette: Vignette): string {
  return vignette.question ?? PLACEHOLDER_QUESTION;
}

export function getOptions(vignette: Vignette): [string, string, string, string] {
  return vignette.options ?? PLACEHOLDER_OPTIONS;
}

export function isPlaceholderContent(vignette: Vignette): boolean {
  return !vignette.question || !vignette.options;
}

export const CHOICE_LABELS: Choice[] = ["A", "B", "C", "D"];
