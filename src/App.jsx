import './App.css';
import { useState, useRef, useEffect } from 'react';
import ClothingPattern from './components/clothingPattern/clothingPattern';
import ClothingCarrousel from './components/clothingCarrousel/clothingCarrousel';
import DetailsCard from './components/detailsCard/detailsCard';
import StateCard from './components/stateCard/stateCard';
import ActionButton from './components/others/action_button';
import Header from './components/others/header';
import Footer from './components/others/footer';
import useToastManager from './hooks/useToastManager';
import NotificationToast from './components/others/notificationToast';
import ModeSelector from './components/modeSelector/modeSelector';

function App() {
const clothingItems = [
  { name: "Top Salsa", image: "/images/salsa.jpg", seamCount: 10 },
  { name: "Camisola Seleção 2025", image: "/images/teste.jpeg", seamCount: 8 },
  { name: "Calça Jeans", image: "/images/salsajeans.jpg", seamCount: 8 },
  { name: "Vestido Verde", image: "/images/zara4.jpg", seamCount: 5 },
  { name: "Top Jeans", image: "/images/zippi.jpg", seamCount: 7 },
  { name: "Vestido de Folhos", image: "/images/zippy2.jpeg", seamCount: 9 },
  { name: "Top Salsa", image: "/images/salsa.jpg", seamCount: 10 },
  { name: "Calça Jeans", image: "/images/salsajeans.jpg", seamCount: 8 },
  { name: "Vestido Verde", image: "/images/zara4.jpg", seamCount: 5 },
  { name: "Top Jeans", image: "/images/zippi.jpg", seamCount: 7 },
  { name: "Vestido de Folhos", image: "/images/zippy2.jpeg", seamCount: 9 }
];

  const moldeVertices = [
    { x: 183, y: 335 }, { x: 182, y: 233 }, { x: 212, y: 217 }, { x: 192, y: 172 },
    { x: 226, y: 163 }, { x: 252, y: 210 }, { x: 272, y: 163 }, { x: 307, y: 172 },
    { x: 290, y: 220 }, { x: 316, y: 233 }, { x: 316, y: 335 }, { x: 183, y: 335 }
  ];

  const [catalogCollapsed, setCatalogCollapsed] = useState(false);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(0);
  const selectedPiece = clothingItems[selectedPieceIndex] ?? clothingItems[0];

  // 🔹 Estados de linhas
  const [selectedLine, setSelectedLine] = useState(null); // modo piece - linha inicial
  const [multiSelectedIndexes, setMultiSelectedIndexes] = useState([]); // modo selected - múltiplas linhas
  const [inProgressLine, setInProgressLine] = useState(null);
  const [finishedLines, setFinishedLines] = useState([]);

  // 🔹 Timer e máquina
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const runTimeoutRef = useRef(null);
  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);

  const [sewingMode, setSewingMode] = useState("piece"); // "piece" | "selected"
  const [selectAllTrigger, setSelectAllTrigger] = useState(0);

  const totalLines = selectedPiece?.seamCount || 0;

  const { toasts, removeToast, noInitialLine, startOK, pieceFinished, resetInfo, blockPieceChange, lineSelected, pieceSelected } = useToastManager();

  // 🔹 Quando mudar de modo, limpar seleções anteriores
  useEffect(() => {
    setSelectedLine(null);
    setMultiSelectedIndexes([]);
  }, [sewingMode]);

  // 🔹 Timer
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTotalSeconds((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(id);
  }, [isRunning]);

  // 🔹 Cleanup timeout
  useEffect(() => {
    return () => {
      if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    };
  }, []);

  // 🔹 Handler para seleção de linha no pattern
  const handleLineSelect = (lineInfo) => {
    if (isRunning) {
      return;
    }

    if (sewingMode === "piece") {
      setSelectedLine(lineInfo);
      setMultiSelectedIndexes([]);
      if (lineInfo?.code) {
        lineSelected(lineInfo.code);
      }
    } else {
      const selectedIds = (lineInfo.selectedIndexes || []).map(idx => idx + 1);

      setMultiSelectedIndexes(selectedIds);
    }
  };

