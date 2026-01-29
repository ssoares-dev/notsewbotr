import React from "react";
import "./timeCard.css";

const TimeCard = ({ seconds = 0 /* , points = 0 */ }) => {
  const formatted = `${seconds.toFixed(1)}s`;

  return (
    <div className="time-container">
      <div className="time-card-header">
        <div className="time-card-icon">
          {/* ícone relógio simples em SVG */}
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="12" x2="15" y2="14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <span className="time-card-title">TEMPO TOTAL</span>
      </div>

      <div className="time-card-body">
        <div className="time-card-value">
          <span className="time-card-number">{formatted}</span>
        </div>

        {/* 
        <div className="time-card-points">
          {points} pontos
        </div>
        */}
      </div>
    </div>
  );
};

export default TimeCard;
