import { Gdata } from "./dash.js"
import { gdata } from "./data.js"
import { GlistFilters } from "./dash.js"

class cardClass {
    constructor(dados, card){
        this._dados = dados
        this._type = card.type
        this._subtitle = card.subtitle
        this._cssClass = 'card-' + card.type
        this._calc = card.calc
        this._calc_dividend = card.calc_dividend
        this._calc_divisor = card.calc_divisor
        this._divId = null
        this._divCard = null
        this._column = card.column
        this._column_dividend = card.column_dividend
        this._column_divisor = card.column_divisor

        this._creaters = {
            'total':function(card){createTotal(card)},
            'total-percent':function(card){createTotalPercent(card)},
            'percent':function(card){createPercent(card)},
            'percent-total':function(card){createPercentTotal(card)},
        }

        this._calcs ={
            'sum':function(dados){    
                let sum = 0
                dados.forEach((v)=>{sum = sum + v})
                return sum
            },'count':function(dados){
                return dados.length
            }, 'avg':{
            }, 'distinct-count':{
            }
        }

    }

    get type(){return this._type}
    get subtitle(){return this._subtitle}
    get cssClass(){return this._cssClass}
    get divCard(){return this._divCard}

    init(){
        this._setDivId()
        this._creaters[this._type](this)
        this.update()
    }

    _setDivId(){
        const container = document.getElementById('container-cards')
        const cards = container.children
        const new_card = document.createElement("div")
        new_card.id = `card_${cards.length}` 
        new_card.classList = this._cssClass
        container.appendChild(new_card)
        this._divId = new_card.id
        this._divCard = new_card
    }
    get divId(){return this._divId}

    update(rows){
    let types = this._type.split("-")
    if(types.length === 1){
        let h1 = this._divCard.getElementsByTagName('H1')
        let value = this._getCardValue(rows)
        if(Object.keys(value)[0] === 'percent'){
            h1[0].innerText = value.percent + '%'
        }else{
            h1[0].innerText = value.total
        }
    }else{
        if(types[0] === 'total'){
            let h1 = this._divCard.getElementsByTagName('H1')
            let h3 = this._divCard.getElementsByTagName('H3')
            let value = this._getCardValue(rows)
            h1[0].innerText= value.total
            h3[0].innerText= '/' + value.percent + '%'
        }else{
            let h1 = this._divCard.getElementsByTagName('H1')
            let h3 = this._divCard.getElementsByTagName('H3')
            let value = this._getCardValue(rows)
            h1[0].innerText= value.percent + '%  '
            h3[0].innerText= '/'+ value.total 
        }
    }


    }

    _getCardValue(rows){
        if(!rows){rows = [...Array(this._dados.getNumberOfRows()).keys()]}
        let types = this._type.split("-")
        let response = {}
        for(let i in types){
            if(types[i] === 'total'){
                response.total = this._calcs[this._calc]([...rows].map((row)=>{return this._dados.getValue(Number(row),Number(this._column))}))
            } else if(types[i] === 'percent'){
                var dividend_values = [...rows].map((row)=>{return this._dados.getValue(Number(row),Number(this._column_dividend))})
                var divisor_values = [...rows].map((row)=>{return this._dados.getValue(Number(row),Number(this._column_divisor))})
                if(divisor_values.length > 0){
                    response.percent = ((this._calcs[this._calc_dividend](dividend_values) / this._calcs[this._calc_divisor](divisor_values))*100).toFixed(1)
                }else{
                    response.percent = 0  
                }
            }
        }
        return response
    }
}


function inicializeCard(dados, filter){
    filter = new cardClass(dados, filter)
    filter.init()
    return filter
}


export function createCards(cards){
    let dados = gdata(Gdata)
    cards.forEach(card => {
        if(Object.keys(card).length > 0 ){card = inicializeCard(dados, card)}
        
        GlistFilters.forEach( filter =>{
            if(Object.keys(card).length > 0 ){
            filter.observer = card
            }
        })         
    });
}

function createTotal(card){
    let h1 = document.createElement('H1')
    let span = document.createElement('span')
    span.innerText = card.subtitle
    card.divCard.appendChild(h1)
    card.divCard.appendChild(span)
        
}

function createPercent(card){
    let h1 = document.createElement('H1')
    let span = document.createElement('span')
    span.innerText = card.subtitle
    card.divCard.appendChild(h1)
    card.divCard.appendChild(span)
}

function createTotalPercent(card){
    let span_number = document.createElement('span')
    let h1 = document.createElement('H1')
    let h3 = document.createElement('H3')
    let span_subtitle = document.createElement('span')
    span_subtitle.innerText = card.subtitle
    span_number.appendChild(h1)
    span_number.appendChild(h3)
    card.divCard.appendChild(span_number)
    card.divCard.appendChild(span_subtitle)
}

function createPercentTotal(card){
    let span_number = document.createElement('span')
    let h1 = document.createElement('H1')
    let h3 = document.createElement('H3')
    let span_subtitle = document.createElement('span')
    span_subtitle.innerText = card.subtitle
    span_number.appendChild(h1)
    span_number.appendChild(h3)
    card.divCard.appendChild(span_number)
    card.divCard.appendChild(span_subtitle)
}