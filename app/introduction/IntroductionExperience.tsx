"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundContent } from "@/components/BackgroundContent";
import styles from "@/app/start.module.css";

export function IntroductionExperience() {
  const router = useRouter();
  const [pid, setPid] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const activeTimeMsRef = useRef(0);
  const visibleSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("vignette-study:consent") !== "true") {
      router.replace("/");
      return;
    }

    const storedPid = sessionStorage.getItem("vignette-study:pid");
    const storedOrder = storedPid
      ? sessionStorage.getItem(`vignette-study:order:${storedPid}`)
      : null;
    if (!storedPid || !storedOrder) {
      router.replace("/participant");
      return;
    }

    setPid(storedPid);
    setReady(true);

    function updateVisibilityTimer() {
      if (document.visibilityState === "visible") {
        if (visibleSinceRef.current === null) {
          visibleSinceRef.current = performance.now();
        }
      } else if (visibleSinceRef.current !== null) {
        activeTimeMsRef.current +=
          performance.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
    }

    updateVisibilityTimer();
    document.addEventListener("visibilitychange", updateVisibilityTimer);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibilityTimer);
      if (visibleSinceRef.current !== null) {
        activeTimeMsRef.current +=
          performance.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
    };
  }, [router]);

  async function continueToStudy() {
    setError("");
    setSubmitting(true);

    if (visibleSinceRef.current !== null) {
      activeTimeMsRef.current += performance.now() - visibleSinceRef.current;
      visibleSinceRef.current = null;
    }
    const readingTimeMs = Math.min(
      Math.round(activeTimeMsRef.current),
      86_400_000,
    );

    try {
      const response = await fetch("/api/introduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid, readingTimeMs }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to save reading time.");
      }

      sessionStorage.setItem(
        `vignette-study:introduction-complete:${pid}`,
        "true",
      );
      router.push("/study");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save reading time.",
      );
      if (document.visibilityState === "visible") {
        visibleSinceRef.current = performance.now();
      }
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.entryIntro}>
            <h1>Preparing background information…</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <BackgroundContent />
        <div className={styles.introductionActions}>
          <p className={styles.timerNote}>
            Continue after you have carefully read the background information.
          </p>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.button}
            type="button"
            onClick={continueToStudy}
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Continue to scenarios"}
          </button>
        </div>
      </section>
    </main>
  );
}
