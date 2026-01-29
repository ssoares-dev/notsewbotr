import React from "react";
import "./detailsCard.css";

const DetailsCard = ({ 
  seamCount = 0, 
  completed = 0,
  selectedCount,
  mode
}) => {
  // Se modo "selected" e há linhas selecionadas, o total é selectedCount
  // Caso contrário, o total é o seamCount total da peça
  const total = mode === "selected" && selectedCount > 0 ? selectedCount : seamCount;
  const percent = Math.round((completed / total) * 100) || 0;

  return (
    <div className="progress-card-wrapper">
      {/* Header */}
      <div className="pc-header">
        <img className="pc-icon" src="/images/progress_icon.svg" alt="Icon" />
        <span className="pc-title">PROGRESSO</span>
      </div>

      {/* Values */}
      <div className="pc-values">
        <span className="pc-lines">
          {completed}/{total} linhas
        </span>
        <span className="pc-percent">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="pc-bar-bg">
        <div className="pc-bar-fg" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default DetailsCard;