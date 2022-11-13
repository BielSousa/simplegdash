# gdash

Este projeto visa facilitar a criação de dashboards simples para área de BI.
A partir da especificação dos dados e qual tipo de filtros, gráficos e quantidade cards você vai utilizar,
Ele ja rendenriza na pagina um dashboard interativo.

## Ainda em construção
## Colaborações são bem vindas

## sobre a base de dados
Para para inicializar o dashboard você precisa um objeto 

`{ data:{},charts:[],filters:[],cards:[]}` 

- **data**: tabela de dados 
    - *columns*: lista com nomes de colunas - ex: ['nome', 'idade] 
    - *columns_type*: lista com tipos das colunas - ex:['string', 'number'] 
        - <span style="color:red;font-weight:bold">Obs:</span> Tipos aceitos ['string', 'number', 'boolean', 'date', 'datetime', datetime', 'timeofday']
    - *columns_rows*:lista com lista de dados por linha - ex:\[['gabriel', 30],['mickey', 60]]
    - <span style="color:red;font-weight:bold">Obs:</span> A principio tem que ser no formato aceito pelo google charts, json ainda em construção.
- charts: lista de graficos a ser apresentado pode ser um objeto ou uma lista de objetos formando um grupo.
    - grid: número que entre 1-4 ou uma combinação que representa onde o grafico será alocado
        - <span style="color:red;font-weight:bold">Obs:</span> grids aceitos [1, 2, 3, 4, 12, 13, 24, 34]
    - type: tipo do grafico
        - <span style="color:red;font-weight:bold">Obs:</span> tipos aceitos ['Pie', 'Donuts', 'Bar', 'Column', 'Scatter', 'Histogram', 'Map', 'Table']
    - title: titulo do gráfico - ex:'Grafico Donuts'
    - columns: lista de índices das colunas que o gráfico usará - ex: [1, 3]
- filter: lista de filtros para o dashboard
    - type: tipo de filtro  
        - <span style="color:red;font-weight:bold">Obs:</span> tipos aceitos ['NumberRangeFilter', 'StringFilter', 'CategoryFilter', 'DateRangeFilter']
    - column: número da coluna a ser filtrada
- cards: lista de cards para apresentar os KPI's
    - type: tipo de card 
        - <span style="color:red;font-weight:bold">Obs:</span> tipos aceitos ['total', 'percent', 'total-perecent', 'percent-total']
        - <span style="color:red;font-weight:bold">Obs:</span> 'total-perecent' e 'percent-total' aparecerá no card na ondem definida no tipo
    - column: número da coluna que será usada para calcular o dividendo do total - ex:2
    - column_dividend: número da coluna que será usada para calcular o dividendo do percentual - ex: 3
    - column_divisor: número da coluna que será usada para calcular o dividendo do percentual - ex: 2
    - subtitle: titulo do card - ex:'Este é um título'
