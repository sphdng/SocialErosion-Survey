const QUALTRICS_SURVEY_URL =
  process.env.NEXT_PUBLIC_QUALTRICS_SURVEY_URL ??
  "https://nyu.qualtrics.com/jfe/form/SV_by0axqrHkdSorA2";

export default function SurveyPage() {
  return (
    <main className="survey-page">
      <section className="survey-header">
        <h1>Survey</h1>
        <p>
          Please complete the survey below. Your responses will be submitted
          directly through NYU Qualtrics.
        </p>
      </section>

      <section className="survey-container">
        <iframe
          src={QUALTRICS_SURVEY_URL}
          title="NYU Qualtrics survey"
          loading="eager"
          allow="clipboard-write"
        />
      </section>

      <section className="survey-fallback">
        <p>If the survey does not load, open it directly in a new tab.</p>

        <a
          href={QUALTRICS_SURVEY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open survey
        </a>
      </section>
    </main>
  );
}
