import type { Choice } from "../types";
import { CHOICE_LABELS } from "../lib/vignettes";
import "./ResponseOptions.css";

type ResponseOptionsProps = {
  question: string;
  options: [string, string, string, string];
  selected: Choice | null;
  onSelect?: (choice: Choice) => void;
  isPlaceholder?: boolean;
  readOnly?: boolean;
};

export function ResponseOptions({
  question,
  options,
  selected,
  onSelect,
  isPlaceholder = false,
  readOnly = false,
}: ResponseOptionsProps) {
  return (
    <div className="response-options">
      <p className={`response-options__question${isPlaceholder ? " response-options__question--placeholder" : ""}`}>
        {question}
      </p>
      <div className="response-options__list" role="radiogroup" aria-label="Answer choices">
        {CHOICE_LABELS.map((label, index) => (
          <label
            key={label}
            className={`response-options__option${selected === label ? " response-options__option--selected" : ""}`}
          >
            <input
              type="radio"
              name="vignette-response"
              value={label}
              checked={selected === label}
              disabled={readOnly}
              onChange={() => onSelect?.(label)}
            />
            <span className="response-options__label">{label}.</span>
            <span className="response-options__text">{options[index]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
