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

export function add_chart_grid(chart, grid){
    if(grid[0] == 1){
        chart.style['grid-area'] = "1 / 1 / 2 / 2"
    }else if(grid==2){
        chart.style['grid-area'] = "1 / 2 / 2 / 3"
    }else if(grid==3){
        chart.style['grid-area'] = "2 / 1 / 2 / 1"
    }else if(grid==4){
        chart.style['grid-area'] = "2 / 2 / 3 / 3"
    }else if(grid==12){
        chart.style['grid-area'] = "1 / 1 / 2 / 3"
    }else if(grid==34){
        chart.style['grid-area'] = "2 / 1 / 3 / 3"
    }else if(grid==13){
        chart.style['grid-area'] = "1 / 1 / 3 / 2"
    }else if(grid==24){
        chart.style['grid-area'] = "1 / 2 / 3 / 3"
    }else if(grid==0){
        chart.style['grid-area'] = "1 / 1 / 3 / 3"
    }
}