const handleSelectAll = () => {
  if (sewingMode === "selected") {
    const allLineIds = Array.from({ length: totalLines }, (_, i) => i + 1);
    if (multiSelectedIndexes.length === totalLines) {
      // Desselecionar todas
      setMultiSelectedIndexes([]);
      setSelectAllTrigger((prev) => prev + 1); // 👈 trigger para limpar
    } else {
      // Selecionar todas
      setMultiSelectedIndexes(allLineIds);
      setSelectAllTrigger((prev) => prev + 1); // 👈 trigger para selecionar
    }
  }
};
  // 🔹 Run queue
  const runNextLineInQueue = () => {
    const queue = queueRef.current;
    const idx = queueIndexRef.current;

    if (idx >= queue.length) {
      setInProgressLine(null);
      setSelectedLine(null);
      setIsRunning(false);

      const seamCount = selectedPiece?.seamCount ?? 0;
      const totalTimeFormatted = `${totalSeconds.toFixed(1)}s`;
      pieceFinished(seamCount, totalTimeFormatted);
      return;
    }

    const lineId = queue[idx];
    const lineCode = `L${lineId}`;
    const lineObj = { id: lineId, code: lineCode, name: lineCode };

    setInProgressLine(lineObj);

    const start = performance.now();
    const durationMs = 2000 + Math.random() * 3000;

    runTimeoutRef.current = setTimeout(() => {
      const elapsed = (performance.now() - start) / 1000;

      setFinishedLines((prev) => {
        if (prev.some((l) => l.id === lineId)) return prev;
        return [...prev, { id: lineId, code: lineCode, time: `${elapsed.toFixed(1)}s` }];
      });

      queueIndexRef.current = idx + 1;
      runNextLineInQueue();
    }, durationMs);
  };

  // 🔹 Iniciar
  const handleStart = () => {

    if (sewingMode === "piece" && !selectedLine) {
      noInitialLine();
      return;
    }

    if (sewingMode === "selected" && multiSelectedIndexes.length === 0) {
      noInitialLine();
      return;
    }

    if (isRunning) {
      return;
    }

    setFinishedLines([]);
    setTotalSeconds(0);

    let order = [];
    if (sewingMode === "piece") {
      // Fila a partir da linha inicial
      const startId = selectedLine.id;
      for (let i = 0; i < totalLines; i++) {
        const id = ((startId - 1 + i) % totalLines) + 1;
        order.push(id);
      }
    } else {
      // Fila com as linhas selecionadas (ordenadas)
      order = [...multiSelectedIndexes].sort((a, b) => a - b);
    }

    queueRef.current = order;
    queueIndexRef.current = 0;
    setIsRunning(true);

    if (sewingMode === "piece" && selectedLine?.code) {
      startOK(selectedLine.code);
    } else if (sewingMode === "selected") {
      startOK(`${order.length} linhas`);
    }

    runNextLineInQueue();
  };

  // 🔹 Reiniciar
  const handleReset = () => {
    setSelectedLine(null);
    setMultiSelectedIndexes([]);
    setInProgressLine(null);
    setFinishedLines([]);
    setIsRunning(false);
    setTotalSeconds(0);

    queueRef.current = [];
    queueIndexRef.current = 0;

    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
    }

    resetInfo();
  };

  const seamCount = selectedPiece?.seamCount ?? 0;
  const completedCount = finishedLines.length;

  return (
    <div className="App">
      <Header />

      <div className="app-body">
        <aside className={`side-fixed ${catalogCollapsed ? 'is-collapsed' : ''}`}>
          <ClothingCarrousel
            items={clothingItems}
            selectedIndex={selectedPieceIndex}
            onSelect={setSelectedPieceIndex}
            collapsed={catalogCollapsed}
            onToggle={() => setCatalogCollapsed((prev) => !prev)}
            isRunning={isRunning}
          />
        </aside>

        <div className="body-right">
          <div className="piece-top-bar">
            <div className="piece-info">
              <div className="piece-image-wrapper">
                <div className="piece-name">{selectedPiece?.name}</div>
                <div className="piece-lines">{selectedPiece?.seamCount} linhas de costura</div>
              </div>

              <ModeSelector
                mode={sewingMode}
                onModeChange={(mode) => setSewingMode(mode)}
                selectedCount={multiSelectedIndexes.length}
                onSelectAll={handleSelectAll}
              />
            </div>

            <div className="piece-actions">
              <ActionButton
                title="Iniciar"
                icon="/images/play_icon.svg"
                onClick={handleStart}
                buttonColor="#00BC7D"
                titleColor="white"
              />
              <ActionButton
                title="Reiniciar"
                icon="/images/reset_icon.svg"
                onClick={handleReset}
                buttonColor="white"
                titleColor="#00BC7D"
              />
            </div>
          </div>

          <div className="body-main">
            <div className="main-grid">
              <div className="pattern-area">
                <ClothingPattern
                  vertices={moldeVertices}
                  imageUrl="images/molde.png"
                  onLineSelect={handleLineSelect}
                  activeLineId={inProgressLine?.id}
                  finishedLineIds={finishedLines.map((l) => l.id)}
                  selectedLineId={sewingMode === "piece" ? selectedLine?.id : null}
                  multiSelectedIds={sewingMode === "selected" ? multiSelectedIndexes : []} 
                  disableSelection={isRunning}
                  mode={sewingMode}
                  selectAllTrigger={selectAllTrigger}
                />
              </div>

              <div className="status-column">
                <DetailsCard seamCount={seamCount} completed={completedCount} selectedCount={multiSelectedIndexes.length} mode={sewingMode} />

                <div className="status-card">
                  <StateCard
                    selectedLine={
                      sewingMode === "piece" && selectedLine
                        ? selectedLine.code
                        : null
                    }
                    selectedLines={
                      sewingMode === "selected" && multiSelectedIndexes.length > 0
                        ? multiSelectedIndexes.map((id) => `L${id}`)
                        : []
                    }
                    inProgressLine={inProgressLine && { line: inProgressLine.code }}
                    finishedLines={finishedLines.map((l) => ({ line: l.code, time: l.time }))}
                    machineActive={isRunning}
                    showEmpty={true}
                    totalTime={`${totalSeconds.toFixed(1)}s`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <NotificationToast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;