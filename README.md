# gdash

Este projeto visa facilitar a criação de dashboards simples para área de BI.
A partir da especificação dos dados e qual tipo de filtros, gráficos e quantidade cards você vai utilizar,
Ele ja rendenriza na pagina um dashboard interativo.

## Ainda em construção
## Colaborações são bem vindas

## sobre a base de dados
    Para para inicializar o dashboard você precisa um objeto 
        {
            data:{},
            charts:[],
            filters:[],
            cards:[]
        }

    + data: tabela de dados 
        - columns: lista com nomes de colunas - ex: ['nome', 'idade] 
        - columns_type: lista com tipos das colunas - ex:['string','number'] 
            obs: Tipos aceitos ['string','number','boolean', 'date', 'datetime', datetime', 'timeofday']
        columns_rows:lista com lista de dados por linha - ex:[['gabriel', 30],['mickey', 60]]
        obs - A principio tem que ser no formato aceito pelo google charts, json ainda em construção.
    charts: lista de graficos a ser apresentado
    filter: lista de filtros para o dashboard
        type: NumberRangeFilter / StringFilter / CategoryFilter / DateRangeFilter 
    cards: lista de cards para apresentar os KPI's
        type: total / percent / total-perecent/ percent-total