export type AssignmentMode =
  | "query-param"
  | "random"
  | "all"
  | "counterbalanced";

export interface QuestionOption {
  value: string | number;
  label: string;
}

export interface VignetteCondition {
  id: string;
  slug: string;
  title: string;
  body: string;
  conditionLabel: string;
  metadata?: Record<string, string | number | boolean>;
}

export type ResponseColumn =
  | "q1_seek_input"
  | "q2_incorporate"
  | "q3"
  | "q4"
  | "q5";

export interface SharedQuestion {
  id: string;
  responseColumn: ResponseColumn;
  text: string;
  required: boolean;
}

export interface SharedQuestionConfig {
  scale: QuestionOption[];
  questions: SharedQuestion[];
}

export interface CounterbalanceOrder {
  slot: number;
  vignetteIds: string[];
}

export interface CounterbalanceConfig {
  design: string;
  plannedParticipants: number;
  vignettesPerParticipant: number;
  exposuresPerVignette: number;
  orders: CounterbalanceOrder[];
}

export interface StudySettings {
  assignmentMode: AssignmentMode;
  totalVignettes: number;
  vignettesPerParticipant: number;
  questionsPerVignette: number;
}
