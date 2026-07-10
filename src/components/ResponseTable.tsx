import type { SurveyResponse } from "../types";
import { exportResponsesToCsv } from "../lib/csvExport";
import { clearSurveyResponses } from "../lib/storage";
import "./ResponseTable.css";

type ResponseTableProps = {
  responses: Record<string, SurveyResponse>;
  onClear: () => void;
};

export function ResponseTable({ responses, onClear }: ResponseTableProps) {
  const entries = Object.entries(responses).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  function handleClear() {
    if (
      window.confirm(
        "Clear all stored responses? This cannot be undone.",
      )
    ) {
      clearSurveyResponses();
      onClear();
    }
  }

  function handleExport() {
    exportResponsesToCsv(responses, "survey_responses.csv");
  }

  return (
    <div className="response-table">
      <div className="response-table__header">
        <h2>Response QA</h2>
        <div className="response-table__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleClear}
            disabled={entries.length === 0}
          >
            Clear all responses
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="response-table__empty">No responses stored yet.</p>
      ) : (
        <div className="response-table__scroll">
          <table>
            <thead>
              <tr>
                <th>Vignette ID</th>
                <th>Choice</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([id, response]) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{response.choice}</td>
                  <td>{new Date(response.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="response-table__count">
        {entries.length} of 24 responses recorded
      </p>
    </div>
  );
}
