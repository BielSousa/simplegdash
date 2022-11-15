import { gdata } from "./data.js";
import { Gdata } from "./dash.js";
import { updateCards } from "./cards.js";


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

export function createFilters(filters){
    let listFilters = []
    let new_data = gdata(Gdata)
    let creaters = {
        'Range':function(new_data, filter, label){return createRangeFilter(new_data, filter, label)},
        'Date':function(new_data, filter, label){return createDateFilter(new_data, filter, label)},
        'String':function(new_data, filter, label){return createStringFilter(new_data, filter, label)},
        'Category':function(new_data, filter, label){return createCategoryFilter(new_data, filter, label)},
    }
    listFilters = [...filters].map(filter => {    
        let label = new_data.getColumnLabel(filter.column).toUpperCase().replace('_',' ')
        filter.divId = getFilterId()
        filter.getState = function(){
                return filter.state
            }
        filter.getContainerId = function(){
                return filter.divId
            }

        let created = creaters[filter.type](new_data, filter, label)
        return created
    });

    return listFilters
}

function createRangeFilter(new_data, filter, label){ 
    let range = new_data.getColumnRange(filter.column)
    filter.cssClass = 'filter-number'
    filter.state = {min:range.min, max:range.max}
    saveFilterState(filter)

    let container_filter = document.getElementById(filter.divId)
    let title = document.createElement('label')
    title.innerText = label
    let div_filter = document.createElement('div')
    div_filter.classList =filter.cssClass

    let divNumber = document.createElement('div')
    divNumber.classList = 'number-container'
    let divSlider = document.createElement('div')
    let sliderTrack = document.createElement('div')
    divSlider.classList = 'slider-container'
    sliderTrack.classList = 'track'
    let limite = document.createElement('label')
    limite.style = 'text-align:center; font-size:14px; display: block; padding: 10px 0px;margin-top:5px; color: #999; background-color:#eee'
    limite.innerText = "[min:".concat(String(range.min) + '\xa0'.repeat(3)).concat("max:").concat(range.max).concat("]")

    divSlider.appendChild(sliderTrack)
    div_filter.appendChild(title)
    div_filter.appendChild(divNumber)
    div_filter.appendChild(divSlider)
    div_filter.appendChild(limite)
    container_filter.appendChild(div_filter)

    let inputNumberMin = document.createElement('input')
    let inputNumberMax = document.createElement('input')
    inputNumberMin.style = 'width: 100px'
    inputNumberMax.style = 'width: 100px'
    divNumber.appendChild(inputNumberMin)
    divNumber.appendChild(inputNumberMax)

    let inputSliderMin = document.createElement('input')
    let inputSliderMax = document.createElement('input')
    divSlider.appendChild(inputSliderMin)
    divSlider.appendChild(inputSliderMax)

    inputSliderMin.type = 'range'
    inputSliderMin.name = 'rangeMin'
    inputSliderMin.divId = filter.divId
    inputSliderMin.min = range.min
    inputSliderMin.value = range.min
    inputSliderMin.max = range.max
    inputNumberMin.value = range.min

    inputSliderMax.type = 'range'
    inputSliderMax.name = 'rangeMax'
    inputSliderMax.min = range.min
    inputSliderMax.max = range.max
    inputSliderMax.value = range.max
    inputNumberMax.value = range.max

    inputSliderMin.addEventListener('input',(e)=>{
       let track = document.getElementById(filter.divId).firstChild.children[2].children[0]
        let numberMin = document.getElementById(filter.divId).firstChild.children[1].children[0]
        let minGap = 0
        let sliderMin = document.getElementById(filter.divId).firstChild.children[2].children[1]
        let sliderMax = document.getElementById(filter.divId).firstChild.children[2].children[2] 
        if(Number(sliderMax.value) - Number(sliderMin.value) <= minGap){
            sliderMin.value = Number(sliderMax.value) - minGap
        }
        sliderTrackFill(track, sliderMin, sliderMax)
        numberMin.value = sliderMin.value
        filter.state = {min: sliderMin.value, max: sliderMax.value}
        saveFilterState(filter)
    })    
    inputSliderMax.addEventListener('input',(e)=>{
       let track = document.getElementById(filter.divId).firstChild.children[2].children[0]
        let numberMax = document.getElementById(filter.divId).firstChild.children[1].children[1]
        let minGap = 0
        let sliderMin = document.getElementById(filter.divId).firstChild.children[2].children[1]
        let sliderMax = document.getElementById(filter.divId).firstChild.children[2].children[2] 
        if(Number(sliderMax.value) - Number(sliderMin.value) <= minGap){
            sliderMax.value = Number(sliderMin.value) + minGap
        }
        sliderTrackFill(track, sliderMin, sliderMax)
        numberMax.value = sliderMax.value
        filter.state = {min: sliderMin.value, max: sliderMax.value}
        saveFilterState(filter)
    })        
    inputNumberMin.addEventListener('change',(e)=>{
       let track = document.getElementById(filter.divId).firstChild.children[2].children[0]
       let numberMin = document.getElementById(filter.divId).firstChild.children[1].children[0]
        let minGap = 0
        let sliderMin = document.getElementById(filter.divId).firstChild.children[2].children[1]
        let sliderMax = document.getElementById(filter.divId).firstChild.children[2].children[2] 
        if(Number(sliderMax.value) - Number(numberMin.value) <= minGap){
            numberMin.value = Number(sliderMax.value) - minGap
        }
        sliderTrackFill(track, sliderMin, sliderMax)
        sliderMin.value = numberMin.value
        filter.state = {min: sliderMin.value, max: sliderMax.value}
        saveFilterState(filter)
    })      
    inputNumberMax.addEventListener('change',()=>{
       let track = document.getElementById(filter.divId).firstChild.children[2].children[0]
        let numberMax = document.getElementById(filter.divId).firstChild.children[1].children[1]
        let minGap = 0
        let sliderMin = document.getElementById(filter.divId).firstChild.children[2].children[1]
        let sliderMax = document.getElementById(filter.divId).firstChild.children[2].children[2] 
        if(Number(numberMax.value) - Number(sliderMin.value) <= minGap){
            numberMax.value = Number(sliderMin.value) + minGap
        }
        sliderMax.value = numberMax.value
        sliderTrackFill(track, sliderMin, sliderMax)
        filter.state = {min: sliderMin.value, max: sliderMax.value}
        saveFilterState(filter)
    })
    return filter    

    function sliderTrackFill(track, sliderMin, sliderMax){
        let max = sliderMax.max - sliderMax.min
        let percent1 = ((sliderMin.value-sliderMin.min)/max)*100
        let percent2 = (1-((sliderMax.max-sliderMax.value)/max))*100
        track.style.background = `linear-gradient(to right , #dadad5 ${percent1}%, #3264f3 ${percent1}%, #3264f3 ${percent2}%, #dadad5 ${percent2}%)`
    }
}


