import styles from "@/app/study/study.module.css";

interface StudyErrorProps {
  message?: string;
}

export function StudyError({
  message = "This study condition could not be loaded. Please return to the original study link or contact the research team.",
}: StudyErrorProps) {
  return (
    <main className={styles.statePage}>
      <section className={styles.stateCard} aria-live="assertive">
        <h1>Unable to load the study</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
