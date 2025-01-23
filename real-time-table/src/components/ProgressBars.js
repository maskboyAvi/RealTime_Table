import React from "react";

const ProgressBars = ({ progressDone, progressFailed }) => {
  return (
    <div>
      <div className="progress-container">
        <h2>Progress</h2>
        <p>Done: {Math.round(progressDone)}%</p>
        <progress className="done" value={progressDone} max="100"></progress>
      </div>

      <div className="progress-container">
        <p>Failed: {Math.round(progressFailed)}%</p>
        <progress className="failed" value={progressFailed} max="100"></progress>
      </div>
    </div>
  );
};

export default ProgressBars;