function createDateFilter(new_data, filter, label){
    let range = new_data.getColumnRange(filter.column)
    filter.state = {min:fomartDateInput(new Date(range.min)), max:fomartDateInput(new Date(range.max))}
    saveFilterState(filter)
    filter.cssClass = 'filter-date'

    let container_filter = document.getElementById(filter.divId)
    let div_filter = document.createElement('div')
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
    title.style = 'width:100%; text-align:center;display:block'
    
    div_inputs.style = 'display: flex ; flex-direction: row; justify-content:space-around'
    date_start.type = 'date'
    date_start.name = 'start'
    start_title.innerText = 'Data Inicial'
    div_start.style = 'display: flex ; flex-direction: column; width:40% ; text-align:center'
    div_end.style = 'display: flex ; flex-direction: column; width:40%;  text-align:center'
    date_start.min =  fomartDateInput(new Date(range.min))
    date_start.value =  fomartDateInput(new Date(range.min))
    date_start.max =  fomartDateInput(new Date(range.max))
    
    end_title.innerText = 'Data Final'
    date_end.type = 'date'
    date_end.name = 'end'
    date_end.min = fomartDateInput(new Date(range.min))
    date_end.value = fomartDateInput(new Date(range.max))
    date_end.max = fomartDateInput(new Date(range.max))
    limite.innerText = "[min:".concat(String(date_start.value) + '\xa0'.repeat(5)).concat("max:").concat(date_end.value).concat("]")
    limite.style = 'text-align:center; font-size:14px; display: block; padding: 10px 0px;margin-top:5px; color: #999; background-color:#eee'
    
    date_start.addEventListener('change', (e)=>{updateDateFilter(filter), saveFilterState(filter)});
    date_end.addEventListener('change', (e)=>{updateDateFilter(filter), saveFilterState(filter)});

    return filter
    
    function fomartDateInput(date){
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return year + "-" + month + "-" + day
    }
}


