import { useCallback, useEffect, useState } from "react";
import { IntroBlurbCard } from "../components/IntroBlurbCard";
import { IntroHomeButton } from "../components/IntroHomeButton";
import { ProgressBar } from "../components/ProgressBar";
import { ResponseOptions } from "../components/ResponseOptions";
import { VignetteCard } from "../components/VignetteCard";
import { exportResponsesToCsv } from "../lib/csvExport";
import { shuffle } from "../lib/shuffle";
import {
  getSurveyOrder,
  getSurveyProgress,
  getSurveyResponses,
  setSurveyOrder,
  setSurveyProgress,
  setSurveyResponse,
} from "../lib/storage";
import {
  getOptions,
  getQuestion,
  getVignetteById,
  isPlaceholderContent,
  vignettes,
} from "../lib/vignettes";
import type { Choice } from "../types";
import "./ResponseSurvey.css";

const TOTAL_VIGNETTES = vignettes.length;
// Set to true to allow advancing without selecting an answer
const ALLOW_SKIP = false;

function ensureSurveyOrder(): number[] {
  let order = getSurveyOrder();
  if (!order || order.length !== TOTAL_VIGNETTES) {
    order = shuffle(vignettes.map((v) => v.id));
    setSurveyOrder(order);
    setSurveyProgress(0);
  }
  return order;
}

export function ResponseSurvey() {
  const [order] = useState(ensureSurveyOrder);
  const [progress, setProgress] = useState(getSurveyProgress);
  const [responses, setResponses] = useState(getSurveyResponses);
  const [selected, setSelected] = useState<Choice | null>(null);

  const isIntro = progress === 0;
  const isComplete = progress > TOTAL_VIGNETTES;
  const vignetteIndex = progress - 1;
  const currentId =
    !isIntro && !isComplete ? order[vignetteIndex] : null;
  const vignette = currentId ? getVignetteById(currentId) : null;

  useEffect(() => {
    if (currentId) {
      const stored = responses[String(currentId)];
      setSelected(stored?.choice ?? null);
    } else {
      setSelected(null);
    }
  }, [currentId, responses]);

  const handleSelect = useCallback(
    (choice: Choice) => {
      if (!currentId) return;
      setSelected(choice);
      setSurveyResponse(currentId, choice);
      setResponses(getSurveyResponses());
    },
    [currentId],
  );

  function handleNext() {
    if (!isIntro && !ALLOW_SKIP && !selected) return;
    const next = progress + 1;
    setProgress(next);
    setSurveyProgress(next);
  }

  function handleBack() {
    if (progress > 0) {
      const prev = progress - 1;
      setProgress(prev);
      setSurveyProgress(prev);
    }
  }

  function handleDownloadCsv() {
    exportResponsesToCsv(getSurveyResponses(), "my_survey_responses.csv");
  }

  if (isComplete) {
    return (
      <div className="survey-page">
        <div className="completion-screen">
          <h1>Thank you!</h1>
          <p>You have completed all {TOTAL_VIGNETTES} vignettes.</p>
          <p className="completion-screen__code">
            Completion code: <strong>SURVEY-2026-COMPLETE</strong>
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleDownloadCsv}
          >
            Download my responses (CSV)
          </button>
        </div>
      </div>
    );
  }

  if (isIntro) {
    return (
      <div className="survey-page">
        <header className="survey-page__header">
          <div className="survey-page__title-row">
            <h1>Workplace AI Survey</h1>
            <IntroHomeButton />
          </div>
          <p className="survey-page__intro-label">Introduction</p>
        </header>

        <IntroBlurbCard />

        <div className="survey-page__nav survey-page__nav--intro">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleNext}
          >
            Begin survey
          </button>
        </div>
      </div>
    );
  }

  if (!vignette) {
    return (
      <div className="survey-page">
        <p>Unable to load vignette. Please refresh the page.</p>
      </div>
    );
  }

  const canAdvance = ALLOW_SKIP || selected !== null;

  return (
    <div className="survey-page">
      <header className="survey-page__header">
        <div className="survey-page__title-row">
          <h1>Workplace AI Survey</h1>
          <IntroHomeButton />
        </div>
        <ProgressBar current={progress} total={TOTAL_VIGNETTES} />
      </header>

      <VignetteCard vignette={vignette} />
      <ResponseOptions
        question={getQuestion(vignette)}
        options={getOptions(vignette)}
        selected={selected}
        onSelect={handleSelect}
        isPlaceholder={isPlaceholderContent(vignette)}
      />

      <div className="survey-page__nav">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleNext}
          disabled={!canAdvance}
        >
          {progress === TOTAL_VIGNETTES ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
