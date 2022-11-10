import { add_chart_grid } from "./addStyles.js"
import { createView } from "./data.js"
export function createMap(columns,grid, data, f){

    var coordenadas = get_coordenadas(data, columns)
    var container = document.getElementById('container-charts')
    var charts = container.getElementsByTagName('div')
    var chart = document.createElement("div")
    var map = document.createElement("div")
    chart.classList.add('charts')
    var divId = 'chart_'+charts.length
    add_chart_grid(chart, grid)
    chart.id = divId 
    map.id = 'map'
    chart.appendChild(map)
    container.appendChild(chart)
    var map = L.map('map').setView([-20.0141197, -41.3936926], 6.81);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    plot_marker(coordenadas, map, L, data, columns, f)

}

function get_coordenadas(data, columns){
    var lat = [] 
    var lng = []
    var view = createView(data)
    var n_rows = view.getNumberOfRows()

    for(var row=0; row < n_rows; row++){
        lat.push(view.getValue(row, columns[0].lat))
        lng.push(view.getValue(row, columns[0].lng))
    }
    return {lat, lng}
}

function plot_marker(coordenadas, map, L, data, columns, f){
    save_state_map({lat:null, lng:null})
    for(var i=0; i< coordenadas.lat.length; i++){
        L.marker([coordenadas.lat[i], coordenadas.lng[i]]).addTo(map).on('click', (e) => {filter_dash(data, e.latlng, columns, f)});;
    }
}

import { changeCards } from "./cards.js"

function filter_dash(data, coordenadas, columns, f){
    var state_map = {columns, coordenadas, f}
    changeCards(data, null, state_map=state_map)
}

export function save_state_map(coordenadas){
    sessionStorage.setItem('map_state',JSON.stringify(coordenadas))
}
export function get_state_map(){
    return JSON.parse(sessionStorage.getItem('map_state'))
}