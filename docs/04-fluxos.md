# Fluxos

## 1) Escolher peça no catálogo
1. User clica numa peça do `ClothingCarrousel`
2. `selectedPieceIndex` muda
3. `selectedPiece` passa a ser a peça atual (com `seamCount`)
4. UI atualiza nome, nº de linhas e pattern (se aplicável)

## 2) Mudar modo (piece/selected)
1. User clica no `ModeSelector`
2. `sewingMode` muda
3. `useEffect([sewingMode])` limpa:
   - `selectedLine = null`
   - `multiSelectedIndexes = []`

## 3) Selecionar linhas no pattern
### Modo piece
1. User clica numa linha
2. `ClothingPattern` guarda 1 selecionada e chama `onLineSelect({id, code, ...})`
3. App guarda `selectedLine`
4. Toast: "Linha Lx definida como inicial"

### Modo selected
1. User clica múltiplas linhas
2. `ClothingPattern` gera `selectedIndexes` (0-based)
3. App converte para ids 1..N e guarda em `multiSelectedIndexes`

## 4) Selecionar todas / limpar todas
1. User clica "Todas" no `ModeSelector` (só em selected)
2. App:
   - se já tem todas selecionadas => limpa
   - senão => seleciona todas
3. App incrementa `selectAllTrigger` para forçar sincronização

## 5) Iniciar ciclo (Start)
Validações:
- modo piece: precisa `selectedLine`
- modo selected: precisa `multiSelectedIndexes.length > 0`

Ao iniciar:
1. `finishedLines=[]`, `totalSeconds=0`
2. constrói `order`:
   - piece: ordem circular a partir de `selectedLine.id`
   - selected: linhas selecionadas ordenadas
3. guarda `order` em `queueRef`
4. `isRunning=true`
5. toast `startOK(...)`
6. chama `runNextLineInQueue()` recursivo

## 6) Reset
1. limpa seleção e execução
2. limpa timeout ativo
3. zera timer
4. toast `resetInfo()`
