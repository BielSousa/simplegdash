import { gdata } from "./data.js";
import { addStyles } from "./addStyles.js";

export function createFilters(filters, data){
    let listFilters = []
    let new_data = gdata(data)
    let filter_index =   {
            type:'NumberRangeFilter',
            options:{
              'filterColumnIndex': 0,
              'ui':{'labelStacking':'vertical'}
            }
        }
    filters.splice(0,0, filter_index)
    for(var i in filters){
        let filter
        let state
        if(filters[i].type === 'NumberRangeFilter'){
            let range = new_data.getColumnRange(filters[i].options.filterColumnIndex)
            state = {'lowValue': range.min, 'highValue': range.max}
        }else if(filters[i].type === 'CategoryFilter'){
            let value = []
            state = value
        }else if(filters[i].type === 'DateRangeFilter'){
            filter={divId:getFilterId(), state:{}}
            filter.getState = function(){
                return filter.state
            }
            filter.getContainerId = function(){
                return filter.divId
            }
            filter.filterColumnIndex = filters[i].options.filterColumnIndex
            let range = new_data.getColumnRange(filter.filterColumnIndex)
            let label = new_data.getColumnLabel(filter.filterColumnIndex)
            createDateFilter(range, filter, label)
        }else if(filters[i].type === 'StringFilter'){
            state
        }
        
        filter = new google.visualization.ControlWrapper({
            'controlType': filters[i].type,
            'containerId': ((filters[i].type === 'DateRangeFilter')||(filters[i].options.filterColumnIndex === 0) ? getFilterId('none') : getFilterId()),
            'options':filters[i].options,
            'state': state
            })
            listFilters.push(filter)
            google.visualization.events.addListener(filter, 'statechange', (filter)=>{saveFilterState(filter), updateFilterState(filter)});
        addStyles(filter)
        saveFilterState(filter)
    }
    return listFilters
}

function fomartDateInput(date){
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day
}

function fomartDateFilter(date){
     date = new Date(date)
    return date
}

   

function createDateFilter(range, filter, label){
    let container_filter = document.getElementById(filter.divId)
    let div_filter = document.createElement('div')
    filter.su = {ui:{cssClass:'filter-date'}}
    div_filter.classList ='filter-date'
    let title = document.createElement('label')
    let limite = document.createElement('label')
    let div_inputs = document.createElement('div')
        let div_start = document.createElement('div')
            let start_title = document.createElement('span')
            let date_start =  document.createElement('input')
            div_start.appendChild(start_title)
            div_start.appendChild(date_start)

        let div_end = document.createElement('div')
            let end_title = document.createElement('span')
            let date_end = document.createElement('input')
            div_end.appendChild(end_title)
            div_end.appendChild(date_end)
        div_inputs.appendChild(div_start)
        div_inputs.appendChild(div_end)
    div_filter.appendChild(title)
    div_filter.appendChild(div_inputs)
    div_filter.appendChild(limite)
    container_filter.appendChild(div_filter)
    title.innerText = label
    date_start.type = 'date'
    date_start.name = 'start'
    start_title.innerText = 'Data Inicial'
    title.style = 'width:100%; text-align:center'
    div_inputs.style = 'display: flex ; flex-direction: row; justify-content:space-around'
    div_start.style = 'display: flex ; flex-direction: column; width:40% ; text-align:center'
    div_end.style = 'display: flex ; flex-direction: column; width:40%;  text-align:center'
    end_title.innerText = 'Data Final'
    date_start.value =  fomartDateInput(new Date(range.min))
    date_end.type = 'date'
    date_end.name = 'end'
    date_end.value = fomartDateInput(new Date(range.max))
    limite.innerText = "[min:".concat(String(date_start.value) + '\xa0'.repeat(5)).concat("max:").concat(date_end.value).concat("]")
    limite.style = 'text-align:center; font-size:14px; display: block; padding:10px;margin-top:5px; color: #999; background-color:#eee'
    filter.state = {lowValue:date_start.value, highValue:date_end.value}
    date_start.addEventListener('change', (e)=>{updateDateFilter(filter, e.target.value, e.target.name), saveFilterState(filter), updateFilterState(filter)});
    date_end.addEventListener('change', (e)=>{updateDateFilter(filter, e.target.value, e.target.name), saveFilterState(filter), updateFilterState(filter)});
}

function updateDateFilter(filter, value, name){
    if(name === 'start'){
        filter.state.lowValue = value
    } else{
        filter.state.highValue = value
    }
}

function getFilterId(none){
    const container = document.getElementById('container-filters')
    const filters = container.children
    const new_filter = document.createElement("div")
    if(none === 'none'){
        new_filter.style = 'display:none'
    }
    let div_id = 'filter_' + filters.length
    new_filter.id = div_id 
    container.appendChild(new_filter)
    return div_id
}

function saveFilterState(filter){
    if(filter.container){
        sessionStorage.setItem(filter.container.id, JSON.stringify(filter.getState()))
    }else{
        sessionStorage.setItem(filter.getContainerId(), JSON.stringify(filter.getState()))
    }
}


function getStateFilter(filter){
    return JSON.parse(sessionStorage.getItem(filter.getContainerId()))
}

import { GlistFilters } from "./dash.js";
export function updateFiltersState(){
    for(let i in GlistFilters){
        let state = getStateFilter(GlistFilters[i])
        GlistFilters[i].setState(state)
    }
}

import { updateCards } from "./cards.js";
export function updateFilterState(filter){
    let rows = columnFilteredByFilter(filter)
    updateCards(rows)
}

import { Gdata } from "./dash.js";
import { createView } from "./data.js";
function columnFilteredByFilter(filter){
    let view = createView(Gdata)
    if(filter.su.ui.cssClass === 'filter-number'){
        return view.getFilteredRows([{column:filter.su.filterColumnIndex, minValue:filter.K.lowValue, maxValue:filter.K.highValue}])
    }else if(filter.su.ui.cssClass === 'filter-category'){
         return view.getFilteredRows([{
                    column:filter.su.filterColumnIndex,
                    test: function (value, row, column, table) {
                    return (filter.K.selectedValues.indexOf(table.getValue(row, column)) > -1)
                    }}])
    }else if(filter.su.ui.cssClass === 'filter-date'){
        let f_date = GlistFilters[Number(String(filter.divId).replace('filter_',''))]
        let column = filter.filterColumnIndex
        let min = fomartDateFilter(filter.state.lowValue)
        let max= fomartDateFilter(filter.state.highValue)
        f_date.setState({lowValue:min, highValue:max})
        console.log(f_date)
        f_date.draw()
        return view.getFilteredRows([{column:column, minValue:min, maxValue:max}])
    }else if(filter.su.ui.cssClass === 'filter-string'){
        var new_view = createView(Gdata)
        var rows_string = new_view.getFilteredRows([{column:Number(filter.su.filterColumnIndex)}])
        var values = []
        for(var j in rows_string){
            values.push(view.getValue(rows_string[j], Number(filter.su.filterColumnIndex)))
        }
        const startsS = values.filter((value) => value.toLowerCase().startsWith(filter.K.value));
        return view.getFilteredRows([{
                column:filter.su.filterColumnIndex,
                test: function (value, row, column, table) {
                return (startsS.indexOf(table.getValue(row, column)) > -1)
                }}])
    }


}