"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/start.module.css";

export function StartStudyButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function beginStudy() {
    setLoading(true);
    router.push("/study");
  }

  return (
    <button
      className={styles.button}
      type="button"
      onClick={beginStudy}
      disabled={loading}
    >
      {loading ? "Preparing study…" : "Begin study"}
    </button>
  );
}
