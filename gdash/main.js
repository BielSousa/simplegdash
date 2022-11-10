import { createDash } from "./dash.js";

export function initialize(data, charts, filters, cards){
    google.charts.load('current', {'packages':['corechart','table', 'controls']});
    google.charts.setOnLoadCallback(() =>{createDash(data, charts, filters, cards)});
}


window.initialize = initialize