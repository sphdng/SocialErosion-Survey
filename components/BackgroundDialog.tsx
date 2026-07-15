"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BackgroundContent } from "./BackgroundContent";
import styles from "./background.module.css";

export function BackgroundDialog() {
  const [open, setOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDialog, open]);

  return (
    <>
      <button
        ref={triggerButtonRef}
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

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeDialog();
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
                onClick={closeDialog}
                aria-label="Close background information"
              >
                ×
              </button>
              <BackgroundContent headingId="background-dialog-title" />
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
