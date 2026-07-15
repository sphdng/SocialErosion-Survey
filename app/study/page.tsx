import { StudyError } from "@/components/StudyError";
import {
  buildQualtricsSessionUrl,
  isValidQualtricsUrl,
} from "@/lib/qualtrics";
import {
  assertValidStudyConfig,
  studySettings,
  vignettes,
} from "@/lib/studyConfig";
import { StudyExperience } from "./StudyExperience";

export default function StudyPage() {
  try {
    assertValidStudyConfig();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
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

  const surveyUrl = buildQualtricsSessionUrl(
    baseUrl,
    vignettes,
    studySettings.source,
  );

  return (
    <StudyExperience
      vignettes={vignettes}
      surveyUrl={surveyUrl}
      iframeTitle={studySettings.iframeTitle}
      showDirectLinkFallback={studySettings.showDirectLinkFallback}
    />
  );
}
