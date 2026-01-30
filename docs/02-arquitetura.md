# Arquitetura

## App.jsx (orquestrador)
### Estado principal
- Catálogo/UI:
  - `catalogCollapsed`
  - `selectedPieceIndex`
  - `sewingMode`: `"piece" | "selected"`
  - `selectAllTrigger` (trigger para o pattern sincronizar seleção total)

- Seleções (dependem do modo):
  - `selectedLine` (modo piece: linha inicial)
  - `multiSelectedIndexes` (modo selected: lista de ids 1..N)

- Execução:
  - `isRunning`
  - `totalSeconds`
  - `inProgressLine`
  - `finishedLines`

### Refs usados para a fila (queue)
- `queueRef.current`: array de ids (ordem de execução)
- `queueIndexRef.current`: índice atual da fila
- `runTimeoutRef.current`: timeout ativo (para limpar no reset/unmount)

### Timer de UI (totalSeconds)
- quando `isRunning`:
  - interval de 100ms
  - incrementa 0.1s
- é resetado no `handleStart`/`handleReset`

## Fluxo de execução (máquina)
### runNextLineInQueue()
- se acabou a fila:
  - limpa estado (`inProgressLine`, `selectedLine`)
  - `isRunning=false`
  - toast “Peça concluída” com totalTime
- senão:
  - define `inProgressLine` para a linha atual
  - cria um timeout (2s a 5s)
  - ao terminar:
    - adiciona a linha a `finishedLines` (se ainda não existir)
    - avança índice e chama recursivamente `runNextLineInQueue()`

## ClothingPattern (seleção de linhas)
- desenha o molde + overlay SVG de linhas
- mantém um estado local `selectedLines` (indexes 0-based)
- em modo `piece`: permite 1 selecionada
- em modo `selected`: permite múltiplas selecionadas
- chama `onLineSelect(payload)` para o App atualizar:
  - no modo piece: `selectedLine = {id, code, name}`
  - no modo selected: App guarda ids 1..N em `multiSelectedIndexes`

> Nota: App e Pattern sincronizam seleção no modo selected através de `multiSelectedIds` e `selectAllTrigger`.

## useToastManager (toasts)
Hook que centraliza:
- lista `toasts`
- `push(variant, title, message)` com auto-close 4s
- funções semânticas: `noInitialLine`, `startOK`, `pieceFinished`, `resetInfo`, etc.

## DetailsCard / StateCard
- `DetailsCard`: mostra percentagem de progresso (linhas concluídas / total)
- `StateCard`: mostra:
  - linha selecionada (piece) ou lista selecionada (selected)
  - linha em progresso
  - lista de linhas concluídas com tempo
  - estado da máquina (ativa/parada)
