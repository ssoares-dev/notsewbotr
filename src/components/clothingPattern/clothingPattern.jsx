import React, { useState, useRef, useEffect } from "react";
import "./clothingPattern.css";

const ClothingPattern = ({
  imageUrl,
  vertices = [],
  onLineSelect,
  activeLineId,
  finishedLineIds = [],
  isInitialSelectedLineId,
  disableSelection = false,
  sewingMode,
  mode = "piece",
  selectAllTrigger = 0,
  multiSelectedIds = [], 
}) => {
  const [selectedLines, setSelectedLines] = useState([]); 
  const [hoveredLineIndex, setHoveredLineIndex] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageNaturalDimensions, setImageNaturalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  const scaleFactor = Math.max(0.5, Math.min(2, imageDimensions.width / 500));

  useEffect(() => {
    console.log("[ClothingPattern] useEffect multiSelectedIds:", {
      mode,
      multiSelectedIds,
    });

    if (mode !== "selected") return;
    
    const selectedIndexes = multiSelectedIds.map(id => id - 1);
    console.log("[ClothingPattern] Atualizando selectedLines para:", selectedIndexes);
    setSelectedLines(selectedIndexes);
  }, [multiSelectedIds, mode]);

  useEffect(() => {
    if (mode === "piece") {
      setSelectedLines([]);
    }
  }, [mode]);

  useEffect(() => {
    if (!imageRef.current || !imageLoaded) return;

    const imgEl = imageRef.current;

    const updateDimensions = () => {
      setImageDimensions({
        width: imgEl.clientWidth,
        height: imgEl.clientHeight,
      });
    };

    updateDimensions();

    let frameId = null;

    const handleResize = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateDimensions);
    };

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(imgEl);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", handleResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [imageUrl, imageLoaded]);

  const scaleCoordinates = (vertex) => {
    if (!imageNaturalDimensions.width || !imageDimensions.width) return vertex;
    const scaleX = imageDimensions.width / imageNaturalDimensions.width;
    const scaleY = imageDimensions.height / imageNaturalDimensions.height;
    return {
      x: vertex.x * scaleX,
      y: vertex.y * scaleY,
    };
  };

  const seamLines = [
    {
      id: 1,
      name: "L1 - Lateral Esquerda",
      vertices: [{ ...vertices[0] }, { ...vertices[1] }],
    },
    {
      id: 2,
      name: "L2 - Cava Esquerda",
      vertices: [{ ...vertices[1] }, { ...vertices[2] }, { ...vertices[3] }],
    },
    {
      id: 3,
      name: "L3 - Ombro Esquerdo",
      vertices: [{ ...vertices[3] }, { ...vertices[4] }],
    },
    {
      id: 4,
      name: "L4 - Gola",
      vertices: [{ ...vertices[4] }, { ...vertices[5] }, { ...vertices[6] }],
    },
    {
      id: 5,
      name: "L5 - Ombro Direito",
      vertices: [{ ...vertices[6] }, { ...vertices[7] }],
    },
    {
      id: 6,
      name: "L6 - Cava Direita",
      vertices: [{ ...vertices[7] }, { ...vertices[8] }, { ...vertices[9] }],
    },
    {
      id: 7,
      name: "L7 - Lateral Direita",
      vertices: [{ ...vertices[9] }, { ...vertices[10] }],
    },
    {
      id: 8,
      name: "L8 - Base",
      vertices: [{ ...vertices[10] }, { ...vertices[11] }],
    },
  ];

  const generateSmoothPath = (vertices) => {
    if (vertices.length < 2) return "";
    const scaledVertices = vertices.map((v) => scaleCoordinates(v));
    let path = `M ${scaledVertices[0].x} ${scaledVertices[0].y}`;
    if (vertices.length === 2) {
      path += ` L ${scaledVertices[1].x} ${scaledVertices[1].y}`;
    } else if (vertices.length === 3) {
      path += ` Q ${scaledVertices[1].x} ${scaledVertices[1].y}, ${scaledVertices[2].x} ${scaledVertices[2].y}`;
    }
    return path;
  };

  const handleLineClick = (index) => {
    if (disableSelection) return;

    const line = seamLines[index];
    console.log("[ClothingPattern] handleLineClick:", { index, line, mode });

    setSelectedLines((prev) => {
      let nextSelected;

      if (mode === "piece") {
        const already = prev.includes(index);
        nextSelected = already ? [] : [index];
        console.log("[ClothingPattern] Modo piece, nextSelected:", nextSelected);
      } else {
        if (prev.includes(index)) {
          nextSelected = prev.filter((i) => i !== index);
          console.log("[ClothingPattern] Desselecionando linha, nextSelected:", nextSelected);
        } else {
          nextSelected = [...prev, index];
          console.log("[ClothingPattern] Selecionando linha, nextSelected:", nextSelected);
        }
      }

      // avisar o pai do click + lista atual
      if (onLineSelect) {
        const payload = {
          id: line.id,
          code: line.name.split(" ")[0],
          name: line.name,
          selectedIndexes: nextSelected,
        };
        console.log("[ClothingPattern] Chamando onLineSelect com:", payload);
        onLineSelect(payload);
      }

      return nextSelected;
    });
  };

  const handleImageLoad = (e) => {
    setImageNaturalDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
    setImageDimensions({
      width: e.target.offsetWidth,
      height: e.target.offsetHeight,
    });
    setImageLoaded(true);
  };

  const uniqueExtremes = [];
  seamLines.forEach((line) => {
    [line.vertices[0], line.vertices[line.vertices.length - 1]].forEach(
      (pt) => {
        if (!uniqueExtremes.some((p) => p.x === pt.x && p.y === pt.y)) {
          uniqueExtremes.push(pt);
        }
      }
    );
  });

  const getExtremeStatusColors = (vertex) => {
    let isFinished = false;
    let isActive = false;
    let isInitialSelected = false;

    seamLines.forEach((line) => {
      const start = line.vertices[0];
      const end = line.vertices[line.vertices.length - 1];

      const matchesStart = vertex.x === start.x && vertex.y === start.y;
      const matchesEnd = vertex.x === end.x && vertex.y === end.y;

      if (!matchesStart && !matchesEnd) return;

      if (finishedLineIds.includes(line.id)) isFinished = true;
      if (activeLineId === line.id) isActive = true;
      if (isInitialSelectedLineId === line.id) isInitialSelected = true;
    });

    if (isFinished) return { fill: "#00d966", stroke: "#00d966" };
    if (isActive) return { fill: "#ff9800", stroke: "#ff9800" };
    if (isInitialSelected) return { fill: "#4da6ff", stroke: "#4da6ff" };
    return { fill: "#fff", stroke: "#bbb" };
  };

  console.log("[ClothingPattern] Render - selectedLines:", selectedLines);

  const selectedIdx = selectedLines.length ? selectedLines[0] : null;
  const selectedLine = selectedIdx !== null ? seamLines[selectedIdx] : null;
  const selectedStart = selectedLine ? selectedLine.vertices[0] : null;
  const selectedEnd =
    selectedLine && selectedLine.vertices[selectedLine.vertices.length - 1];

  return (
    <div className="clothing-pattern-container">
      <div className="pattern-canvas-wrapper">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Clothing Pattern"
          className="pattern-image"
          onLoad={handleImageLoad}
        />

        {imageLoaded && (
          <svg
            className="pattern-overlay"
            width={imageDimensions.width}
            height={imageDimensions.height}
            viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
          >
            {seamLines.map((line, idx) => {
              const isSelectedLocal = selectedLines.includes(idx);
              const isHovered = hoveredLineIndex === idx;
              const pathD = generateSmoothPath(line.vertices);

              const isFinished = finishedLineIds.includes(line.id);
              const isActive = activeLineId === line.id;
              const isInitialSelected = isInitialSelectedLineId === line.id;

              let strokeColor = "#cccccc";

              if (isFinished) strokeColor = "#00d966";
              else if (isActive) strokeColor = "#ff9800";
              else if (isInitialSelected || isSelectedLocal) strokeColor = "#4da6ff";
              else if (isHovered) strokeColor = "#4da6ff";

              const startPoint = scaleCoordinates(line.vertices[0]);
              const endPoint = scaleCoordinates(
                line.vertices[line.vertices.length - 1]
              );

              return (
                <g key={line.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={20}
                    style={{
                      cursor: disableSelection ? "default" : "pointer",
                    }}
                    onMouseEnter={
                      disableSelection
                        ? undefined
                        : () => setHoveredLineIndex(idx)
                    }
                    onMouseLeave={
                      disableSelection
                        ? undefined
                        : () => setHoveredLineIndex(null)
                    }
                    onClick={
                      disableSelection ? undefined : () => handleLineClick(idx)
                    }
                  />

                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={5 * scaleFactor}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke 0.2s, stroke-width 0.2s",
                      pointerEvents: "none",
                    }}
                  />

                  {(isHovered || isSelectedLocal) && (
                    <g style={{ pointerEvents: "none" }}>
                      {line.vertices.length === 3 ? (
                        (() => {
                          const p0 = scaleCoordinates(line.vertices[0]);
                          const p1 = scaleCoordinates(line.vertices[1]);
                          const p2 = scaleCoordinates(line.vertices[2]);
                          const t = 0.5;
                          const x =
                            (1 - t) * (1 - t) * p0.x +
                            2 * (1 - t) * t * p1.x +
                            t * t * p2.x;
                          const y =
                            (1 - t) * (1 - t) * p0.y +
                            2 * (1 - t) * t * p1.y +
                            t * t * p2.y;
                          return (
                            <>
                              <circle
                                cx={x}
                                cy={y}
                                r={10}
                                fill="#fff"
                                stroke={strokeColor}
                                strokeWidth={2}
                              />
                              <text
                                x={x}
                                y={y + 5}
                                textAnchor="middle"
                                fontSize="12"
                                fill={strokeColor}
                                fontWeight="bold"
                              >
                                {line.name.split(" ")[0]}
                              </text>
                            </>
                          );
                        })()
                      ) : (
                        <>
                          <circle
                            cx={(startPoint.x + endPoint.x) / 2}
                            cy={(startPoint.y + endPoint.y) / 2}
                            r={10}
                            fill="#fff"
                            stroke={strokeColor}
                            strokeWidth={2}
                          />
                          <text
                            x={(startPoint.x + endPoint.x) / 2}
                            y={(startPoint.y + endPoint.y) / 2 + 5}
                            textAnchor="middle"
                            fontSize="12"
                            fill={strokeColor}
                            fontWeight="bold"
                          >
                            {line.name.split(" ")[0]}
                          </text>
                        </>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

            {uniqueExtremes.map((vertex, idx) => {
              const p = scaleCoordinates(vertex);
              const { fill, stroke } = getExtremeStatusColors(vertex);

              return (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={6}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  style={{ pointerEvents: "none" }}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default ClothingPattern;