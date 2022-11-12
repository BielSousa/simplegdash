import { Gdata } from "./dash.js"
import { createView } from "./data.js"
import { get_state_map, save_state_map } from "./maps.js"

export function createCards(cards, data){
    for(let i in cards){
          createCard(cards[i], data)
    }
    updateCards()
}

function createCard(card){
    let div_card = document.createElement("div")
    let container = document.getElementById('container-cards')
    let values 
    div_card.classList.add('card-' + card.type)
    if(card.type === 'total'){
        div_card.setAttribute('type',card.type)
        div_card.setAttribute('column',card.column)
        let h1 = document.createElement('H1')
        let span = document.createElement('span')
        span.innerText = card.subtitle
        div_card.appendChild(h1)
        div_card.appendChild(span)
        container.appendChild(div_card)
    } else if(card.type === 'percent'){
        div_card.setAttribute('type',card.type)
        div_card.setAttribute('dividend',card.column_dividend)
        div_card.setAttribute('divisor',card.column_divisor )
        let h1 = document.createElement('H1')
        let span = document.createElement('span')
        span.innerText = card.subtitle
        div_card.appendChild(h1)
        div_card.appendChild(span)
        container.appendChild(div_card)
    } else if(card.type === 'total-percent'){
        div_card.setAttribute('type',card.type)
        div_card.setAttribute('column',card.column)
        div_card.setAttribute('dividend',card.column_dividend)
        div_card.setAttribute('divisor',card.column_divisor )
        let span_number = document.createElement('span')
        let h1 = document.createElement('H1')
        let h3 = document.createElement('H3')
        let span_subtitle = document.createElement('span')
        span_subtitle.innerText = card.subtitle
        span_number.appendChild(h1)
        span_number.appendChild(h3)
        div_card.appendChild(span_number)
        div_card.appendChild(span_subtitle)
        container.appendChild(div_card)
    } else if(card.type === 'percent-total'){
        div_card.setAttribute('type',card.type)
        div_card.setAttribute('column',card.column)
        div_card.setAttribute('dividend',card.column_dividend)
        div_card.setAttribute('divisor',card.column_divisor )
        let span_number = document.createElement('span')
        let h1 = document.createElement('H1')
        let h3 = document.createElement('H3')
        let span_subtitle = document.createElement('span')
        span_subtitle.innerText = card.subtitle
        span_number.appendChild(h1)
        span_number.appendChild(h3)
        div_card.appendChild(span_number)
        div_card.appendChild(span_subtitle)
        container.appendChild(div_card)
    } 
}

function sum(dados){
    var sum = 0
    for(var i in dados){
        sum = sum + dados[i]
    }
    return sum
}

function getCardValue(card, rows=null){
    let view = createView(Gdata)  
    if(!rows){
        rows = []
        let n_rows = view.getNumberOfRows()
        for(var row=0; row<n_rows; row++){
            rows.push(row)
        }
    }
    let types = card.type.split("-")
    let values_return = {}
    for(let i in types){
        if(types[i] === 'total'){
            var values = []
            for(var row in rows){
                values.push(view.getValue(Number(row), Number(card.column)))
            }
            values_return.total = sum(values)
        } else if(types[i] === 'percent'){
            var dividend = []
            var divisor = []
            for(var row in rows){
                dividend.push(view.getValue(Number(row), Number(card.column_dividend)))
            }
            for(var row in rows){
                divisor.push(view.getValue(Number(row), Number(card.column_divisor)))
            }
            if(divisor.length > 0){
                values_return.percent = ((sum(dividend) / sum(divisor))*100).toFixed(1).toLocaleString('pt-BR', { style: 'percent'})
            }else{
                values_return.percent = 0
            }
        }
    }
    return values_return
}

export function updateCards(rows){
    let container_cards = document.getElementById('container-cards')
    let cards = container_cards.children
    let card    
    for(let i=0; i < cards.length; i++){
        if(cards[i] !== 'length'){
        card = {
                type:cards[i].getAttribute('type'),
                column:cards[i].getAttribute('column'),
                column_dividend:cards[i].getAttribute('dividend'),
                column_divisor:cards[i].getAttribute('divisor'),
            }
        }
        updateCard(cards[i],card, rows)
    }
}

function updateCard(div_card,card, rows){
     let types = card.type.split("-")
    if(types.length === 1){
        let h1 = div_card.getElementsByTagName('H1')
        let value = getCardValue(card, rows)
        if(Object.keys(value)[0] === 'percent'){
            h1[0].innerText = value.percent + '%'
        }else{
            h1[0].innerText = value.total
        }
    }else{
        if(types[0] === 'total'){
            let h1 = div_card.getElementsByTagName('H1')
            let h3 = div_card.getElementsByTagName('H3')
            let value = getCardValue(card, rows)
            h1[0].innerText= value.total + '/'
            h3[0].innerText= value.percent + '%'
        }else{
            let h1 = div_card.getElementsByTagName('H1')
            let h3 = div_card.getElementsByTagName('H3')
            let value = getCardValue(card, rows)
            h1[0].innerText= value.percent + '%  '
            h3[0].innerText= '/'+ value.total 

        }

    }
}