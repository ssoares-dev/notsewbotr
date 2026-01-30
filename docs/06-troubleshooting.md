# Troubleshooting

## Não consigo selecionar linhas
- Se `isRunning` estiver true, seleção fica bloqueada
- Confirma se não tens um timeout ativo “preso” (reset deve limpar)

## Progresso (%) estranho no modo selected
- `DetailsCard` usa:
  - total = `selectedCount` (se >0)
  - caso contrário usa `seamCount`
- Se quiseres outro comportamento, altera esta regra.

## Selecionar todas não sincroniza com o pattern
- `ClothingPattern` sincroniza por `multiSelectedIds` (ids 1..N)
- Confirma conversão `id -> index`:
  - `selectedIndexes = multiSelectedIds.map(id => id - 1)`
