import { Gdata } from "./dash.js"
import { createView } from "./data.js"

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
    if(['total','percent'].includes(card.type)){
        let h1 = document.createElement('H1')
        let span = document.createElement('span')
        span.innerText = card.subtitle
        div_card.appendChild(h1)
        div_card.appendChild(span)
        container.appendChild(div_card)
    } else if(['total-percent','percent-total'].includes(card.type)){
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
    let keys = Object.keys(card)
    let calc_att = ['calc','calc_dividend','calc_divisor']
    calc_att.forEach((att)=>{if(!keys.includes(att)){card[att] = 'count';keys.push(att)}})
    keys.forEach((key)=>{div_card.setAttribute(key, card[key])})
}


var calc ={
    'sum':function(dados){    
        let sum = 0
        dados.forEach((v)=>{sum = sum + v})
        return sum
    },'count':function(dados){
        return dados.length
    }
}

function getCardValue(card, rows=null){
    let view = createView(Gdata)  
    if(!rows){rows = [...Array(view.getNumberOfRows()).keys()]}
    let types = card.type.split("-")
    let response = {}
    for(let i in types){
        if(types[i] === 'total'){
            response.total = calc[card.calc]([...rows].map((row)=>{return view.getValue(Number(row),Number(card.column))}))
        } else if(types[i] === 'percent'){
            var dividend_values = [...rows].map((row)=>{return view.getValue(Number(row),Number(card.column_dividend))})
            var divisor_values = [...rows].map((row)=>{return view.getValue(Number(row),Number(card.column_divisor))})
            if(divisor_values.length > 0){
                response.percent = ((calc[card.calc_dividend](dividend_values) / calc[card.calc_divisor](divisor_values))*100).toFixed(1)
            }else{
                response.percent = 0  
            }
        }
    }
    return response
}

export function updateCards(rows){
    let container_cards = document.getElementById('container-cards')
    let cards = [...container_cards.children]
    let card ={}
    let att = ['type','column', 'column_dividend','column_divisor', 'calc', 'calc_dividend','calc_divisor']
      cards.forEach((c)=>{
        att.forEach((a)=>{
            card[a] =c.getAttribute(a)
        })
        updateCard(c,card, rows)
    })
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
            h1[0].innerText= value.total
            h3[0].innerText= '/' + value.percent + '%'
        }else{
            let h1 = div_card.getElementsByTagName('H1')
            let h3 = div_card.getElementsByTagName('H3')
            let value = getCardValue(card, rows)
            h1[0].innerText= value.percent + '%  '
            h3[0].innerText= '/'+ value.total 
        }
    }
}