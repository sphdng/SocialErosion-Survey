import { IntroBlurbCard } from "./IntroBlurbCard";
import "./IntroBlurbModal.css";

type IntroBlurbModalProps = {
  open: boolean;
  onClose: () => void;
};

export function IntroBlurbModal({ open, onClose }: IntroBlurbModalProps) {
  if (!open) return null;

  return (
    <div
      className="intro-blurb-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-blurb-title"
      onClick={onClose}
    >
      <div
        className="intro-blurb-modal__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="intro-blurb-modal__header">
          <h2 id="intro-blurb-title">Background</h2>
          <button
            type="button"
            className="intro-blurb-modal__close"
            onClick={onClose}
            aria-label="Close background information"
          >
            ×
          </button>
        </div>
        <IntroBlurbCard />
      </div>
    </div>
  );
}
