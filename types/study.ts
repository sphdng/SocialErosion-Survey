export type AssignmentMode = "query-param" | "random";

export type QuestionType =
  | "likert"
  | "single-choice"
  | "multiple-choice"
  | "text"
  | "numeric";

export interface QuestionOption {
  value: string | number;
  label: string;
}

export interface StudyQuestion {
  id: string;
  order: number;
  exportTag: string;
  qualtricsQuestionId?: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: QuestionOption[];
  anchors?: {
    min?: string;
    max?: string;
  };
}

export interface VignetteCondition {
  id: string;
  slug: string;
  title: string;
  body: string;
  conditionLabel: string;
  metadata?: Record<string, string | number | boolean>;
  questions: StudyQuestion[];
}

export interface StudySettings {
  assignmentMode: AssignmentMode;
  totalVignettes: number;
  questionsPerVignette: number;
  qualtricsEnabled: boolean;
  showDirectLinkFallback: boolean;
  iframeTitle: string;
  source: string;
}

export interface PublicVignetteConfig {
  id: string;
  title: string;
  conditionLabel: string;
  questions: StudyQuestion[];
}
