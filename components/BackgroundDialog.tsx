"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundContent } from "./BackgroundContent";
import styles from "./background.module.css";

export function BackgroundDialog() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        className={styles.trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Review background information"
        title="Review background information"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 3 10.5V21h7v-6h4v6h7V10.5L12 3Zm0 2.6 7 5.8V19h-3v-6H8v6H5v-7.6l7-5.8Z" />
        </svg>
      </button>

      {open && (
        <div
          className={styles.backdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="background-dialog-title"
          >
            <button
              ref={closeButtonRef}
              className={styles.close}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close background information"
            >
              ×
            </button>
            <BackgroundContent headingId="background-dialog-title" />
          </section>
        </div>
      )}
    </>
  );
}
