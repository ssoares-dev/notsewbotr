# Visão geral

## Objetivo
A app simula um ciclo de costura em linhas de um molde:
- o user escolhe uma peça (catálogo)
- escolhe um modo de costura
- seleciona uma linha inicial (modo piece) ou várias linhas (modo selected)
- inicia o ciclo
- a máquina “costura” uma linha de cada vez (timeout com duração aleatória)
- mostra progresso, linha em curso e linhas concluídas
- exibe toasts de validação e sucesso

## Modos
### 1) Peça Completa (piece)
- user seleciona 1 linha inicial no molde
- a execução segue por todas as linhas da peça, a partir da linha inicial

### 2) Linhas Selecionadas (selected)
- user seleciona várias linhas
- a execução percorre apenas as linhas selecionadas (ordenadas)

## Modelo de dados (interno)
### Clothing Item
- `name: string`
- `image: string` (path em `/images/...`)
- `seamCount: number` (número de linhas de costura)

### Linha de costura (durante execução)
- `id: number` (1..N)
- `code: string` (ex.: "L3")
- `time?: string` (tempo gasto nessa linha)

## Regras chave
- Quando `isRunning === true`, a seleção de linhas é bloqueada
- Ao iniciar:
  - `finishedLines = []`
  - `totalSeconds = 0`
  - constrói-se uma fila (`queueRef`) com a ordem das linhas
- Execução corre por timeouts (simulação)
- No fim da fila dispara toast “Peça concluída”
