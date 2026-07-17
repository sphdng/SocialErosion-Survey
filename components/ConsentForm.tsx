"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import consent from "@/config/consent.json";
import styles from "@/app/start.module.css";

export function ConsentForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function continueToParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please confirm your consent before continuing.");
      return;
    }

    sessionStorage.setItem("vignette-study:consent", "true");
    router.push("/participant");
  }

  return (
    <form className={styles.consentForm} onSubmit={continueToParticipant}>
      <p className={styles.consentLinkRow}>
        <a
          className={styles.consentLink}
          href={consent.consentFormHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {consent.consentFormLabel}
        </a>
      </p>

      <label className={styles.consentCheckbox}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => {
            setAgreed(event.target.checked);
            if (event.target.checked) setError("");
          }}
          required
        />
        <span>
          <strong>{consent.checkboxLabel}</strong>
        </span>
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.consentActions}>
        <button className={styles.button} type="submit" disabled={!agreed}>
          {consent.continueLabel}
        </button>
      </div>
    </form>
  );
}
