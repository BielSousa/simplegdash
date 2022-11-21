import { gdata, gdataFiltered } from "./data.js";
import { Gdata } from "./dash.js";

/** Classfilter */  
 class filterClass {
    constructor(dados, filter){
        this._dados = dados
        this._type = filter.type
        this._column = filter.column
        this._title = null
        this._rows =[]
        this._state = {}
        this._divId = null
        this._min = null
        this._max = null
        this._fvalues = []
        this._divFilter = null
        this._cssClass = null
        this._observers = []
        // range filter
        this._sliderMin = null
        this._sliderMax = null
        this._inputMin = null
        this._inputMax = null
        this._track = null
        this._minGap = 0

        //date filter
        this._startDate = null
        this._endDate = null

        //category filter
        this._options = null
        this._select = null

        //string filter
        this._inputString = null

        // factory para criar os filtros
        this._creaters = {
            'Range':function(filter){createRangeFilter(filter)},
            'Date':function(filter){createDateFilter(filter)},
            'String':function(filter){createStringFilter(filter)},
            'Category':function(filter){createCategoryFilter(filter)},
        }

    }
    // inicializa o filtro
    init(){
        this._setTitle()
        this._setCssClass()
        this._setInicialState()
        this._setDivId()
        this._creaters[this._type](this)
        this.setDivFilter()
        this._setElements()
    }

    _setElements(){
        if(this._type === 'Range'){
            this._track = document.getElementById(this._divId).firstChild.children[2].children[0]
            this._inputMin = document.getElementById(this._divId).firstChild.children[1].children[0]
            this._inputMax = document.getElementById(this._divId).firstChild.children[1].children[1]
            this._sliderMin = document.getElementById(this._divId).firstChild.children[2].children[1]
            this._sliderMax = document.getElementById(this._divId).firstChild.children[2].children[2]
            this._sliderMin.addEventListener('input',()=>{this._updateInputSliderMin()})
            this._sliderMax.addEventListener('input',()=>{this._updateInputSliderMax()})
            this._inputMin.addEventListener('change',()=>{this._updateInputNumberMin()})
            this._inputMax.addEventListener('change',()=>{this._updateInputNumberMax()})
        }else if(this._type === 'Date'){
            this._startDate = document.getElementById(this._divId).firstChild.children[1].children[0].children[1]
            this._endDate = document.getElementById(this._divId).firstChild.children[1].children[1].children[1]
            this._startDate.addEventListener('change',()=>{this._updateDateStart()})
            this._endDate.addEventListener('change',()=>{this._updateDateEnd()})
        }else if(this._type === 'Category'){
            this._select = document.getElementById(this._divId).children[1]
            this._select.addEventListener('change',(evt)=>{this._updateSelect(evt)})
            this._options = document.getElementById(this._divId).children[2]
        }else if(this._type === 'String'){
            this._inputString = document.getElementById(this._divId).children[1]
            this._inputString.addEventListener('input', (evt) => {this._updateString(evt)} )
        }

    }

    // Datatable do filter
    set inputMin(inputMin){this._inputMin = inputMin}
    get inputMin(){return this._inputMin}
    // Datatable do filter
    set inputMax(dados){this._inputMax = dainputMaxos}
    get inputMax(){return this._inputMax}
    // Datatable do filter
    set sliderMax(sliderMax){this._sliderMax = sliderMax}
    get sliderMax(){return this._sliderMax}
    // Datatable do filter
    set sliderMin(sliderMin){this._sliderMin = sliderMin}
    get sliderMin(){return this._sliderMin}
    // Datatable do filter
    set track(track){this._track = track}
    get track(){return this._track}
    // Datatable do filter
    set dados(dados){this._dados = dados}
    get dados(){return this._dados}
    
    // Tipo do filtro
    set type(type){this._type = type}
    get type(){return this._type}
 
    // coluna do filtro
    set column(column){this._column = column}
    get column(){return this._column}
    
    // titulo do filtro
    _setTitle(){this._title = this._dados.getColumnLabel(this._column).toUpperCase().replace('_',' ')}
    get title(){return this._title}
    
    // valor minimo do filtro Range/Date
    set min(min){this._min = min}
    get min(){return this._min}
    
    
    // valor maximo do filtro Range/Date
    set max(max){this._max = max}
    get max(){return this._max}
    
    // todos Valores distintos do filtro
    set values(values){this._fvalues = values}
    get values(){return this._fvalues}
    
    _setRows(){
        let dados = gdata(Gdata)
        let rows = []
        if(['Range','Date'].includes(this._type)){
            let min = (this._type === 'Date'?formatDate['filter'](this._state.min):this._state.min)
            let max = (this._type === 'Date'?formatDate['filter'](this._state.max):this._state.max)
            rows = dados.getFilteredRows([{column:this._column, minValue:min, maxValue:max}])
        }else if(['String', 'Category'].includes(this._type)){
            let values = (this._state.values.length !== 0 ?this._state.values:[...this._dados.getDistinctValues(this._column)])
            rows =  dados.getFilteredRows([{
                        column:this._column,
                        test: function (value, row, column, table) {
                        return (values.indexOf(dados.getValue(row, column)) > -1)
                        }}])
        }
        this._rows = rows

    }

    // Estado atual do filtro
    set state(state){ 
            if(this._type === 'Range'){
                (Number(state.min) <= Number(state.max)?state = {min:Number(state.min),max:Number(state.max)}:_state = this._state)
            }else if(this._type === 'Date'){
                (formatDate['filter'](state.min) <= formatDate['filter'](state.max)?state = {min:state.min,max:state.max}:_state = this._state)                
            }
            this._state = state
        this._setRows()
     }
    get state(){return this._state}
    _setInicialState(){
        let state
        let values
        switch(this._type){
            case 'Range':
                state = this.dados.getColumnRange(this._column)
                this._state = state
                this._min = this._state.min
                this._max = this._state.max
                break
            case 'Date':
                state = this.dados.getColumnRange(this._column)
                this._state = {min:formatDate['input'](state.min), max:formatDate['input'](state.max)}
                this._min = this._state.min
                this._max = this._state.max
                break
            case 'Category':
                values = ['---',...this._dados.getDistinctValues(this._column)]
                this._state = {values:[]}
                this._fvalues = values
                break
            case 'String':
                values = [...this._dados.getDistinctValues(this._column)]
                this._state = {values:[]}
                break
        }
    }

    // Id da div do filtro
    _setDivId(){
        const container = document.getElementById('container-filters')
        const filters = container.children
        const new_filter = document.createElement("div")
        new_filter.id = `filter_${filters.length}` 
        container.appendChild(new_filter)
        this._divId = new_filter.id
    }
    get divId(){return this._divId}

    // Classe CSS do filtro
    _setCssClass(){
        switch(this._type){
            case 'Range':
                this._cssClass = 'filter-number'
                break
            case 'Date':
                this._cssClass = 'filter-date'
                break
            case 'String':
                this._cssClass = 'filter-string'
                break
            case 'Category':
                this._cssClass = 'filter-category'
                break
         }
    }
    get cssClass(){return this._cssClass}

    // Div main do filtro
    get divFilter(){return this._divFilter}
    setDivFilter(){this._divFilter = document.getElementById(this._divId)}

    set observer(observer){this._observers.push(observer)}
    get observer(){return this._observer}
    update_observers(){this._observers.forEach( observer => {console.log(observer);observer.update(this._rows, this._divId);})}

    update(rows, divId){
        let dados_filtered = gdataFiltered(Gdata, [this._column], rows, false, false)
        let range = dados_filtered.getColumnRange(0)
        let values = dados_filtered.getDistinctValues(0)
        if(this._divId !== divId){
            if(this._type === 'Range'){
                this._state = {min:range.min, max:range.max}
                this._inputMin.value = range.min
                this._sliderMin.value = range.min
                this._inputMax.value = range.max 
                this._sliderMax.value = range.max
                this._updateTrack()
            }else if(this._type === 'Date'){
                this._startDate.value = formatDate['input'](range.min)
                this._endDate.value = formatDate['input'](range.max)
                this._state = {min:formatDate['input'](range.min), max:formatDate['input'](range.max)}
            
            }else if(this._type === 'Category'){

            }
        }
    }


    // funcionalidade filter range

   _updateInputSliderMin(){
        if(Number(this._sliderMax.value) - Number(this._sliderMin.value) <= this._minGap){
            this._sliderMin.value = Number(this._sliderMax.value) - this._minGap
        }
        this._updateTrack()
        this._inputMin.value = this._sliderMin.value
        this.state = {min: this._sliderMin.value, max: this._sliderMax.value}
        this.update_observers()
    }   

    _updateInputSliderMax(){
        if(Number(this._sliderMax.value) - Number(this._sliderMin.value) <= this._minGap){
            this._sliderMax.value = Number(this._sliderMin.value) + this._minGap
        }
        this._updateTrack()
        this._inputMax.value = this._sliderMax.value
        this.state = {min: this._sliderMin.value, max: this._sliderMax.value}
        this.update_observers()
    }

    _updateInputNumberMin(){
        if(Number(this._sliderMax.value) - Number(this._inputMin.value) <= this._minGap){
            this._inputMin.value = Number(this._sliderMax.value) - this._minGap
        }
        this._updateTrack()
        
        this._sliderMin.value = this._inputMin.value
        this.state = {min: this._sliderMin.value, max: this._sliderMax.value}
        this.update_observers()
    }     
    _updateInputNumberMax(){   
         if(Number(this._inputMax.value) - Number(this._sliderMin.value) <= this._minGap){
            this._inputMax.value = Number(this._sliderMin.value) + this._minGap
        }
        this._sliderMax.value = this._inputMax.value
        this._updateTrack()
        this.state = {min: this._sliderMin.value, max: this._sliderMax.value}
        this.update_observers()
    }

    _updateTrack(){
        let range = this._max - this._min
        let percent1 = ((this._sliderMin.value - this._min)/range)*100
        let percent2 = (1-((this._max - this._sliderMax.value)/range))*100
        this._track.style.background = `linear-gradient(to right , #dadad5 ${percent1}%, #3264f3 ${percent1}%, #3264f3 ${percent2}%, #dadad5 ${percent2}%)`
    }

    // funcionalidade filter Date
    _updateDateStart(){
         if((new Date(this._endDate.value) - new Date(this._startDate.value))/(1000*60*60*24) <= this._minGap){
            this._startDate.value = this._endDate.value
        }
        this.state = {min:this._startDate.value, max:this._endDate.value}
        this.update_observers()
    }
    _updateDateEnd(){
         if((new Date(this._endDate.value) - new Date(this._startDate.value))/(1000*60*60*24) <= this._minGap){
            this._endDate.value = this._startDate.value
        }
        this.state = {min:this._startDate.value, max:this._endDate.value}
        this.update_observers()
    }

    // funcionalidade Category
     _updateSelect(evt){
        if((evt.target.value !== this._fvalues[0])&&(this._state.values.length < this._fvalues.length - 1)&&!(this._state.values.includes(evt.target.value))){
            this.state = {values:[evt.target.value,...this._state.values]}
            let div_li = document.createElement('div')
            let span = document.createElement('span')
            let li = document.createElement('li')
            div_li.style = 'display:flex; flex-direction:row;justify-content:center;align-content:center' // passar para o CSS
            span.innerText = 'X'
            div_li.appendChild(span)
            div_li.appendChild(li)
            li.innerText = evt.target.value
            this._options.appendChild(div_li)
            span.addEventListener('click', e =>{
                e.target.parentNode.remove()
                let index = this._state.values.indexOf(e.target.parentNode.lastChild.innerText)
                let values = [...this._state.values]
                if(index > -1){values.splice(index,1)}
                this.state = {values:values}
                this.update_observers()
            })
        }
        this.update_observers()
    }


    // funcionalidades string
     _updateString(evt){
        let str = evt.target.value
        let values = this._dados.getDistinctValues(Number(this._column))
        this.state = {values:values.filter((value) => value.toLowerCase().replace(' ','_').startsWith(str.replace(' ','_')))}
        this.update_observers()
    }

}

