export function createCards(column, subtitle, data){
    var container = document.getElementById('container-cards')
    var card = document.createElement("div")
    card.classList.add('card')
    card.setAttribute('column',column)
    var h1 = document.createElement('H1')
    var span = document.createElement('span')
    var view = createView(data)
    h1.innerText = initialize_card(column, view)
    span.innerText = subtitle
    card.appendChild(h1)
    card.appendChild(span)
    container.appendChild(card)
}

function sum(dados){
    var sum = 0
    for(var i in dados){
        sum = sum + dados[i]
    }
    return sum
}

function initialize_card(col, view){
    var rows = view.getNumberOfRows()
    var values = []
    for(var row=0; row<rows; row++){
        values.push(view.getValue(row, col))
    }
    return sum(values)
}

import { saveFilterState, getStateFilters } from "./filters.js"
import { createView } from "./data.js"
import { get_state_map, save_state_map } from "./maps.js"

export function changeCards(data, filter=null, state_map=null){
    if(filter){
        saveFilterState(filter)
    }
    var states = getStateFilters(filter)
    var rows = []
    for(var i in states){
        var view = createView(data)
        if(states[i].type_filter == 'number'){
            var rows_filter = view.getFilteredRows([{
                    column:Number(states[i].states.column),
                    minValue: Number(states[i].states.minValue), 
                    maxValue: Number(states[i].states.maxValue)}])
            rows.push(
                rows_filter
            )
        }else if(states[i].type_filter == 'category'){
            var rows_filter =view.getFilteredRows([{
                    column:Number(states[i].states.column),
                    test: function (value, row, column, table) {
                    return (states[i].states.selectedValues.split(',').indexOf(table.getValue(row, column)) > -1)
                    }}])
            rows.push(
                rows_filter
            )
        }else if((states[i].type_filter == 'string')&&(states[i].states.selectedValues)){

            var new_view = createView(data)
            var col = Number(states[i].states.column)
            var rows_string = new_view.getFilteredRows([{column:Number(states[i].states.column)}])
            var values = []
            for(var j in rows_string){
                var r = rows_string[j]
                values.push(view.getValue(rows_string[j], col))
            
            }
            var sel_v = states[i].states.selectedValues
            const startsS = values.filter((value) => value.toLowerCase().startsWith(sel_v));
            var rows_filter =view.getFilteredRows([{
                    column:Number(states[i].states.column),
                    test: function (value, row, column, table) {
                    return (startsS.indexOf(table.getValue(row, column)) > -1)
                    }}])
            rows.push(
                rows_filter
            )
        }
    }
    if(state_map){
            var saved_state = get_state_map()
            if((state_map.coordenadas.lat == saved_state.lat)&&(state_map.coordenadas.lng == saved_state.lng)){
                var view_map = createView(data)
                var rows_filter =view_map.getFilteredRows([{column:Number(state_map.columns[0].lat)}])
                rows.push(rows_filter)
                save_state_map({lat:null,lng:null})
            }else{
                var view_map = createView(data)
                var rows_filter =view_map.getFilteredRows([{
                        column:Number(state_map.columns[0].lat),
                        value:state_map.coordenadas.lat
                    },{
                        column:Number(state_map.columns[0].lng),
                        value:state_map.coordenadas.lng
                    }])
                rows.push(rows_filter)
                save_state_map(state_map.coordenadas)
            }
        }
    

    var intersection = null
    
    for(var i=1; i < rows.length; i++){
        if(rows[i].length > 0){
            intersection = rows[0].filter(x => rows[i].includes(x))
        }
    }
    view.setRows(intersection)

    if(state_map){
        change_dash(state_map.f, data, intersection)
    }


    var cards = document.getElementsByClassName('card')
    for(var i = 0; i < cards.length; i += 1){
        var col = cards[i]
        var h1 = cards[i].getElementsByTagName('h1')[0]
         h1.innerText = initialize_card(Number(col.getAttribute('column')), view)
    }

}

function change_dash(f, data, row){
    var view = createView(data)
    for(var i in f){   
        i = Number(i) + 2
        console.log(i)
        if(f[i].getType() == 'NumberRangeFilter'){
            var value = view.getValue(row[0], f[i].getOption('filterColumnIndex'))
            f[i].setState({lowValue:value, highValue:value})
            f[i].draw()
            break
        }else if(f[i].getType() == 'CategoryFilter'){
            var atual_state = f[i].getState()
            var value
            if(row.length == 1){
                value = view.getValue(row[0], f[i].getOption('filterColumnIndex'))
            }else{
                value =null
            }

            console.log(atual_state.selectedValues[0], value)
            if((atual_state.selectedValues[0] != value)){
                f[i].setState({selectedValues:[value]})
                f[i].draw()
            }else{
                f[i].setState({selectedValues:[]})
                f[i].draw()
            }
            break
        }
    }

}