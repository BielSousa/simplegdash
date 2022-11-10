      google.charts.load('current', {'packages':['corechart','table', 'controls']});
      google.charts.setOnLoadCallback(drawStuff);

      function drawStuff() {

        var dashboard = new google.visualization.Dashboard(
          document.getElementById('programmatic_dashboard_div'));


        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Continente' );
        data.addColumn('string', 'Pais');
        data.addColumn('number', 'Medalhas');
        data.addRows([
            ['America do Norte','Canadá', 4],
            ['America do Norte','EUA', 4],
            ['America do Sul','Brasil', 5],
            ['America do Sul','Uruguay', 0],
            ['Europa','França', 2],
            ['Europa','Inglaterra', 1]
        ]);


        var chartRangeControl = new google.visualization.ControlWrapper({
            controlType:'ChartRangeFilter',
            containerId:'chartcontrol',
            options:{
                filterColumnIndex:2,
                
                ui:{
                    chartType:'ScatterChart',
                    chartView:{columns:[0,2]},
                    chartOptions:{
                        width:300,
                        height:50
                    },
                }
            },
        })

        var stringControlPais = new google.visualization.ControlWrapper({
            controlType:'StringFilter',
            containerId:'stringcontrolpais',
            options:{
                filterColumnLabel:'Pais'
            }
        })

        var stringControlContinente = new google.visualization.ControlWrapper({
            controlType:'StringFilter',
            containerId:'stringcontrolcontinente',
            options:{
                filterColumnLabel:'Continente'
            }
        })

        var sliderControl = new google.visualization.ControlWrapper({
          'controlType': 'NumberRangeFilter',
          'containerId': 'slider',
          'options': {
            'filterColumnLabel': 'Medalhas',
            'ui': {
                'labelStacking': 'horizontal',
                orientation:'vertical'
                },
          }
        });

        var categoryControl = new google.visualization.ControlWrapper({
            controlType:'CategoryFilter',
            containerId:'category',
            options:{
                filterColumnLabel:'Pais',
                ui:{
                    selectedValuesLayout:'belowWrapping',
                    'caption':'Selecione os Países',
                },
            }
        })

        var viewPie = new google.visualization.DataView(data)
        viewPie.setColumns([1,2]);

        var pieChart  = new google.visualization.ChartWrapper({
          'chartType': 'PieChart',
          'containerId': 'piechart',
            view:{columns:[1,2]},
          'options': {
            'width': 300,
            'height': 300,
            'legend': 'none',
            'chartArea': {'left': 15, 'top': 50, 'right': 15, 'bottom': 15},
            'pieSliceText': 'value'
          }
        });

        var barChart  = new google.visualization.ChartWrapper({
          'chartType': 'BarChart',
          'containerId': 'barchart',
            view:{columns:[1,2]},
          'options': {
            title: "Esse é um titulo",
            legend:'none',
            'width': 300,
            'height': 300,
            }
        });


        var tableChart = new google.visualization.ChartWrapper({
            chartType: "Table",
            containerId:'tablechart',
            options:{
                width:300,
                height:300
            }
        });



        dashboard.bind(
            [sliderControl, categoryControl, stringControlPais, stringControlContinente,chartRangeControl], 
            [tableChart, pieChart, barChart]);
        dashboard.draw(data);

        google.visualization.events.addListener(tableChart, 'select', selectValue);
        google.visualization.events.addListener(pieChart, 'select', selectValue);
        google.visualization.events.addListener(barChart, 'select', selectValue);
        google.visualization.events.addListener(categoryControl, 'statechange', controlValue);

        function controlValue(e){
            console.log(e.getState())
        }


        var row = null;
        function selectValue(e){
            
            if(row != e.getSelection()[0].row)
                //console.log(row,e.getSelection()[0].row)
                row = e.getSelection()[0].row
                console.log(data.getValue(row,0))
                var view = new google.visualization.DataView(data)
                pieChart.getChart().setSelection([{column: null, row: row},{column: null, row: row} ])
                barChart.getChart().setSelection([{column: null, row: row}])
                tableChart.getChart().setSelection([{column: null, row: row}])
                var view = new google.visualization.DataView(data)
                var tableView = new google.visualization.Table(document.getElementById('viewtable'))
                view.setRows(view.getFilteredRows([{column:0,   value:data.getValue(row,0)}]));
                tableView.draw(view)
                console.log(data.getValue(row,1))
        } 

      }