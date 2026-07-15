const SESSION_KEY = "assigned_vignette_id";

export interface AssignmentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function assignRandomVignette(
  vignetteIds: string[],
  storage: AssignmentStorage,
  random: () => number = Math.random,
): string {
  if (vignetteIds.length === 0) {
    throw new Error("Cannot assign from an empty vignette list.");
  }

  const stored = storage.getItem(SESSION_KEY);
  if (stored && vignetteIds.includes(stored)) {
    return stored;
  }

  const index = Math.min(
    vignetteIds.length - 1,
    Math.floor(random() * vignetteIds.length),
  );
  const assigned = vignetteIds[index];
  storage.setItem(SESSION_KEY, assigned);
  return assigned;
}
