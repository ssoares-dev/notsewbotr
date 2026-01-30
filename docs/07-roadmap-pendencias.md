# Roadmap / Pendências

## 1) Feature: sentido de costura (horário / anti-horário)
No modo **piece**, a ordem atual é “circular para a frente”.
Adicionar uma opção para inverter a ordem (costurar ao contrário).

Sugestão:
- novo estado no App:
  - `direction: "cw" | "ccw"` (ou "forward" | "reverse")
- UI:
  - toggle perto do ModeSelector (ex.: "Sentido: Horário / Anti-horário")

Implementação (no handleStart, modo piece):
- hoje:
  - `id = ((startId - 1 + i) % totalLines) + 1`
- anti-horário:
  - `id = ((startId - 1 - i + totalLines * 1000) % totalLines) + 1`
  - (o +totalLines*1000 é só para evitar negativo)

## 2) Bloquear troca de peça durante execução
O hook tem `blockPieceChange()`, mas o App ainda não usa.
Recomendado:
- no `ClothingCarrousel`, ao clicar:
  - se `isRunning` => mostrar toast e não mudar `selectedPieceIndex`

