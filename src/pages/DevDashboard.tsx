import { useCallback, useState } from "react";
import { IntroHomeButton } from "../components/IntroHomeButton";
import { DevPasswordGate } from "../components/DevPasswordGate";
import {
  FactorBoxGrid,
  type FactorKey,
} from "../components/FactorBoxGrid";
import { ResponseOptions } from "../components/ResponseOptions";
import { ResponseTable } from "../components/ResponseTable";
import { TreeNav } from "../components/TreeNav";
import { VignetteCard } from "../components/VignetteCard";
import { getSurveyResponses, isDevAuthed } from "../lib/storage";
import {
  findVignetteByFactors,
  getOptions,
  getQuestion,
  getVignetteById,
  isPlaceholderContent,
  vignettes,
} from "../lib/vignettes";
import type { Vignette } from "../types";
import "./DevDashboard.css";

export function DevDashboard() {
  const [authed, setAuthed] = useState(isDevAuthed);
  const [selectedId, setSelectedId] = useState(1);
  const [responses, setResponses] = useState(getSurveyResponses);

  const vignette = getVignetteById(selectedId);
  const storedResponse = responses[String(selectedId)];

  const refreshResponses = useCallback(() => {
    setResponses(getSurveyResponses());
  }, []);

  function handlePrev() {
    setSelectedId((id) => Math.max(1, id - 1));
  }

  function handleNext() {
    setSelectedId((id) => Math.min(vignettes.length, id + 1));
  }

  function handleFactorChange(key: FactorKey, value: string) {
    if (!vignette) return;
    const nextFactors = {
      taskType: vignette.taskType,
      directedness: vignette.directedness,
      dataAccess: vignette.dataAccess,
      visibility: vignette.visibility,
      [key]: value,
    } as Pick<
      Vignette,
      "taskType" | "directedness" | "dataAccess" | "visibility"
    >;
    const match = findVignetteByFactors(nextFactors);
    if (match) setSelectedId(match.id);
  }

  if (!authed) {
    return (
      <div className="dev-page">
        <DevPasswordGate onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  return (
    <div className="dev-page">
      <header className="dev-page__header">
        <h1>Dev Dashboard</h1>
        <p className="dev-page__subtitle">
          Vignette preview, factor tree navigation, and response QA
        </p>
      </header>

      <div className="dev-page__layout">
        <aside className="dev-page__sidebar">
          <div className="dev-page__jump">
            <label htmlFor="vignette-jump">Jump to vignette</label>
            <select
              id="vignette-jump"
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {vignettes.map((v) => (
                <option key={v.id} value={v.id}>
                  #{v.id} — {v.taskType.slice(0, 20)}…
                </option>
              ))}
            </select>
          </div>
          <TreeNav
            vignettes={vignettes}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        <main className="dev-page__preview">
          {vignette ? (
            <>
              <div className="dev-page__preview-header">
                <h2>
                  Vignette #{vignette.id}
                  {storedResponse && (
                    <span className="dev-page__response-badge">
                      Answered: {storedResponse.choice}
                    </span>
                  )}
                </h2>
                <div className="dev-page__preview-actions">
                  <IntroHomeButton />
                  <div className="dev-page__preview-nav">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={handlePrev}
                    disabled={selectedId <= 1}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={handleNext}
                    disabled={selectedId >= vignettes.length}
                  >
                    Next
                  </button>
                  </div>
                </div>
              </div>

              <VignetteCard vignette={vignette} />
              <FactorBoxGrid
                vignette={vignette}
                mode="labeled"
                onFactorChange={handleFactorChange}
              />
              <ResponseOptions
                question={getQuestion(vignette)}
                options={getOptions(vignette)}
                selected={storedResponse?.choice ?? null}
                readOnly
                isPlaceholder={isPlaceholderContent(vignette)}
              />
              {storedResponse && (
                <p className="dev-page__stored-response">
                  Stored response: <strong>{storedResponse.choice}</strong> at{" "}
                  {new Date(storedResponse.timestamp).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <p>Vignette not found.</p>
          )}

          <ResponseTable responses={responses} onClear={refreshResponses} />
        </main>
      </div>
    </div>
  );
}
