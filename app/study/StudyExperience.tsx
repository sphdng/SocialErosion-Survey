"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { VignettePanel } from "@/components/VignettePanel";
import type {
  SharedQuestionConfig,
  VignetteCondition,
} from "@/types/study";
import styles from "./study.module.css";

interface StudyExperienceProps {
  vignettes: VignetteCondition[];
  questionConfig: SharedQuestionConfig;
}

export function StudyExperience({
  vignettes,
  questionConfig,
}: StudyExperienceProps) {
  const router = useRouter();
  const [pid, setPid] = useState("");
  const [assignedVignettes, setAssignedVignettes] = useState<
    VignetteCondition[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (sessionStorage.getItem("vignette-study:consent") !== "true") {
      router.replace("/");
      return;
    }

    const storedPid = sessionStorage.getItem("vignette-study:pid");
    if (!storedPid) {
      router.replace("/participant");
      return;
    }
    if (
      sessionStorage.getItem(
        `vignette-study:introduction-complete:${storedPid}`,
      ) !== "true"
    ) {
      router.replace("/introduction");
      return;
    }

    let vignetteOrder: unknown;
    try {
      vignetteOrder = JSON.parse(
        sessionStorage.getItem(`vignette-study:order:${storedPid}`) ?? "",
      );
    } catch {
      vignetteOrder = null;
    }
    if (
      !Array.isArray(vignetteOrder) ||
      vignetteOrder.length !== 6 ||
      vignetteOrder.some((id) => typeof id !== "string")
    ) {
      sessionStorage.removeItem("vignette-study:pid");
      router.replace("/participant");
      return;
    }

    const assigned = vignetteOrder.map((id) =>
      vignettes.find((vignette) => vignette.id === id),
    );
    if (assigned.some((vignette) => !vignette)) {
      sessionStorage.removeItem("vignette-study:pid");
      router.replace("/participant");
      return;
    }

    const storedPosition = Number(
      sessionStorage.getItem(`vignette-study:position:${storedPid}`),
    );
    if (
      Number.isInteger(storedPosition) &&
      storedPosition >= 0 &&
      storedPosition < assigned.length
    ) {
      setActiveIndex(storedPosition);
    }
    setPid(storedPid);
    setAssignedVignettes(assigned as VignetteCondition[]);
    startedAtRef.current = Date.now();
    setReady(true);
  }, [router, vignettes]);

  async function submitResponses(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pid,
          vignetteId: activeVignette.id,
          position: activeIndex + 1,
          answers,
          timeSpentMs: Math.min(
            Date.now() - startedAtRef.current,
            86_400_000,
          ),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        completed?: boolean;
      };
      if (!response.ok) {
        throw new Error(result.error || "The response could not be saved.");
      }

      if (result.completed) {
        sessionStorage.removeItem("vignette-study:pid");
        sessionStorage.removeItem(`vignette-study:position:${pid}`);
        sessionStorage.removeItem(`vignette-study:order:${pid}`);
        sessionStorage.removeItem(
          `vignette-study:introduction-complete:${pid}`,
        );
        setCompleted(true);
        return;
      }

      const nextIndex = activeIndex + 1;
      sessionStorage.setItem(
        `vignette-study:position:${pid}`,
        String(nextIndex),
      );
      setActiveIndex(nextIndex);
      setAnswers({});
      startedAtRef.current = Date.now();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The response could not be saved.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <h1>Preparing study…</h1>
          <p>Checking your participant session.</p>
        </section>
      </main>
    );
  }

  if (completed) {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <h1>Study complete</h1>
          <p>Your responses have been saved. You may now close this window.</p>
        </section>
      </main>
    );
  }

  const activeVignette = assignedVignettes[activeIndex];

  return (
    <main className={styles.studyPage}>
      <div className={styles.studyShell}>
        <VignettePanel
          title={activeVignette.title}
          body={activeVignette.body}
          currentPosition={activeIndex + 1}
          total={assignedVignettes.length}
        />
        <section
          className={styles.questionsPanel}
          aria-labelledby="survey-questions-heading"
        >
          <h2 id="survey-questions-heading" className={styles.srOnly}>
            Questions about this scenario
          </h2>
          <p className={styles.requiredNote}>All questions are required</p>

          <form onSubmit={submitResponses}>
            <div className={styles.questionList}>
              {questionConfig.questions.map((question) => (
                <fieldset className={styles.question} key={question.id}>
                  <legend>{question.text}</legend>
                  <div className={styles.options}>
                    {questionConfig.scale.map((option) => {
                      const optionValue = String(option.value);
                      return (
                        <label className={styles.option} key={optionValue}>
                          <input
                            type="radio"
                            name={question.id}
                            value={optionValue}
                            checked={answers[question.id] === optionValue}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: optionValue,
                              }))
                            }
                            required={question.required}
                            disabled={submitting}
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {error && (
              <p className={styles.submitError} role="alert">
                {error}
              </p>
            )}

            <div className={styles.submitRow}>
              <p aria-live="polite">
                Responses are saved when you continue.
              </p>
              <button
                className={styles.nextButton}
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Saving…"
                  : activeIndex === assignedVignettes.length - 1
                    ? "Submit final responses"
                    : "Save and continue"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
