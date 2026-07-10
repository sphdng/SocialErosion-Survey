export type TaskType =
  | "Information Seeking"
  | "Brainstorming / Ideation"
  | "Feedback / Validation";

export type Directedness = "Human-led" | "AI-led";
export type DataAccess = "Generic" | "Org-specific";
export type Visibility = "Personal" | "Team-level";
export type Choice = "A" | "B" | "C" | "D";

export type Vignette = {
  id: number;
  taskType: TaskType;
  directedness: Directedness;
  dataAccess: DataAccess;
  visibility: Visibility;
  text: string;
  question?: string;
  options?: [string, string, string, string];
};

export type SurveyResponse = {
  choice: Choice;
  timestamp: string;
};

export type VignettesData = {
  meta: {
    design: string;
    factors: {
      taskType: TaskType[];
      directedness: Directedness[];
      dataAccess: DataAccess[];
      visibility: Visibility[];
    };
    responseFormat: {
      type: string;
      optionCount: number;
      optionLabels: Choice[];
      note: string;
    };
  };
  vignettes: Vignette[];
};
