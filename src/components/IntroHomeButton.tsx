import { useState } from "react";
import { IntroBlurbModal } from "./IntroBlurbModal";
import "./IntroHomeButton.css";

type IntroHomeButtonProps = {
  className?: string;
};

export function IntroHomeButton({ className = "" }: IntroHomeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`intro-home-button ${className}`.trim()}
        onClick={() => setOpen(true)}
        aria-label="View background information"
        title="View background information"
      >
        <svg
          className="intro-home-button__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3 3 10.5V20a1 1 0 0 0 1 1h6v-6h4v6h6a1 1 0 0 0 1-1v-9.5L12 3z" />
        </svg>
      </button>
      <IntroBlurbModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
