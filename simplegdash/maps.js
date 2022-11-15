import { addChartGrid } from "./addStyles.js"
import { createView } from "./data.js"

export function createMap(chart, data){
    let coordenadas = getCoordenadas(data, chart.columns)
    let container = document.getElementById('container-charts')
    let charts = document.getElementsByClassName('charts')
    let chart_div = document.createElement("div")
    let div_map = document.createElement("div")
    chart_div.classList.add('charts')
    let divId = 'chart_'+charts.length
    addChartGrid(chart_div, chart.grid)
    chart_div.id = divId 
    div_map.id = 'map'
    chart_div.appendChild(div_map)
    container.appendChild(chart_div)
    let map = L.map('map').setView([chart.coordIni.lat, chart.coordIni.lng], 6.81);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    plotMarkes(coordenadas, map, L, data, chart.columns)

}

function getCoordenadas(data, columns){
    let lat = [] 
    let lng = []
    let view = createView(data)
    let n_rows = view.getNumberOfRows()

    for(let row=0; row < n_rows; row++){
        lat.push(view.getValue(row, columns.lat))
        lng.push(view.getValue(row, columns.lng))
    }
    return {lat, lng}
}

function plotMarkes(coordenadas, map, L, data, columns){
    saveStateMap({lat:null, lng:null})
    for(let i=0; i< coordenadas.lat.length; i++){
        L.marker([coordenadas.lat[i], coordenadas.lng[i]]).addTo(map).on('click', (e) => {saveStateMap(e.latlng), filterByCoordenadas(data, e.latlng, columns)});;
    }
}

import { Gdata, GlistFilters } from "./dash.js"
import { updateCards } from "./cards.js"
function filterByCoordenadas(data, coordenadas, columns){
    let filter = GlistFilters[0]
    let view = createView(Gdata)
    let rows
    let row = view.getFilteredRows([{column:columns.lat,value:coordenadas.lat},{column:columns.lng,value:coordenadas.lng}])[0]
    let value = view.getValue(row,filter.m.filterColumnIndex)
    let state = filter.getState()
    if((state.lowValue === value)&&(state.highValue === value)){
        let newview = createView(Gdata)
        rows = newview.getFilteredRows([{column:filter.m.filterColumnIndex}])
        let range = newview.getColumnRange(filter.m.filterColumnIndex)
        filter.setState({lowValue:range.lowValue ,highValue:range.highValue})
    }else{
        filter.setState({lowValue:value ,highValue:value})
        rows = [row]
    }
    filter.draw()
    updateCards(rows)

}

export function saveStateMap(coordenadas){
    sessionStorage.setItem('map_state',JSON.stringify(coordenadas))
}

export function getStateMap(){
    return JSON.parse(sessionStorage.getItem('map_state'))
}