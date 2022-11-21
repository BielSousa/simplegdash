import { addChartGrid } from "./addStyles.js"
import { createMap } from "./maps.js"
import { addIndex, gdata } from "./data.js"
import { Gdata } from "./dash.js"
import { gdataFiltered } from "./data.js"

class chartsClass {
    constructor (dados, chart, group){
        this._columns = chart.columns
        this._type = chart.type
        this._dados = dados
        this.title = chart.title
        this._group = group
        this._divContainer = chart.container
        this._grid = chart.grid
        this._divChart = null
        this._chart = null

       this._creaters = {
            // 'TreeMap':function(filter){createStringFilter(filter)},
            'Table':function(filter){createRangeFilter(filter)},
            'Histogram':function(filter){createDateFilter(filter)},
            'Bar':function(filter){createCategoryFilter(filter)},
            'Column':{},
            'Pie':{},
            'Donuts':{},
            'Scatter':{},
            'Maps':{},
        }

    }
    get divId(){return this._divId}
    get grid(){return this._grid}
    get divChart(){return this._divChart}
    init(){
        this._addChart()
        this._drawChart()

    }

    _addChart(){
        let container
        let charts
        if(this._group){
            container = this._divContainer
            charts = container.getElementsByClassName('groupcharts')
        }else{
            container = document.getElementById('container-charts')
            charts = container.getElementsByClassName('charts')
        }
        let chart = document.createElement("div")
        this._divChart = chart
        chart.classList = (this._group?'groupcharts':'charts')
        let divId = (this._group?'groupChart_'+charts.length:'chart_'+charts.length)
        chart.id = divId
        this._divId = divId
        container.appendChild(chart)
        addChartGrid(this)
    }
    _drawChart(){
        let list_exclusives = ['Table','Histogram','TreeMap']
        if(this._type !== 'Map'){
            let dados = (this._type === 'Table'?gdataFiltered(Gdata, this._columns, false, true):gdataFiltered(Gdata, this._columns, false, false, true))
            this._chart = new google.visualization.ChartWrapper({
                    'chartType':(list_exclusives.includes(this._type) ? this._type : this._type +'Chart' ),
                    'containerId': this._divId,
                    'dataTable':dados,
                    'options':this._options
                    })
            this._chart.draw()
        }
    }
    
    update(rows){
        if(this._type !== 'Map'){
        let dados
            if(this._type==='Table'){
                dados =  gdataFiltered(Gdata, this._columns, rows)
            }else{
                dados =  gdataFiltered(Gdata, this._columns, rows, false, true)
            }
                this._chart.setDataTable(dados)
                this._chart.draw()
        }
    }
}

class groupChartClass{
    constructor (dados, charts){
        this._dados = dados
        this._grid =charts.grid
        this._charts = charts.group
        this._activeCharts = []
        this._groupCharts
        this._select
        this._divId
    }

    init(){
        this._createGroupContainer()
        this._createCharts()
        this._select.addEventListener("change",(evt) => {this._changeChartGroup(evt.target.value)})
    }
    _createGroupContainer(){
        let container = document.getElementById('container-charts')
        let group_charts = document.createElement('div')
        this._groupCharts = group_charts
        group_charts.classList.add('containergroupcharts')
        group_charts.id = 'container_group' + this._grid
        container.appendChild(group_charts)
        let div = document.createElement('div')
        let label = document.createElement('label')
        let select = document.createElement('select')
        this._select = select
        label.innerText = 'Selecione o gráfico'
        div.appendChild(label)
        div.appendChild(select)
        group_charts.appendChild(div)
    }

    _createCharts(){
        this._charts.forEach(chart =>{
            chart.grid = this._grid
            chart.container = this._groupCharts
            let activeChart = inicializeChart(this._dados, chart, true)
            this._activeCharts.push(activeChart)
            this._setOption(activeChart)
        })
    }
    _setOption(chart){
        let option = document.createElement('option')
        option.value = chart.divId
        option.innerText = chart.title
        this._select.appendChild(option)
    }
    
    _changeChartGroup(divId){
        this._activeCharts.forEach(chart => {
            console.log(chart.divId, divId, this._groupCharts)
            if(chart.divId === divId){
                this._groupCharts.insertBefore(chart.divChart, this._groupCharts.children[1]);
            }
        })
    }

    update(rows){
        this._activeCharts.forEach(chart =>{console.log(chart);chart.update(rows)})
    }
}



function inicializeChart(dados, chart, group=false){
    chart = new chartsClass(dados, chart, group)
    chart.init()
    return chart
}

function inicializeGroup(dados, charts){
    charts = new groupChartClass(dados, charts)
    charts.init()
    return charts
}

import { GlistFilters } from "./dash.js"
export function createCharts(charts){
    let dados = gdata(Gdata)
    let listCharts = []
    let listMaps = []

    charts.forEach(chart => {
        if(Object.keys(chart).includes('group')){
            listCharts.push(inicializeGroup(dados, chart))
        }else{
            listCharts.push(inicializeChart(dados, chart))
        }
    });

    GlistFilters.forEach( filter =>{
        listCharts.forEach( chart =>{
            filter.observer = chart
        })
    })

}



//                  if(element.type === 'Donuts'){
//                     element.type = 'Pie'
//                     element.options = {pieHole:0.4}
//                 }   



import { GlistCharts } from "./dash.js"
export function updateCharts(rows){ 
    
    if(GlistCharts){
        let charts = []
        for(let i in GlistCharts.charts){
            if(GlistCharts.charts[i].length > 1){
                charts.push(...GlistCharts.charts[i])
            }else{
                charts.push(GlistCharts.charts[i])
            }
        }
        for(let i in GlistCharts.listCharts){
            if(charts[i].type==='Table'){
                let dados =  gdataFiltered(Gdata, charts[i].columns, rows)
                GlistCharts.listCharts[i].setDataTable(dados)
                GlistCharts.listCharts[i].draw()
            }else{
                let dados =  gdataFiltered(Gdata, charts[i].columns, rows, false, true)
                GlistCharts.listCharts[i].setDataTable(dados)
                GlistCharts.listCharts[i].draw()
            }
        }
    }
}