import "./ProgressBar.css";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-bar">
      <div className="progress-bar__label">
        Vignette {current} of {total}
      </div>
      <div className="progress-bar__track" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
