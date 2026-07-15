import type { VignetteCondition } from "@/types/study";

export function buildQualtricsUrl(
  baseUrl: string,
  vignette: VignetteCondition,
  source = "vercel-study-site",
): string {
  const url = new URL(baseUrl);

  url.searchParams.set("vignette_id", vignette.id);
  url.searchParams.set("condition_label", vignette.conditionLabel);
  url.searchParams.set("source", source);

  for (const [key, value] of Object.entries(vignette.metadata ?? {})) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

export function buildQualtricsSessionUrl(
  baseUrl: string,
  vignettes: VignetteCondition[],
  source = "vercel-study-site",
): string {
  if (vignettes.length === 0) {
    throw new Error("At least one vignette is required.");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("source", source);
  url.searchParams.set(
    "vignette_ids",
    vignettes.map((vignette) => vignette.id).join(","),
  );
  url.searchParams.set("vignette_count", String(vignettes.length));

  vignettes.forEach((vignette, index) => {
    const position = index + 1;
    url.searchParams.set(`vignette_${position}`, vignette.id);
  });

  return url.toString();
}

export function isValidQualtricsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "nyu.qualtrics.com" &&
      /^\/jfe\/form\/SV_[A-Za-z0-9]+$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}
