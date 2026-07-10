import type { Choice, SurveyResponse } from "../types";

const KEYS = {
  surveyOrder: "survey_order",
  surveyResponses: "survey_responses",
  surveyProgress: "survey_progress",
  devAuthed: "dev_authed",
} as const;

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function getSurveyOrder(): number[] | null {
  return getItem<number[]>(KEYS.surveyOrder);
}

export function setSurveyOrder(order: number[]): void {
  setItem(KEYS.surveyOrder, order);
}

export function getSurveyProgress(): number {
  return getItem<number>(KEYS.surveyProgress) ?? 0;
}

export function setSurveyProgress(index: number): void {
  setItem(KEYS.surveyProgress, index);
}

export function getSurveyResponses(): Record<string, SurveyResponse> {
  return getItem<Record<string, SurveyResponse>>(KEYS.surveyResponses) ?? {};
}

export function setSurveyResponse(
  vignetteId: number,
  choice: Choice,
): void {
  const responses = getSurveyResponses();
  responses[String(vignetteId)] = {
    choice,
    timestamp: new Date().toISOString(),
  };
  setItem(KEYS.surveyResponses, responses);
}

export function clearSurveyResponses(): void {
  removeItem(KEYS.surveyResponses);
}

export function clearAllSurveyData(): void {
  removeItem(KEYS.surveyOrder);
  removeItem(KEYS.surveyResponses);
  removeItem(KEYS.surveyProgress);
}

export function isDevAuthed(): boolean {
  return sessionStorage.getItem(KEYS.devAuthed) === "true";
}

export function setDevAuthed(authed: boolean): void {
  if (authed) {
    sessionStorage.setItem(KEYS.devAuthed, "true");
  } else {
    sessionStorage.removeItem(KEYS.devAuthed);
  }
}
