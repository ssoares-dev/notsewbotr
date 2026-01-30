# Convenções

## Regras de seleção
- enquanto `isRunning === true`:
  - não permitir seleção de linhas (App já ignora e Pattern tem `disableSelection`)

## Representações
- ids de linhas: 1..N
- indexes internos do SVG/array: 0..N-1
- codes: "L1", "L2", ...

## Execução
- fila de execução é guardada em refs para não depender de re-renders
- `runNextLineInQueue()` é recursivo via timeout

## Toasts
- usar `useToastManager` para mensagens consistentes (em vez de alert/console)
