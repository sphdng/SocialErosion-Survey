import type { Vignette } from "../types";
import { vignetteMeta } from "../lib/vignettes";
import "./FactorBoxGrid.css";

type FactorKey = "taskType" | "directedness" | "dataAccess" | "visibility";

const FACTOR_CONFIG: {
  key: FactorKey;
  label: string;
  color: string;
  blankLabel: string;
}[] = [
  {
    key: "taskType",
    label: "Task Type",
    color: "#3b82f6",
    blankLabel: "Factor A",
  },
  {
    key: "directedness",
    label: "Directedness",
    color: "#8b5cf6",
    blankLabel: "Factor B",
  },
  {
    key: "dataAccess",
    label: "Data Access",
    color: "#14b8a6",
    blankLabel: "Factor C",
  },
  {
    key: "visibility",
    label: "Visibility",
    color: "#f97316",
    blankLabel: "Factor D",
  },
];

type FactorBoxGridProps = {
  vignette: Vignette;
  mode: "blank" | "labeled";
  /** When set (Dev Mode), boxes become dropdowns that jump between factor combos. */
  onFactorChange?: (key: FactorKey, value: string) => void;
};

export function FactorBoxGrid({
  vignette,
  mode,
  onFactorChange,
}: FactorBoxGridProps) {
  const interactive = mode === "labeled" && Boolean(onFactorChange);

  return (
    <div className="factor-grid" aria-label="Scenario factors">
      {FACTOR_CONFIG.map((factor) => (
        <div
          key={factor.key}
          className={`factor-box${interactive ? " factor-box--interactive" : ""}`}
          style={{ backgroundColor: factor.color }}
        >
          {mode === "labeled" ? (
            <>
              <span className="factor-box__category">{factor.label}</span>
              {interactive ? (
                <select
                  className="factor-box__select"
                  aria-label={factor.label}
                  value={vignette[factor.key]}
                  onChange={(e) => onFactorChange?.(factor.key, e.target.value)}
                >
                  {vignetteMeta.factors[factor.key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="factor-box__value">{vignette[factor.key]}</span>
              )}
            </>
          ) : (
            <span className="factor-box__blank">{factor.blankLabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export { FACTOR_CONFIG };
export type { FactorKey };
