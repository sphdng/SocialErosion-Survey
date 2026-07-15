import { BackgroundContent } from "@/components/BackgroundContent";
import { StartStudyButton } from "@/components/StartStudyButton";
import styles from "./start.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <BackgroundContent />
        <div className={styles.actions}>
          <StartStudyButton />
        </div>
      </section>
    </main>
  );
}
