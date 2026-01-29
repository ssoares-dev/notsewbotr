import React from "react";
import "./stateCard.css";

// Linha de estado dinâmica
const StateRow = ({ type, label, line, time }) => {
  const config = {
    selected: {
      dot: "#2196f3",
      bg: "#eaf3ff",
      label: "Costura Selecionada",
      badgeBg: "#2196f3",
      badgeColor: "#fff",
    },
    finished: {
      dot: "#19c197",
      bg: "#e7f8f3",
      label: "Costura Concluída",
      badgeBg: "#19c197",
      badgeColor: "#fff",
    },
    progress: {
      dot: "#ff9800",
      bg: "#fff7e6",
      label: "Costura em Progresso",
      badgeBg: "#ff9800",
      badgeColor: "#fff",
    },
  };

  const c = config[type] || config.selected;

  return (
    <div className="state-row" style={{ background: c.bg }}>
      <span className="state-dot" style={{ background: c.dot }} />
      <span className="state-label">{label || c.label}</span>
      {time && <span className="state-time">{time}</span>}
      {line && (
        <span
          className="state-badge"
          style={{ background: c.badgeBg, color: c.badgeColor }}
        >
          {line}
        </span>
      )}
    </div>
  );
};

const StateCard = ({
  selectedLine,
  selectedLines = [],
  finishedLines = [],
  inProgressLine,
  machineActive,
  showEmpty,
  totalTime,
}) => {
  const displayTotalTime = totalTime || "0.0s";
  const hasSelectedLine = selectedLine || selectedLines.length > 0;
  const hasInProgress = inProgressLine;
  const hasFinished = finishedLines.length > 0;

  return (
    <div className="state-card">
      <div className="state-header">
        <div className="state-time-label">Tempo Total</div>
        <div className="state-time-value">{displayTotalTime}</div>
      </div>

      <hr className="state-divider" />

      <div className="state-list">
        {/* Modo piece: linha única */}
        {selectedLine && !inProgressLine && (
          <StateRow type="selected" line={selectedLine} />
        )}

        {/* Modo selected: múltiplas linhas */}
        {selectedLines.length > 0 && !inProgressLine && (
          <div className="state-selected-section">
            <div className="state-selected-header">
              <span className="state-dot" style={{ background: "#2196f3" }} />
              <span className="state-label">Costuras Selecionadas</span>
              <span className="state-count">{selectedLines.length}</span>
            </div>
            <div className="state-selected-lines">
              {selectedLines.map((line, idx) => (
                <span key={idx} className="state-selected-badge">
                  {line}
                </span>
              ))}
            </div>
          </div>
        )}

        {inProgressLine && (
          <StateRow type="progress" line={inProgressLine.line} />
        )}

        {finishedLines.map((item, idx) => (
          <StateRow
            key={idx}
            type="finished"
            line={item.line}
            time={item.time}
          />
        ))}

        {!inProgressLine && finishedLines.length === 0 && showEmpty && !hasSelectedLine && (
          <div className="state-empty">
            <img src="images/placeholder.svg" alt="Empty State" />
            <div className="state-empty-text">
              Por favor, selecione a costura inicial
            </div>
          </div>
        )}
      </div>

      <div className="state-machine">
        <div className="state-machine-status">
          <span
            className="state-dot"
            style={{ background: machineActive ? "#19c197" : "#ccc" }}
          />
          <span className="state-machine-label">
            {machineActive ? "Máquina Ativa" : "Máquina Parada"}
          </span>
        </div>
        {machineActive && (
          <span className="state-machine-bars">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    </div>
  );
};

export default StateCard;