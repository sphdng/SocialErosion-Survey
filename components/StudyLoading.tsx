import styles from "@/app/study/study.module.css";

export function StudyLoading() {
  return (
    <main className={styles.statePage}>
      <section className={styles.stateCard} aria-live="polite">
        <h1>Loading study</h1>
        <p>Please wait while your study condition is prepared.</p>
      </section>
    </main>
  );
}
