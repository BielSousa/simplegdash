import { createDash } from "./dash.js";

export function initializeDash(data_dash){
    google.charts.load('current', {'packages':['corechart','table', 'controls']});
    google.charts.setOnLoadCallback(() =>{createDash(data_dash)});
}