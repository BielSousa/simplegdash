import { gdata} from "./data.js";
import { createChart } from "./charts.js";
import { createFilters } from "./filters.js";
import { addStyles } from "./addStyles.js";
import { createCards } from "./cards.js";
import { createMap } from "./maps.js";

export function createDash(data, charts, filters, cards){

    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

    if((charts.length <= 4)&&(filters.length <=5 )&&(cards.length <=5)){
        var f = []

        for(var i in filters){
            f.push(createFilters(filters[i].type, filters[i].options, data))
            addStyles(f[i])
        } 

        let c = []
        for(var i in charts){
            if(charts[i].type == 'Map'){
                createMap(charts[i].columns, charts[i].grid, data, f)
            }else{
                c.push(createChart(charts[i].type,charts[i].grid, charts[i].columns, charts[i].title, charts[i].options))
            }
        } 


        let ca = []
            for(var i in cards){
            ca.push(createCards(cards[i].column, cards[i].subtitle, data))
        } 

        dashboard.bind(f,c);
        DrawDash(gdata(data), dashboard)
    }else{
        var msg = "Você ultrapassou um dos limites do report:\n Gráficos <= 4 ["+ String(charts.length > 4)+"]\n Filtros <= 5 ["+String(filters.length > 5)+"]\n Cards <= 5 ["+String(cards.length > 5)+"]"
        alert(msg)
    }
    
}

export function DrawDash(data, dashboard){
    dashboard.draw(data)
}