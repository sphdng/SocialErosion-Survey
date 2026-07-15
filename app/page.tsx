import { StartStudyButton } from "@/components/StartStudyButton";
import styles from "./start.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.entryIntro}>
          <p className={styles.eyebrow}>Workplace AI research</p>
          <h1>Welcome to the study</h1>
          <p>
            Enter the participant ID provided by the research team. You will
            review the study background on the next page before beginning the
            scenarios.
          </p>
        </div>
        <div className={styles.actions}>
          <StartStudyButton />
        </div>
      </section>
    </main>
  );
}
