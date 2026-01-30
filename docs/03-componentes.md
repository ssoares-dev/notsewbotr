# Componentes

## App (`src/App.jsx`)
Responsável por:
- gerir estado global e modo de costura
- construir a fila de execução
- simular execução e tempos
- coordenar catálogo + pattern + cards
- mostrar toasts

## ClothingCarrousel (`components/clothingCarrousel/clothingCarrousel.jsx`)
Props:
- `items`, `selectedIndex`, `onSelect`
- `collapsed`, `onToggle`
- `isRunning`

Mostra lista de peças e permite colapsar/expandir. (Atualmente não bloqueia mudança durante execução.)

## ClothingPattern (`components/clothingPattern/clothingPattern.jsx`)
Props chave:
- `vertices`, `imageUrl`
- `onLineSelect`
- `activeLineId`, `finishedLineIds`
- `disableSelection`
- `mode` ("piece" | "selected")
- `multiSelectedIds`
- `selectAllTrigger`

Responsável por desenhar as linhas e gerir seleção local (0-based), avisando o App.

## ModeSelector (`components/modeSelector/modeSelector.jsx`)
- alterna entre `piece` e `selected`
- no modo `selected` mostra botão “Todas” (select all / clear all)

## DetailsCard (`components/detailsCard/detailsCard.jsx`)
- exibe progresso:
  - `completed / total`
  - % e barra de progresso
- no modo `selected`, o total é `selectedCount` (se houver seleção)

## StateCard (`components/stateCard/stateCard.jsx`)
- exibe:
  - tempo total
  - seleção (linha única ou lista)
  - linha em progresso
  - linhas concluídas + tempos
  - estado da máquina

## useToastManager (`src/hooks/useToastManager.js`)
- API semântica para disparar toasts consistentes na app.

## NotificationToast (`components/others/notificationToast.jsx`)
- render de toasts (depende da tua implementação no projeto)
