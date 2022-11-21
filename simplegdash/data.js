export function gdata(data){
    data = data
    var gdata = new google.visualization.DataTable();
    for(var i in data.columns){
        gdata.addColumn(data.columns_type[i], data.columns[i]);
        if(data.columns_type[i].includes('date','datetime')){
            for(let row=0;row <data.rows.length; row++){
                try{
                    data.rows[row][i] = fomartDate(data.rows[row][i].split(' ')[0])
                } catch(e){
                    data.rows[row][i] = new Date(data.rows[row][i])
                }
            }
        }
    }
    gdata.addRows(data.rows)
    return gdata
}

export function gdataFiltered(data, columns, rows=false, addIndex=false, group=false){
    let columns_type = JSON.parse(JSON.stringify(data.columns_type))
    columns = (addIndex?[0,...columns]:columns)
    let listRows = JSON.parse(JSON.stringify(data.rows))
    let listColumns = []
    var gdata = new google.visualization.DataTable();
    
    for(let i=data.columns.length; i>=0; i--){
        if(columns.includes(i)){
            listColumns.push([data.columns_type[i], data.columns[i]]);
            if(data.columns_type[i].includes('date','datetime')){
                for(let row=0;row <listRows.length; row++){
                        listRows[row][i] = new Date(listRows[row][i])
                }
            }
        } else{
            columns_type.splice(Number(i), 1)
        }
    }
    for(let i=listColumns.length-1; i>=0; i--){
        gdata.addColumn(listColumns[i][0], listColumns[i][1])
    }
    for(let i=data.columns.length; i>=0; i--){
        if(!columns.includes(i)){
            for(let row=0;row <listRows.length; row++){
                listRows[row].splice(Number(i), 1)
            }
        }
    }

    if(rows){
        for(let row=data.rows.length;row >= 0; row--){
            if(!rows.includes(row)){
                listRows.splice(Number(row), 1)
            }
        }
    }

    if(group){
        listRows = agrupaDados(listRows, columns_type, 'sum')
    }
    gdata.addRows(listRows)

    return gdata

}

var calc ={
    'sum':function(dados){    
        let sum = 0
        dados.forEach((v)=>{sum = sum + v})
        return sum
    },'count':function(dados){
        return dados.length
    }
}

function agrupaDados(rows, columns_type, calc){
    let final_rows = [], category = []
    
     rows.forEach((row)=>{
        if(final_rows.length === 0){
            final_rows.push(row)
            category.push(row[0])
        }else{
            if(category.indexOf(row[0]) === -1){
                final_rows.push(row)
                category.push(row[0])
            }else{
                for(let i in row){
                    if(i > 0){
                        final_rows[category.indexOf(row[0])][i] = final_rows[category.indexOf(row[0])][i] + row[i]
                    }
                }
            }
        }
    })
    return final_rows
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
