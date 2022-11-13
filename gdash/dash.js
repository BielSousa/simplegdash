import { gdata} from "./data.js";
import { createCharts } from "./charts.js";
import { createFilters } from "./filters.js";
import { createCards } from "./cards.js";

export var Gdashboard 
export var GlistFilters
export var GlistCharts 
export var GlistCards
export var Gdata

export function createDash(data_dash){
    Gdashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));
    
    Gdata = data_dash.data
    const filters = data_dash.filters
    const cards = data_dash.cards
    const charts = data_dash.charts


    if(dashIsValid(filters, cards, charts)){
       

        GlistFilters = createFilters(filters, Gdata)
        GlistCharts = createCharts(charts, Gdata)
        GlistCards = createCards(cards, Gdata, GlistFilters)
        
        Gdashboard.bind(GlistFilters, GlistCharts.listCharts);
        DrawDash(gdata(Gdata), Gdashboard)

    }else{
        var msg = "Você ultrapassou um dos limites do report:\n Gráficos <= 4 ["+ String(charts.length > 4)+"]\n Filtros <= 5 ["+String(filters.length > 5)+"]\n Cards <= 5 ["+String(cards.length > 5)+"]"
        alert(msg)
    }
    
}

function dashIsValid(filters, cards, charts){
    if((charts.length <= 4)&&(filters.length <=5 )&&(cards.length <=5)){
        return true
    }
    return false
}

function DrawDash(data, dashboard){
    dashboard.draw(data)
}