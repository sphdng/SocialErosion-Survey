import { INTRO_BLURB } from "../config";
import "./IntroBlurbCard.css";

export function IntroBlurbCard() {
  return (
    <div className="intro-blurb-card">
      {INTRO_BLURB.map((paragraph) => (
        <p key={paragraph} className="intro-blurb-card__paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
