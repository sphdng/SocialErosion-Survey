import styles from "@/app/study/study.module.css";
import { BackgroundDialog } from "@/components/BackgroundDialog";

interface VignettePanelProps {
  title: string;
  body: string;
  currentPosition: number;
  total: number;
}

export function VignettePanel({
  title,
  body,
  currentPosition,
  total,
}: VignettePanelProps) {
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean);

  return (
    <section
      className={styles.vignettePanel}
      aria-labelledby="vignette-heading"
    >
      <div className={styles.vignetteHeader}>
        <p className={styles.progress}>
          Scenario {currentPosition} of {total}
        </p>
        <BackgroundDialog />
      </div>
      <p className={styles.eyebrow}>Please read this scenario</p>
      <h1 id="vignette-heading" className={styles.vignetteTitle}>
        {title}
      </h1>

      <div className={styles.vignetteBody}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
