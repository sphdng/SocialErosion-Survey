import type { SurveyResponse } from "../types";

export function exportResponsesToCsv(
  responses: Record<string, SurveyResponse>,
  filename = "survey_responses.csv",
): void {
  const rows = [["vignette_id", "choice", "timestamp"]];

  for (const [id, response] of Object.entries(responses).sort(
    ([a], [b]) => Number(a) - Number(b),
  )) {
    rows.push([id, response.choice, response.timestamp]);
  }

  const csv = rows.map((row) => row.map(escapeCsvField).join(",")).join("\n");
  downloadBlob(csv, filename, "text/csv");
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
