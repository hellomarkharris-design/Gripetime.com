// src/components/HeadToHead.jsx
import React from "react";

export default function HeadToHead({
  leftTitle = "Griper",
  rightTitle = "Gripee",
  leftCount = 0,
  rightCount = 0,
  onVoteLeft,
  onVoteRight,
}) {
  return (
    <section className="h2h">
      <header className="h2h-header">
        <h1 className="h2h-title">Head-to-Head</h1>
        <p className="h2h-sub">Two sides. One decision. You vote.</p>
      </header>

      <div className="h2h-stage">
        <div className="h2h-side left">
          <div className="h2h-role">{leftTitle}</div>
          <div className="h2h-score">{leftCount}</div>
          <button className="btn vote" onClick={onVoteLeft}>Vote Left</button>
        </div>

        <div className="h2h-vs">
          <span>VS</span>
        </div>

        <div className="h2h-side right">
          <div className="h2h-role">{rightTitle}</div>
          <div className="h2h-score">{rightCount}</div>
          <button className="btn vote" onClick={onVoteRight}>Vote Right</button>
        </div>
      </div>

      <footer className="h2h-footer">
        <div className="h2h-meter">
          <div
            className="h2h-meter-fill"
            style={{
              width:
                (leftCount + rightCount) === 0
                  ? "50%"
                  : `${Math.round((leftCount / (leftCount + rightCount)) * 100)}%`,
            }}
          />
        </div>
        <div className="h2h-meter-labels">
          <span>{leftTitle}</span>
          <span>{rightTitle}</span>
        </div>
      </footer>
    </section>
  );
}