function createCategoryFilter(new_data, filter, label){
    let values = ['---',...new_data.getDistinctValues(Number(filter.column))]
    filter.state = {values:[]}
    saveFilterState(filter)
  
    filter.cssClass = 'filter-category'
    
    let container_filter = document.getElementById(filter.divId)
    container_filter.classList = filter.cssClass
    let title = document.createElement('label')
    title.innerText = label
    container_filter.appendChild(title)
    let select = document.createElement('select') 
    let ul = document.createElement('ul') 
    container_filter.appendChild(select)
    container_filter.appendChild(ul)
    values.forEach(value => {
        let option = document.createElement('option')
        option.value = value
        option.innerText = value
        select.appendChild(option)
    })
    let values_li = []
    select.addEventListener('input', (e)=>{
        let qtd_li = [...ul.children]
        if(!(e.target.value === '---')&&(qtd_li.length<values.length - 1)&&!(values_li.includes(e.target.value))){
            values_li.push(e.target.value)
            let div_li = document.createElement('div')
            div_li.style = 'display:flex; flex-direction:row;justify-content:center;align-content:center'
            let span = document.createElement('span')
            span.innerText = 'X'
            let li = document.createElement('li')
            div_li.appendChild(span)
            div_li.appendChild(li)
            li.innerText = e.target.value
            ul.appendChild(div_li)
            span.addEventListener('click', e =>{
                e.target.parentNode.remove()
                let index = values_li.indexOf(e.target.parentNode.lastChild.innerText)
                if(index > -1){values_li.splice(index,1)}
                filter.state.values = values_li
                saveFilterState(filter)
            })
            filter.state.values = values_li
            saveFilterState(filter)
        }
    })
    return filter
}

function createStringFilter(new_data, filter, label){
    filter.state = {values:[]}
    saveFilterState(filter)
    filter.cssClass = 'filter-string'

    let container_filter = document.getElementById(filter.divId)
    container_filter.classList = filter.cssClass
    let title = document.createElement('label')
    title.innerText = label
    container_filter.appendChild(title)
    let input = document.createElement('input')
    input.type ='text'
    container_filter.appendChild(input)

    input.addEventListener('input',(e)=>{
        var values = new_data.getDistinctValues(Number(filter.column))
        filter.state.values = values.filter((value) => value.toLowerCase().startsWith(e.target.value))
        saveFilterState(filter)
    })
    return filter
}



function updateDateFilter(filter){
    let container = document.getElementById(filter.divId)
    let max = container.children[0].children[1].children[1].children[1]
    let min = container.children[0].children[1].children[0].children[1]
    if(min.value <= max.value){
        filter.state = {min:min.value,max:max.value}
        saveFilterState(filter)
    }else{
       let state = getStateFilter(filter)
        min.value = state.min
        max.value = state.max
        alert('A data inicial não pode ser maior que a data final')
    }
}

function getStateFilter(filter){
    return JSON.parse(sessionStorage.getItem(filter.divId))
}

function fomartDateFilter(date){
    date = new Date(date)
    date = new Date(date.setHours(0))
    date = new Date(date.setDate(date.getDate()+1))
    return date
}

function saveFilterState(filter){
    sessionStorage.setItem(filter.divId, JSON.stringify(filter.getState()))
    let dados = gdata(Gdata)
    let rows = []
    if(['Range','Date'].includes(filter.type)){
        let min = (filter.type === 'Date'?fomartDateFilter(filter.state.min):filter.state.min)
        let max = (filter.type === 'Date'?fomartDateFilter(filter.state.max):filter.state.max)
        rows = dados.getFilteredRows([{column:filter.column, minValue:min, maxValue:max}])
    }else if(['String', 'Category'].includes(filter.type)){
         rows =  dados.getFilteredRows([{
                    column:filter.column,
                    test: function (value, row, column, table) {
                    return (filter.state.values.indexOf(table.getValue(row, column)) > -1)
                    }}])
    }
    console.log(rows, filter)
    updateCards(rows)
}


