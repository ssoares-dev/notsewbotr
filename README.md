UI de costura num molde (pattern), com seleção de linhas e execução de um “ciclo” de costura.
Permite 2 modos:
- **Peça Completa (piece)**: selecionar uma linha inicial e costurar todas as linhas numa sequência
- **Linhas Selecionadas (selected)**: selecionar várias linhas e costurar apenas essas

Inclui:
- catálogo de peças (carrossel)
- visualização do molde com linhas clicáveis (overlay SVG)
- estado da máquina e progresso (cards)
- notificações (toasts)

## Stack
- React (Create React App)
- CSS por componente
- Hooks (`useState`, `useEffect`, `useRef`)
- Assets em `public/images`

## Como correr
```bash
npm install
npm start
