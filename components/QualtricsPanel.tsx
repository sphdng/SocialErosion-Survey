"use client";

import { useState } from "react";
import styles from "@/app/study/study.module.css";

interface QualtricsPanelProps {
  surveyUrl: string;
  iframeTitle: string;
  showDirectLinkFallback: boolean;
}

export function QualtricsPanel({
  surveyUrl,
  iframeTitle,
  showDirectLinkFallback,
}: QualtricsPanelProps) {
  const [loading, setLoading] = useState(true);

  return (
    <section
      className={styles.qualtricsPanel}
      aria-labelledby="survey-questions-heading"
    >
      <h2 id="survey-questions-heading" className={styles.srOnly}>
        Survey questions
      </h2>

      <div className={styles.iframeWrap}>
        {loading && (
          <div className={styles.iframeLoading} role="status">
            Loading survey questions…
          </div>
        )}
        <iframe
          className={styles.iframe}
          src={surveyUrl}
          title={iframeTitle}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="clipboard-write"
          onLoad={() => setLoading(false)}
        />
      </div>

      {showDirectLinkFallback && (
        <p className={styles.fallback}>
          If the survey does not load,{" "}
          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            open it in a new tab
          </a>
          .
        </p>
      )}
    </section>
  );
}
