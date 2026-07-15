import Image from "next/image";
import background from "@/config/background.json";
import styles from "./background.module.css";

interface BackgroundContentProps {
  showImage?: boolean;
  headingId?: string;
}

export function BackgroundContent({
  showImage = true,
  headingId,
}: BackgroundContentProps) {
  return (
    <div className={styles.content}>
      {showImage && (
        <Image
          className={styles.image}
          src={background.image}
          alt={background.imageAlt}
          width={1024}
          height={443}
          priority
        />
      )}
      <div className={styles.text}>
        <h1 id={headingId}>{background.title}</h1>
        {background.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={index === 4 || index === 5 ? styles.version : undefined}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
