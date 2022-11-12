import { gdata } from "./data.js";
import { addStyles } from "./addStyles.js";

export function createFilters(filters, data){
    let listFilters = []
    let filter
    let new_data = gdata(data)

    for(var i in filters){
        let state
        if(filters[i].type === 'NumberRangeFilter'){
            let range = new_data.getColumnRange(filters[i].options.filterColumnIndex)
            state = {'lowValue': range.min, 'highValue': range.max}
        }else if(filters[i].type === 'CategoryFilter'){
            let value = []
            state = value
        }else if(filters[i].type === 'DateRangeFilter'){
            state
        }else if(filters[i].type === 'StringFilter'){
            state
        }
                
        filter = new google.visualization.ControlWrapper({
            'controlType': filters[i].type,
            'containerId': getFilterId(),
            'options':filters[i].options,
            'state': state
            })
        google.visualization.events.addListener(filter, 'statechange', (filter)=>{saveFilterState(filter), updateFilterState(filter)});
        addStyles(filter)
        listFilters.push(filter)
        saveFilterState(filter)
    }
    sessionStorage.setItem('filters', JSON.stringify(listFilters))
    return listFilters
}

function getFilterId(){
    const container = document.getElementById('container-filters')
    const filters = container.children
    const new_filter = document.createElement("div")
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
function updateFilterState(filter){
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
        console.log('date')
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