var formatDate = {
    filter:function (date){
        date = new Date(date)
        date = new Date(date.setHours(0))
        date = new Date(date.setDate(date.getDate()+1))
        return date
    },
    input: function (date){
        date = new Date(date)
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return year + "-" + month + "-" + day
    }
}



function inicializeFilter(dados, filter){
    filter = new filterClass(dados, filter)
    filter.init()
    return filter
}


export function createFilters(filters){
    let dados = gdata(Gdata)
    let listFilters = []

   filters.forEach(filter => {   
        if(Object.keys(filter).length > 0 ){filter = inicializeFilter(dados, filter)}
        listFilters.push(filter)
    });

    listFilters.forEach(filter =>{
        listFilters.forEach(observer =>{
            filter.observer = observer
        })
    })

    return listFilters
}

function createRangeFilter(filter){ 
    let container_filter = document.getElementById(filter.divId)
    let title = document.createElement('label')
    title.innerText = filter.title
    let div_filter = document.createElement('div')
    div_filter.classList =filter.cssClass

    let divNumber = document.createElement('div')
    divNumber.classList = 'number-container'
    let divSlider = document.createElement('div')
    let sliderTrack = document.createElement('div')
    divSlider.classList = 'slider-container'
    sliderTrack.classList = 'track'
    let limite = document.createElement('label')
    limite.classList = 'limite-filter'
    limite.innerText = "[min:".concat(String(filter.state.min) + '\xa0'.repeat(3)).concat("max:").concat(filter.state.max).concat("]")

    divSlider.appendChild(sliderTrack)
    div_filter.appendChild(title)
    div_filter.appendChild(divNumber)
    div_filter.appendChild(divSlider)
    div_filter.appendChild(limite)
    container_filter.appendChild(div_filter)

    let inputNumberMin = document.createElement('input')
    let inputNumberMax = document.createElement('input')
    inputNumberMin.type = 'number'
    inputNumberMax.type = 'number'
    divNumber.appendChild(inputNumberMin)
    divNumber.appendChild(inputNumberMax)

    let inputSliderMin = document.createElement('input')
    let inputSliderMax = document.createElement('input')
    divSlider.appendChild(inputSliderMin)
    divSlider.appendChild(inputSliderMax)

    inputSliderMin.type = 'range'
    inputSliderMin.name = 'rangeMin'
    inputSliderMin.divId = filter.divId
    inputSliderMin.min = filter.state.min
    inputSliderMin.value = filter.state.min
    inputSliderMin.max = filter.state.max
    inputNumberMin.value = filter.state.min

    inputSliderMax.type = 'range'
    inputSliderMax.name = 'rangeMax'
    inputSliderMax.min = filter.state.min
    inputSliderMax.max = filter.state.max
    inputSliderMax.value = filter.state.max
    inputNumberMax.value = filter.state.max
}


