import type { Vignette } from "../types";
import { isPlaceholderContent } from "../lib/vignettes";
import "./VignetteCard.css";

type VignetteCardProps = {
  vignette: Vignette;
};

export function VignetteCard({ vignette }: VignetteCardProps) {
  return (
    <div className="vignette-card">
      <p className="vignette-card__text">{vignette.text}</p>
      {isPlaceholderContent(vignette) && (
        <p className="vignette-card__stub-notice" role="note">
          Question and answer options are placeholders — not yet finalized for
          data collection.
        </p>
      )}
    </div>
  );
}
