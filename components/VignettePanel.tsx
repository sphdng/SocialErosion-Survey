import styles from "@/app/study/study.module.css";

interface VignettePanelProps {
  title: string;
  body: string;
  conditionLabel?: string;
  vignetteId?: string;
}

export function VignettePanel({
  title,
  body,
  conditionLabel,
  vignetteId,
}: VignettePanelProps) {
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean);

  return (
    <section
      className={styles.vignettePanel}
      aria-labelledby="vignette-heading"
    >
      <p className={styles.eyebrow}>Please read this scenario</p>
      <h1 id="vignette-heading" className={styles.vignetteTitle}>
        {title}
      </h1>

      <div className={styles.vignetteBody}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {process.env.NODE_ENV === "development" &&
        conditionLabel &&
        vignetteId && (
          <p className={styles.condition}>
            Development preview: {vignetteId} — {conditionLabel}
          </p>
        )}
    </section>
  );
}