function createDateFilter(filter){

    let container_filter = document.getElementById(filter.divId)
    let div_filter = document.createElement('div')
    div_filter.classList =filter.cssClass
    let title = document.createElement('label')
    let limite = document.createElement('label')
    let div_inputs = document.createElement('div')
    let div_start = document.createElement('div')
    let start_title = document.createElement('span')
    let date_start =  document.createElement('input')
    div_start.appendChild(start_title)
    div_start.appendChild(date_start)

    let div_end = document.createElement('div')
    let end_title = document.createElement('span')
    let date_end = document.createElement('input')
    div_end.appendChild(end_title)
    div_end.appendChild(date_end)
    div_inputs.appendChild(div_start)
    div_inputs.appendChild(div_end)
    div_filter.appendChild(title)
    div_filter.appendChild(div_inputs)
    div_filter.appendChild(limite)
    container_filter.appendChild(div_filter)

    title.innerText = filter.title

    // passar estilos para o css
    title.style = 'width:100%; text-align:center;display:block'
    div_inputs.style = 'display: flex ; flex-direction: row; justify-content:space-around'
    div_start.style = 'display: flex ; flex-direction: column; width:40% ; text-align:center'
    div_end.style = 'display: flex ; flex-direction: column; width:40%;  text-align:center'
    limite.style = 'text-align:center; font-size:14px; display: block; padding: 10px 0px;margin-top:5px; color: #999; background-color:#eee'
    
    date_start.type = 'date'
    date_start.name = 'start'
    start_title.innerText = 'Data Inicial'
    date_start.min =  filter.state.min
    date_start.value =  filter.state.min
    date_start.max =  filter.state.max
    
    end_title.innerText = 'Data Final'
    date_end.type = 'date'
    date_end.name = 'end'
    date_end.min = filter.state.min
    date_end.value = filter.state.max
    date_end.max = filter.state.max
    limite.innerText = "[min:".concat(String(filter.state.min) + '\xa0'.repeat(5)).concat("max:").concat(filter.state.max).concat("]")
}

function createCategoryFilter(filter){
    let container_filter = document.getElementById(filter.divId)
    container_filter.classList = filter.cssClass
    let title = document.createElement('label')
    title.innerText = filter.title
    container_filter.appendChild(title)
    let select = document.createElement('select') 
    let ul = document.createElement('ul') 
    container_filter.appendChild(select)
    container_filter.appendChild(ul)
    filter.values.forEach(value => {
        let option = document.createElement('option')
        option.value = value
        option.innerText = value
        select.appendChild(option)
    })
}

function createStringFilter(filter){
    let container_filter = document.getElementById(filter.divId)
    container_filter.classList = filter.cssClass
    let title = document.createElement('label')
    title.innerText = filter.title
    container_filter.appendChild(title)
    let input = document.createElement('input')
    input.type ='text'
    container_filter.appendChild(input)
}


