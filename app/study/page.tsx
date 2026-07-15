import { QualtricsPanel } from "@/components/QualtricsPanel";
import { StudyError } from "@/components/StudyError";
import { VignettePanel } from "@/components/VignettePanel";
import { buildQualtricsUrl, isValidQualtricsUrl } from "@/lib/qualtrics";
import {
  assertValidStudyConfig,
  getVignetteById,
  studySettings,
  vignettes,
} from "@/lib/studyConfig";
import { StudyPageClient } from "./StudyPageClient";
import styles from "./study.module.css";

interface StudyPageProps {
  searchParams: Promise<{
    vignette?: string | string[];
  }>;
}

export default async function StudyPage({
  searchParams,
}: StudyPageProps) {
  try {
    assertValidStudyConfig();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
    return <StudyError />;
  }

  const params = await searchParams;
  const requestedId =
    typeof params.vignette === "string" ? params.vignette : undefined;

  if (!requestedId) {
    if (studySettings.assignmentMode === "random") {
      return (
        <StudyPageClient
          vignetteIds={vignettes.map((vignette) => vignette.id)}
        />
      );
    }

    return (
      <StudyError message="This study link is missing a vignette condition. Please return to the original study link or contact the research team." />
    );
  }

  const vignette = getVignetteById(requestedId);
  if (!vignette) {
    return <StudyError />;
  }

  const baseUrl = process.env.NEXT_PUBLIC_QUALTRICS_SURVEY_URL;
  if (
    !studySettings.qualtricsEnabled ||
    !baseUrl ||
    !isValidQualtricsUrl(baseUrl)
  ) {
    return (
      <StudyError message="The survey is temporarily unavailable. Please contact the research team." />
    );
  }

  const surveyUrl = buildQualtricsUrl(
    baseUrl,
    vignette,
    studySettings.source,
  );

  return (
    <main className={styles.studyPage}>
      <div className={styles.studyShell}>
        <VignettePanel
          title={vignette.title}
          body={vignette.body}
          conditionLabel={vignette.conditionLabel}
          vignetteId={vignette.id}
        />
        <QualtricsPanel
          surveyUrl={surveyUrl}
          iframeTitle={studySettings.iframeTitle}
          showDirectLinkFallback={
            studySettings.showDirectLinkFallback
          }
        />
      </div>
    </main>
  );
}
