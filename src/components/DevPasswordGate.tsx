import { useState, type FormEvent } from "react";
import { DEV_PASSWORD } from "../config";
import { setDevAuthed } from "../lib/storage";
import "./DevPasswordGate.css";

type DevPasswordGateProps = {
  onAuthenticated: () => void;
};

export function DevPasswordGate({ onAuthenticated }: DevPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === DEV_PASSWORD) {
      setDevAuthed(true);
      setError("");
      onAuthenticated();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="dev-gate">
      <div className="dev-gate__card">
        <h1>Dev Mode</h1>
        <p className="dev-gate__hint">
          Enter the researcher password to access vignette preview and response
          QA tools.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="dev-password" className="dev-gate__label">
            Password
          </label>
          <input
            id="dev-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="dev-gate__input"
          />
          {error && <p className="dev-gate__error">{error}</p>}
          <button type="submit" className="btn btn--primary">
            Enter Dev Mode
          </button>
        </form>
      </div>
    </div>
  );
}
