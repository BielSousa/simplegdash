export function gdata(data){

    var gdata = new google.visualization.DataTable();
    for(var i in data.columns){
        gdata.addColumn(data.columns_type[i], data.columns[i]);
    }
    gdata.addRows(data.rows)
    return gdata
}

export function createView(data){
    var view =  new google.visualization.DataView(gdata(data))
    return view
}