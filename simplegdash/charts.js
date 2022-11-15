import { addChartGrid } from "./addStyles.js"
import { createMap } from "./maps.js"
import { gdata } from "./data.js"
import { Gdata } from "./dash.js"


function createContainerCharts(grid){
    let container = document.getElementById('container-charts')
    let charts = container.getElementsByClassName('charts')
    let chart = document.createElement("div")
    chart.classList.add('charts')
    let divId = 'chart_'+charts.length
    chart.id = divId
    container.appendChild(chart)
    addChartGrid(chart, grid)
    return divId
}

function addDropDown(group_charts){
    let div = document.createElement('div')
    let label = document.createElement('label')
    let select = document.createElement('select')
    label.innerText = 'Selecione o gráfico'
    div.appendChild(label)
    div.appendChild(select)
    group_charts.appendChild(div)
    select.addEventListener('change', function(){changeChartGroup(group_charts,this.value), updateFiltersState()})
}

function createGroupContainerCharts(grid, option_text){
    let container = document.getElementById('container-charts')
    let container_group = document.getElementById('container_group'+ grid)
    if(!container_group){
        let group_charts = document.createElement('div')
        group_charts.classList.add('containergroupcharts')
        group_charts.id = 'container_group' + grid
        container.appendChild(group_charts)
        addDropDown(group_charts)
    }
    let group = document.getElementById('group' + grid)
    container_group = document.getElementById('container_group' + grid)

    if(!group){
        group = document.createElement('div')
        group.id = 'group' + grid
        group.classList.add('groupcharts')
        container_group.appendChild(group)
    }
    group = document.getElementById('group' + grid)
    let charts = container.getElementsByClassName('charts')
    let chart = document.createElement("div")
    chart.classList.add('charts')
    let divId = 'chart_'+charts.length
    chart.id = divId
    let select = container_group.getElementsByTagName('select')[0]
    let option = document.createElement('option')
    option.value = divId
    option.innerText = option_text
    select.appendChild(option)
    group.appendChild(chart)
    addChartGrid(container_group, grid)
    return divId
}

export function createCharts(charts, data){
    let list_exclusives = ['Table','Histogram','TreeMap']
    let listCharts = []
    let listMaps = []
    let chart
    for(let i in charts){
        if(Object.prototype.toString.call(charts[i]) === '[object Array]'){
            let group = charts[i]
            for(let j in group){
                if(group[j].type === 'Donuts'){
                    group[j].type = 'Pie'
                    group[j].options = {pieHole:0.4}
                    }   
                let divId = createGroupContainerCharts(group[j].grid, group[j].title)
                chart = new google.visualization.ChartWrapper({
                        'chartType':(list_exclusives.includes(group[j].type) ? group[j].type : group[j].type +'Chart' ),
                        'containerId': divId,
                        'view':{'columns':group[j].columns},
                        'options':group[j].options
                        })
                listCharts.push(chart)
            }
        } else {
            if(charts[i].type === 'Donuts'){
                charts[i].type = 'Pie'
                charts[i].options.pieHole = 0.4
            }
            if(charts[i].type !== 'Map'){
                let dados = gdata(Gdata)
                let divId = createContainerCharts(charts[i].grid)
                chart = new google.visualization.ChartWrapper({
                            'chartType':(list_exclusives.includes(charts[i].type) ? charts[i].type : charts[i].type +'Chart' ),
                            'containerId': divId,
                            'dataTable':dados,
                            'options':charts[i].options
                            })
                chart.draw()
                listCharts.push(chart)
            } else{
                createMap(charts[i], data)
            }
        }
    }

    return {listCharts, listMaps}
}

function changeChartGroup(group,divId){
    let charts = group.getElementsByClassName('charts')
    let group_charts = document.getElementById(group.id.replace('container_',''))
    let chart = document.getElementById(divId)
    for(var i in charts){
        if(charts[i].tagName == 'DIV'){
            if(charts[i].id == divId){
                group_charts.insertBefore(chart, group_charts.firstChild);
            }
        }
    }
}

import { GlistCharts } from "./dash.js"
export function updateCharts(rows){
    

chart.setDataTable()
}