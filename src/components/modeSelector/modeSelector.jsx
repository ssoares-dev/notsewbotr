import React from "react";
import "./modeSelector.css";

/**
 * props:
 *  - mode: "piece" | "selected"
 *  - onModeChange(mode)
 *  - selectedCount?: number  // nº de linhas selecionadas
 *  - onSelectAll?: () => void
 */
const ModeSelector = ({
  mode,
  onModeChange,
  selectedCount = 0,
  onSelectAll,
}) => {
  const hasSelected = selectedCount > 0;

  const countLabel =
    selectedCount === 1 ? "1 linha" : `${selectedCount} linhas`;

  return (
    <div className="mode-selector-wrapper">
      <span className="mode-label">MODO:</span>

      {/* grupo cinza com as 2 opções */}
      <div className="mode-group">
        <button
          type="button"
          className={`mode-option ${mode === "piece" ? "active" : ""}`}
          onClick={() => onModeChange("piece")}
        >
          Peça Completa
        </button>

        <button
          type="button"
          className={`mode-option ${mode === "selected" ? "active" : ""}`}
          onClick={() => onModeChange("selected")}
        >
          Linhas Selecionadas
        </button>
      </div>

      {/* Só aparece quando estamos em "Linhas Selecionadas" */}
      {mode === "selected" && (
        <>
          <button
            type="button"
            className="mode-all-button"
            onClick={onSelectAll}
          >
            Todas
          </button>
        </>
      )}
    </div>
  );
};

export default ModeSelector;
