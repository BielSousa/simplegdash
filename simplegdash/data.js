export function gdata(data){
    data = data
    var gdata = new google.visualization.DataTable();
    for(var i in data.columns){
        gdata.addColumn(data.columns_type[i], data.columns[i]);
        if(data.columns_type[i].includes('date','datetime')){
            for(let row=0;row <data.rows.length; row++){
                    data.rows[row][i] = new Date(data.rows[row][i])
            }
        }
    }
    gdata.addRows(data.rows)
    return gdata
}

export function addIndex(data){
    data.columns_type.splice(0,0,'number')
    data.columns.splice(0,0,'index')
    let rows = data.rows
    for(let row=0;row<rows.length;row++){
        rows[row].splice(0,0,row)
    }
    data.rows = rows
    return adjustDates(data)
}

function fomartDate(date){
    date = new Date(date)
    date.setHours(0)
    date.setDate(date.getDate()+1)
    return date
}

function adjustDates(data){
    let types = data.columns_type
    let rows = data.rows
    let columns = []
    for(let i=0;i<types.length;i++){
        if(types[i] === 'date'){
            columns.push(i)
        }
    }
    for(let j=0; j<columns;j++){
        for(let i=0;i<rows.length;i++){
            rows[i][columns[j]] = fomartDate(rows[i][columns[j]])
        }
    }
    data.rows = rows
    return data
}


export function createView(data){
    var view =  new google.visualization.DataView(gdata(data))
    return view
}