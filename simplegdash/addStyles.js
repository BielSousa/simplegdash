export function addStyles(obj){
    var style = {
        CategoryFilter:'filter-category',
        NumberRangeFilter:'filter-number',
        DateRangeFilter:'filter-date',
        StringFilter:'filter-string',
        ChartRangeFilter:'filter-chart',
        Charts:'charts'
    }
    if(obj.sM == 'control'){
        obj.m.ui.cssClass = style[obj.pf]
    }
}

export function addChartGrid(chart){
    if(chart.grid == 1){
        chart.divChart.style['grid-area'] = "1 / 1 / 2 / 2"
    }else if(chart.grid==2){
        chart.divChart.style['grid-area'] = "1 / 2 / 2 / 3"
    }else if(chart.grid==3){
        chart.divChart.style['grid-area'] = "2 / 1 / 2 / 1"
    }else if(chart.grid==4){
        chart.divChart.style['grid-area'] = "2 / 2 / 3 / 3"
    }else if(chart.grid==12){
        chart.divChart.style['grid-area'] = "1 / 1 / 2 / 3"
    }else if(chart.grid==34){
        chart.divChart.style['grid-area'] = "2 / 1 / 3 / 3"
    }else if(chart.grid==13){
        chart.divChart.style['grid-area'] = "1 / 1 / 3 / 2"
    }else if(chart.grid==24){
        chart.divChart.style['grid-area'] = "1 / 2 / 3 / 3"
    }else if(chart.grid==0){
        chart.divChart.style['grid-area'] = "1 / 1 / 3 / 3"
    }
}