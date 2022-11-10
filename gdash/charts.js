import { add_chart_grid } from "./addStyles.js"

export function createChart(type, grid, columns, title=null, options=null){
    if((type != 'Table')&&(title)){
        if (options){
            options.title = title
            options.width = "100px"
        }else{
            var options = {title:title, with:'100px'}
        }
    }else{
         if (options){
            options.width = "100%"
            options.height = "100%"
        }else{
            var options = {with:'100%', height:'100%'}
        }
    }
    var container = document.getElementById('container-charts')
    var charts = container.getElementsByTagName('div')
    var chart = document.createElement("div")
    chart.classList.add('charts')
    var divId = 'chart_'+charts.length
    chart.id = divId 
    container.appendChild(chart)
    add_chart_grid(chart, grid)
    var chart = new google.visualization.ChartWrapper({
            'chartType': type,
            'containerId': divId,
            'view':{'columns':columns},
            'options':options
            })

    return chart
}