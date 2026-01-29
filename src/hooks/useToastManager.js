import { useState, useCallback } from "react";

let idCounter = 0;

export default function useToastManager() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((variant, title, message) => {
    const id = idCounter++;
    const toast = { id, variant, title, message };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => removeToast(id), 4000); // auto close
  }, [removeToast]);

  return {
    toasts,
    removeToast,

    // ---------- VALIDATIONS ----------
    noInitialLine: () =>
      push("warning", "Seleciona uma costura", "Escolhe a linha inicial no molde antes de começar."),

    // ---------- START ----------
    startOK: (lineCode) =>
      push("success", "Ciclo iniciado", `A costura ${lineCode} está em progresso. A máquina foi ativada.`),

    // ---------- FINISHED ----------
    pieceFinished: (seamCount, totalTime) =>
      push("success", "Peça concluída", `Todas as ${seamCount} costuras foram finalizadas. Tempo total: ${totalTime}.`),

    // ---------- RESET ----------
    resetInfo: () =>
      push("neutralBlue", null, "Progresso desta peça foi reiniciado."),

    // ---------- BLOCKED CHANGE ----------
    blockPieceChange: () =>
      push("error", "Não é possível trocar de peça", "Finalize ou reinicie a peça atual antes de selecionar outra."),

    // ---------- SELECT EVENTS ----------
    lineSelected: (lineCode) =>
      push("neutralBlue", "Costura selecionada", `Linha ${lineCode} definida como inicial.`),

    pieceSelected: (pieceName) =>
      push("neutralBlue", "Peça selecionada", `${pieceName} foi carregada.`),
  };
}
