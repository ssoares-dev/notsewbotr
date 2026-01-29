import React, { useEffect, useRef } from "react";
import "./clothingCarrousel.css";

const ClothingCarrousel = ({
  collapsed,
  onToggle,
  items,
  selectedIndex,
  onSelect,
  isRunning,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (!collapsed && listRef.current) {
      const selectedEl = listRef.current.querySelector(".catalog-item.selected");
      if (selectedEl) {
        selectedEl.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [collapsed, selectedIndex]);

  return (
    <div className={`catalog-container ${collapsed ? "collapsed" : ""} ${isRunning ? "running" : ""}`}>
      <div className="catalog-list" ref={listRef}>
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <div
              key={item.name + idx}
              className={`catalog-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(idx)}
            >
              <img src={item.image} alt={item.name} />

              {!collapsed && (
                <div className="catalog-info">
                  <div className="catalog-title">{item.name}</div>
                  <div className="catalog-seams">
                    {item.seamCount} linhas
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="catalog-toggle"
        onClick={onToggle}
      >
        <img
          className="catalog-toggle-icon"
          src={collapsed ? "/images/arrow-right.svg" : "/images/arrow-left.svg"}
          alt={collapsed ? "Expandir catálogo" : "Colapsar catálogo"}
        />
      </button>
    </div>
  );
};

export default ClothingCarrousel;
