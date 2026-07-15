"use client";

import { useEffect, useState } from "react";
import { QualtricsPanel } from "@/components/QualtricsPanel";
import { VignettePanel } from "@/components/VignettePanel";
import type { VignetteCondition } from "@/types/study";
import styles from "./study.module.css";

interface StudyExperienceProps {
  vignettes: VignetteCondition[];
  surveyUrl: string;
  iframeTitle: string;
  showDirectLinkFallback: boolean;
}

interface QualtricsProgressMessage {
  type?: unknown;
  vignetteId?: unknown;
  position?: unknown;
}

function isQualtricsOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return (
      url.protocol === "https:" &&
      (url.hostname === "qualtrics.com" ||
        url.hostname.endsWith(".qualtrics.com"))
    );
  } catch {
    return false;
  }
}

export function StudyExperience({
  vignettes,
  surveyUrl,
  iframeTitle,
  showDirectLinkFallback,
}: StudyExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleMessage(event: MessageEvent<QualtricsProgressMessage>) {
      if (!isQualtricsOrigin(event.origin)) return;
      if (event.data?.type !== "vignette-study:progress") return;

      if (typeof event.data.vignetteId === "string") {
        const index = vignettes.findIndex(
          (vignette) => vignette.id === event.data.vignetteId,
        );
        if (index >= 0) setActiveIndex(index);
        return;
      }

      if (
        typeof event.data.position === "number" &&
        Number.isInteger(event.data.position) &&
        event.data.position >= 1 &&
        event.data.position <= vignettes.length
      ) {
        setActiveIndex(event.data.position - 1);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [vignettes]);

  const activeVignette = vignettes[activeIndex];

  return (
    <main className={styles.studyPage}>
      <div className={styles.studyShell}>
        <VignettePanel
          title={activeVignette.title}
          body={activeVignette.body}
          conditionLabel={activeVignette.conditionLabel}
          vignetteId={activeVignette.id}
          currentPosition={activeIndex + 1}
          total={vignettes.length}
        />
        <QualtricsPanel
          surveyUrl={surveyUrl}
          iframeTitle={iframeTitle}
          showDirectLinkFallback={showDirectLinkFallback}
        />
      </div>
    </main>
  );
}
