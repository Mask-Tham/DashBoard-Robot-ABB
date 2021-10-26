var dps_A = []
var chartName = ['Axes1', 'Axes2',
    'Axes3', 'Axes4',
    'Axes5', 'Axes6',
    'Total']
var time_value = [[], [], [], [], [], [], []]
var chartID = ['chart_Axes1', 'chart_Axes2',
    'chart_Axes3', 'chart_Axes4',
    'chart_Axes5', 'chart_Axes6',
    'chart_total']
var colorChart = ['#4527A0', '#303F9F',
    '#5E35B1', '#5C6BC0',
    '#7E57C2', '#64B5F6',
    '#4A148C']
var colorChart = ['#a9a9a9']

function getData(urlPath, eventfunc) {
    $.ajax({
        url: urlPath,
        dataType: 'json'
    }).done(eventfunc)
        .fail(function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else if (jqXHR.status === 503) {
                console.log('over load')
                msg = jqXHR.responseText
                setTimeout(function () {
                    getData(urlPath, eventfunc);
                }, 50)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
            // $('#post').html(msg);
        });

}

function createChartEnergy(dataChart, idChart) {
    Highcharts.stockChart(idChart, {

        rangeSelector: {
            selected: 2
        },
        colors: ['#a9a9a9'],
        yAxis: {
            // labels: {
            //     formatter: function () {
            //         return (this.value > 0 ? ' + ' : '') + this.value ;
            //     }
            // },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        // legend: {
        //     enabled: true
        // },

        plotOptions: {
            series: {
                // compare: 'percent',
                showInNavigator: true
            },
            areaspline: {
                fillOpacity: 0.5
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> kJ',
            valueDecimals: 2,
            split: true
        },

        series: dataChart
    });
}

function createElementBlock(row, col) {
    var tree = document.createDocumentFragment();
    var titleChart = ['Energy Axes 1', 'Energy Axes 2',
        'Energy Axes 3', 'Energy Axes 4',
        'Energy Axes 5', 'Energy Axes 6']
    var div_row = document.createElement("div");
    var n = 0;
    for (var j = 0; j < row; j++) {
        var div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        for (var i = 0; i < col; i++) {
            var div_body = document.createElement("div");
            div_body.setAttribute('class', 'card card-body');

            var div_col = document.createElement("div");
            div_col.setAttribute("class", "col1");

            var div_content = document.createElement('h4');
            div_content.setAttribute('class', 'card-title');
            div_content.appendChild(document.createTextNode(titleChart[n]))

            var div_chart = document.createElement('div');
            div_chart.setAttribute('id', chartID[n]);
            n++

            div_body.appendChild(div_content);
            div_body.appendChild(div_chart);
            div_col.appendChild(div_body);
            div_row.appendChild(div_col);
        }
        tree.appendChild(div_row);
    }
    document.getElementById("chart").appendChild(tree);
}

function energyChart(data) {
    showPage();
    dps_A = []
    time_value = [[], [], [], [], [], [], []]
    console.log('raw data', data, typeof (data))

    for (k in data) {
        time_stamp = data[k]["time-stamp"]
        // console.log('time_stamp',time_stamp)
        time_stamp = time_stamp.replace('T', '')
        var timeA = new Date(time_stamp)
        // datetime.setHours(datetime.getHours()+1); 
        timeA.setHours(timeA.getHours() + 7);
        // console.log('timeA', timeA)
        var valueA = Number(data[k]["interval-energy"]) / 1000

        time_value[6].push([timeA.getTime(), valueA])

        mechunits = data[k].mechunits[0].axes
        // for (var m = 0; m < 3; m++) {
        for (m in mechunits) {
            var valueA = Number(mechunits[m]["interval-energy"]) / 1000

            time_value[m].push([timeA.getTime(), valueA])
        }
        // console.log('time_value',time_value)
    }
    for (var i = 0; i < 7; i++) {
        dps_A.push({
            name: chartName[i],
            data: time_value[i],
            type: 'areaspline',
            // color: colorChart[0]
        })
        createChartEnergy([dps_A[i]], chartID[i]);
    }
    console.log('dps_A', dps_A[0])
    let icon = getCookie("theme_icon");
    checkTheme(icon)
    // createChartE([dps_A[0]], chartID[i]);

}

function exportTableToExcel() {
    // $.getJSON('/fileservice/$home/docs/data/energy.json', function (data) {
    //     console.log('data', data, typeof (data))
    //     let arData = []
    //     // let jData = {}
    //     let dataA = data['1'].mechunits[0].axes
    //     console.log('dataA', dataA, typeof (dataA))
    //     console.log('arData', arData, typeof (arData))
    //     // console.log('jData', jData, typeof(jData))
    //     for (k in data) {
    //         let jData = {}
    //         console.log('dataA', data[k], typeof (data[k]))
    //         jData['time stamp'] = data[k]['time-stamp']
    //         jData['Total'] = data[k]['interval-energy']
    //         let dataA = data[k].mechunits[0].axes
    //         jData['Axes 1'] = dataA[0]['interval-energy']
    //         jData['Axes 2'] = dataA[1]['interval-energy']
    //         jData['Axes 3'] = dataA[2]['interval-energy']
    //         jData['Axes 4'] = dataA[3]['interval-energy']
    //         jData['Axes 5'] = dataA[4]['interval-energy']
    //         jData['Axes 6'] = dataA[5]['interval-energy']

    //         console.log('jData', jData, typeof (jData))

    //         arData.push(jData)
    //     }
    //     console.log('arData', arData, typeof (arData))

    //     let ws_data = arData
    //     let ws = XLSX.utils.json_to_sheet(ws_data);

    //     let wb = XLSX.utils.book_new();
    //     wb.Props = {
    //         Title: "SheetJS Energy",
    //         Subject: "Energy",
    //         Author: "Mask T.",
    //         CreatedDate: new Date
    //     };

    //     wb.SheetNames.push("Energy Sheet");
    //     wb.Sheets["Energy Sheet"] = ws;
    //     let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    //     saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Energy.xlsx');
    // });

    getData('/fileservice/$home/docs/data/energy.json', exportCSV)
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function exportCSV(data) {
    console.log('data', data, typeof (data))
    let arData = []
    // let jData = {}
    let dataA = data['1'].mechunits[0].axes
    console.log('dataA', dataA, typeof (dataA))
    console.log('arData', arData, typeof (arData))
    // console.log('jData', jData, typeof(jData))
    for (k in data) {
        let jData = {}
        console.log('dataA', data[k], typeof (data[k]))
        jData['time stamp'] = data[k]['time-stamp']
        jData['Total'] = data[k]['interval-energy']
        let dataA = data[k].mechunits[0].axes
        jData['Axes 1'] = dataA[0]['interval-energy']
        jData['Axes 2'] = dataA[1]['interval-energy']
        jData['Axes 3'] = dataA[2]['interval-energy']
        jData['Axes 4'] = dataA[3]['interval-energy']
        jData['Axes 5'] = dataA[4]['interval-energy']
        jData['Axes 6'] = dataA[5]['interval-energy']

        console.log('jData', jData, typeof (jData))

        arData.push(jData)
    }
    console.log('arData', arData, typeof (arData))

    let ws_data = arData
    let ws = XLSX.utils.json_to_sheet(ws_data);

    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS Energy",
        Subject: "Energy",
        Author: "Mask T.",
        CreatedDate: new Date
    };

    wb.SheetNames.push("Energy Sheet");
    wb.Sheets["Energy Sheet"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Energy.xlsx');

}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";
    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}

function manageData() {
    // $.getJSON(
    //     '/fileservice/$home/docs/data/energy.json',
    //     energyChart
    // )
    getData('/fileservice/$home/docs/data/energy.json', energyChart);
}

function checkTheme(icon) {
    console.log(icon)
    console.log($('#chart_total').highcharts())
    let dark = ['#262626','#ff000f','#7db8fe','#fff','#fff'];
    let light = ['#fff','#a9a9a9','#426084','silver','#666666'];
    if (icon == 'moon') {
        for ( i in chartID) {
            changeOptionsChart(chartID[i],dark[0],dark[1],dark[2],dark[3],dark[4])
        }
    } else {
        for ( i in chartID) {
            changeOptionsChart(chartID[i],light[0],light[1],light[2],light[3],light[4])
        }
    }
    console.log($('#chart_total').highcharts())
}

function changeOptionsChart(nameChart,bg,cr,rIcr,rLcr,xLScr) {
    $('#'+nameChart).highcharts().update({
        chart: {
            backgroundColor: bg
        },
        colors: [cr],
        rangeSelector: {
            inputStyle: {
                color: rIcr,
                // fontWeight: 'bold'
            },
            labelStyle: {
                color: rLcr,
                // fontWeight: 'bold'
            },
        },
        xAxis: {
            labels: {
                style: {
                    color: xLScr
                }
            }
        }
    })
}


window.onload = function () {
    createElementBlock(3, 2)
    manageData();
    // setTimeout()
}