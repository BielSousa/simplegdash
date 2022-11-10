import { changeCards } from "./cards.js";
import { gdata } from "./data.js";

export function createFilters(type, options=null, data=null){
    var newData = gdata(data)
    var range = newData.getColumnRange(options.filterColumnIndex)
    var state_number = {'lowValue': range.min, 'highValue': range.max}
    var state_category = {'value':null}
    var state = null    
    if(type == 'NumberRangeFilter'){
        state = state_number
    }else{
        state = state_category
    }

    var container = document.getElementById('container-filters')
    var filters = container.getElementsByTagName('div')
    var filter = document.createElement("div")
    var divId = 'filter_'+filters.length
    filter.id = divId 
    container.appendChild(filter)

    var filter = new google.visualization.ControlWrapper({
          'controlType': type,
          'containerId': divId,
          'options':options,
          'state': state
        });
    saveFilterState(filter)
    google.visualization.events.addListener(filter, 'statechange', ()=>{changeCards(data, filter)});
    return filter
}

export function saveFilterState(filter){
    var state = null
    if(filter.getType() == 'NumberRangeFilter'){
        state = filter.getState()
        sessionStorage.setItem(filter.getContainerId() + '_column', filter.getOption('filterColumnIndex'))
        sessionStorage.setItem(filter.getContainerId() + '_min', state.lowValue)
        sessionStorage.setItem(filter.getContainerId() + '_max', state.highValue)
    }else if(filter.getType() == 'CategoryFilter'){
        state = filter.getState()
        sessionStorage.setItem(filter.getContainerId() + '_column', filter.getOption('filterColumnIndex'))
        sessionStorage.setItem(filter.getContainerId() + '_selectedValues', state.selectedValues)

    }else if(filter.getType() == 'StringFilter'){
        state = filter.getState()
        sessionStorage.setItem(filter.getContainerId() + '_column', filter.getOption('filterColumnIndex'))
        sessionStorage.setItem(filter.getContainerId() + '_selectedValues', state.value)
    }
}

export function getStateFilters(){
    var containerFilters = document.getElementById('container-filters').children
    var state = []
    for(var i in containerFilters){
        if(containerFilters[i].id){
            if(containerFilters[i].firstChild.classList[0] == 'filter-number'){
                state.push({
                type_filter:'number',
                states:{column:sessionStorage.getItem(containerFilters[i].id + '_column'),
                    minValue:sessionStorage.getItem(containerFilters[i].id + '_min'),
                    maxValue:sessionStorage.getItem(containerFilters[i].id + '_max')}
                })
            }else if(containerFilters[i].firstChild.classList[0]  == 'filter-category'){
                state.push({
                type_filter:'category',
                states:{
                    column:sessionStorage.getItem(containerFilters[i].id + '_column'),
                    selectedValues:sessionStorage.getItem(containerFilters[i].id + '_selectedValues'),
                }
                })
            } else if(containerFilters[i].firstChild.classList[0]  == 'filter-string'){
                state.push({
                type_filter:'string',
                states:{
                    column:sessionStorage.getItem(containerFilters[i].id + '_column'),
                    selectedValues:sessionStorage.getItem(containerFilters[i].id + '_selectedValues'),
                }
                })
            } 
        }
    }
    return state
}