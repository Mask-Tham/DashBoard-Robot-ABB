var path = ['/rw/elog/0', '?lang=en&json=1', '?order=lifo&lang=en&start=', '&limit=50&json=1'];
var count = [0, 0, 0];
var dps_A = []
var time_value = [];
var readyState;
var arrayState = [[], []];
var sum = 0;
var chartElog, chartStatusRobot, chartEnergy;
var theme = 'light1';


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
                }, 100)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
            // $('#post').html(msg);
        });

}

function massageelog(data) {
    // console.log("data",data)
    // console.log("code",data._embedded._state[0].code)
    let elog = data._embedded._state;

    // showPage();
    for (var k in elog) {
        msgtype = elog[k].msgtype;


        // console.log('true')
        switch (msgtype) {
            case '1':
                var type1 = 'information'
                ++count[0];
                break;
            case '2':
                var type1 = 'warning'
                ++count[1];
                break;
            case '3':
                var type1 = 'error'
                ++count[2];
                break;
            default:
                break;
        }


    }
    sum = count.reduce(function (a, b) {
        return a + b;
    }, 0)
    readyState--
    renderChart()
}

function energyChart(data) {
    // showPage();
    dps_A = []
    time_value = []
    // console.log('raw data', data, typeof (data))

    for (k in data) {
        let time_stamp = data[k]["time-stamp"]
        // console.log('time_stamp',time_stamp)
        time_stamp = time_stamp.replace('T', '')
        let timeA = new Date(time_stamp)
        timeB =timeA.setHours(timeA.getHours() + 7);
            // console.log('time_stamp', time_stamp)
            // console.log('timeA', timeA.getTime())
            // datetime.setHours(datetime.getHours()+1); 
        // console.log('timeA', timeA)
        let valueA = Number(data[k]["interval-energy"]) / 1000

        time_value.push([timeA.getTime(), valueA])

    }

    dps_A.push({
        name: 'Energy',
        data: time_value,
        type: 'areaspline',
        // color: '#a9a9a9'
    })
    createChartEnergy([dps_A[0]]);

    // console.log('dps_A', timeB)


    readyState--

    // createChartE([dps_A[0]], chartID[i]);

}

function renderChart() {
    for (var i = 0; i < count.length; i++)
        chartElog.options.data[0].dataPoints[i].y = count[i];
    chartElog.render();
}

CanvasJS.addColorSet("elogShades",
    [//colorSet Array

        "#347FD3",
        "#E7E011",
        "#DA1111",
        "#BDBDBD"
    ]);

function createChartElog() {
    chartElog = new CanvasJS.Chart("chart_Elog", {
        colorSet: 'elogShades',
        theme: theme, // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        legend: {
            fontSize: 18,
            horizontalAlign: "right",
            verticalAlign: "center",
            // itemTextFormatter: function (e) {
            //     return e.dataPoint.name + ": " + e.dataPoint.y + "(" + (e.dataPoint.y / sum * 100) + ")" + "%";
            // }
        },
        // toolTip: {
        //     cornerRadius: 0,
        //     fontStyle: "normal"
        // },
        data: [{
            type: "doughnut",
            startAngle: 60,
            showInLegend: true,
            legendText: "{name} : {y} (#percent%)",
            innerRadius: 80,
            // indexLabelFontSize: 17,
            // indexLabel: "{label} - #percent%",
            toolTipContent: "<b>{name}:</b> {y} (#percent%)",
            dataPoints: [
                { y: count[0], name: "Information" },
                { y: count[1], name: "Warning" },
                { y: count[2], name: "Error" }
            ]
        }]
    });
    let icon = getCookie("theme_icon");
    checkTheme(icon)
}

function chartPropertiesCustomization(e) {
    if ($(window).outerWidth() >= 1000) {

        chartElog.options.legend.fontSize = 18;
        chartElog.options.legend.horizontalAlign = "right";
        chartElog.options.legend.verticalAlign = "center";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 80;

    } else if ($(window).outerWidth() < 500) {
        // console.log('resize 2')
        chartElog.options.legend.fontSize = 14;
        chartElog.options.legend.horizontalAlign = "center";
        chartElog.options.legend.verticalAlign = "bottom";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 40;

    } else if ($(window).outerWidth() < 992) {

        chartElog.options.legend.fontSize = 14;
        chartElog.options.legend.horizontalAlign = "center";
        chartElog.options.legend.verticalAlign = "bottom";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 60;

    }

    if (e != null) {
        chartElog.render();
    }
}

function createChartEnergy(dataChart) {
    // Highcharts.stockChart('chart_Energy', {
    chartEnergy = Highcharts.stockChart('chart_Energy', {
        rangeSelector: {
            selected: 2
        },
        colors: ['#a9a9a9'],
        // time: {
        //     timezone: 'Asia/Indochina'
        // },

        yAxis: {
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

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
    let icon = getCookie("theme_icon");
    checkTheme(icon)
}

function createChartWorkTime(data) {
    // Highcharts.chart('chart_statusRobot', {
    chartStatusRobot = Highcharts.chart('chart_statusRobot', {
        chart: {
            type: 'area',
            events: {
                load: function () {
                    var series1 = this.series[0];
                    var series2 = this.series[1];
                    // var y1 = series1.data
                    // var y2 = series2.data
                    // console.log('this1', y1)
                    setInterval(function () {
                        // console.log('this2',this)
                        var nowTime = (new Date()).getTime() // current time
                        var _24HoursAgo = nowTime - (24 * 36e5)
                        var y1 = series1.data
                        var y2 = series2.data
                        let i = 1;
                        // console.log(new Date(y2[0].x), y2[0].y)
                        // console.log(new Date(y2[1].x), y2[1].y)

                        while (true) {
                            if (_24HoursAgo > y1[1].x) {
                                // var y1state = y1[0].y;
                                // var y2state = y2[0].y;
                                // console.log('remove')
                                y1[0].remove(true);
                                y2[0].remove(true);
                                i = 0;
                            } else {
                                // console.log('shift')
                                series1.data[0].update([_24HoursAgo, y1[0].y])
                                series2.data[0].update([_24HoursAgo, y2[0].y])
                                // y1[0].x = _24HoursAgo
                                // y2[0].x = _24HoursAgo
                                // if (i = 0) {
                                //     y1[0].x = y1state
                                //     y2[0].x = y2state
                                // }
                                break;
                            }
                        }



                        // console.log(y1)
                        // var y1state = y1[y1.length-1].y;
                        // var y2state = y2[y1.length-1].y;
                        // console.log(nowTime, y1[y1.length - 1].y)

                        // y1[y1.length - 1].x = nowTime
                        // y2[y1.length - 1].x = nowTime

                        series1.addPoint([nowTime, y1[y1.length - 1].y], true, false);
                        series2.addPoint([nowTime, y2[y2.length - 1].y], true, false);
                        // console.log(new Date(y2[0].x), y2[0].y)
                        // console.log(new Date(y2[1].x), y2[1].y)
                        // console.log(y2)
                        y1[y1.length - 2].remove(true);
                        y2[y2.length - 2].remove(true);

                        // series1.addPoint([x, y], true, false);


                        // series1.addPoint([x, y], true, false);
                        // series.data[0].remove(false);
                        // series.data[0].remove(true);
                    }, 60 * 1000);

                }
            }

        },
        title: {
            text: null
        },

        xAxis: {
            // step: 1,
            labels: {
                formatter: function () {

                    function date(nTime) {
                        return new Date(nTime)
                    }
                    function dateForm(nTime) {
                        return date(nTime).getHours() + ':' + date(nTime).getMinutes()
                    }
                    return dateForm(this.value);
                }
            }

        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillOpacity: 1,
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff',
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }

            }

        },
        tooltip: {
            // animation: false,
            formatter: function () {
                function date(nTime) {
                    return new Date(nTime)
                }
                function dateForm(nTime) {
                    return date(nTime).getFullYear() + '-' + (date(nTime).getMonth() + 1) + '-' + date(nTime).getDate()
                        + ' T ' + date(nTime).getHours() + ':' + date(nTime).getMinutes() + ':' + date(nTime).getSeconds()
                }
                return dateForm(this.x) + '<br>' + 'status : ' + '<b>' + this.series.name + '</b>' + '<br>' + this.y;
            }
        },
        series: [
            {
                name: 'run',
                step: true,
                color: '#347FD3',
                data: data[0]

            }
            , {
                name: 'stop',
                step: true,
                color: '#F1C40F',
                data: data[1]

            }

        ]
    });

    let icon = getCookie("theme_icon");
    checkTheme(icon)
}

function stateTimework(data) {
    // console.log('state data', data)
    arrayState = [[], []]
    let oldState = 'stopped';
    let timeA, state;
    let i = 0
    let dateNow = new Date()
    // console.log('data', data.length)
    for (index in data) {
        state = data[index]._state;
        let time_stamp = data[index].time_stamp;
        time_stamp = time_stamp.replace('T', '')
        timeA = new Date(time_stamp)
        // console.log(timeA)

        if (dateNow.getTime() - timeA.getTime() <= (24 * 36e5)) {
            if (i == 0) {
                let Time24HoursAgo = dateNow.getTime() - (24 * 36e5)
                addDataByState(oldState, Time24HoursAgo)
                // addDataByState('running', (dateNow.getTime() - (23.99 * 36e5)))
                // addDataByState('stopped', (dateNow.getTime() - (23.90 * 36e5)))
                i++
            }
            addDataByState(state, timeA.getTime())

        } else {
            oldState = state
        }
    }
    // console.log('State', state)
    if (arrayState[0].length == 0) {
        addDataByState(state, (dateNow.getTime() - (24 * 36e5)))
        // for (k = 23; k >= 1; k--) {
        // addDataByState('running', (dateNow.getTime() - (23.59 * 36e5)))
        // addDataByState(state, (dateNow.getTime() - (23.58 * 36e5)))
        // }
    }
    addDataByState(state, dateNow.getTime())


    // console.log('arrayState', arrayState)
    createChartWorkTime(arrayState)
    // $('#chart_statusRobot').
}

function addDataByState(state, time) {
    // console.log('state',state,'time',time)
    switch (state) {
        case 'running':
            arrayState[0].push([time, 1])
            arrayState[1].push([time, null])
            break;
        case 'stopped':
            arrayState[0].push([time, null])
            arrayState[1].push([time, 1])
            break;
        default:
            break;
    }
}


function _nameRobot(data) {
    let nameRobot = data._embedded._state[1].options[6].option
    let rwVersion = data._embedded._state[0].rwversionname
    let nameController = data._embedded._state[0].name
    // console.log('name robot', nameRobot)
    document.getElementById('nameRobot').innerHTML = nameRobot
    document.getElementById('rwVersion').innerHTML = rwVersion
    document.getElementById('nameController').innerHTML = nameController
}

function showData() {
    // console.log('show')
    count = [0, 0, 0];
    countMess = 0;
    getData('/rw/system?json=1', _nameRobot);
    getData(path[0] + path[1], massageelog);
    getData('/fileservice/$home/docs/data/energy.json', energyChart);
    getData('/fileservice/$home/docs/data/state.json', stateTimework);
    checkState();
    // setInterval(() => {
    //     getData('/fileservice/$home/docs/data/state.json', stateTimework);
    // }, 30*60*1000);

}

function checkState() {
    if (readyState == 0) {
        console.log('Show Page')
        showPage()
    } else {
        setTimeout(checkState, 100);
    }
}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";

    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}

function checkTheme(icon) {
    // console.log(icon)
    // console.log($('#chart_statusRobot').highcharts().options.chart.backgroundColor)
    // console.log(theme)
    if (icon == 'moon') {
        chartElog.options.theme = 'dark2'
        chartElog.options.backgroundColor = '#262626'
        $('#chart_statusRobot').highcharts().update({
            chart: {
                backgroundColor: '#262626'
            },
            legend: {
                itemStyle: {
                    color: '#f0f0f0'
                },
                itemHoverStyle: '#fff'
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            }
        })
        chartEnergy.update({
            chart: {
                backgroundColor: '#262626'
            },
            colors: ['#ff000f'],
            rangeSelector: {
                inputStyle: {
                    color: '#7db8fe',
                    // fontWeight: 'bold'
                },
                labelStyle: {
                    color: '#fff',
                    // fontWeight: 'bold'
                },
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            }
        })
    } else {
        chartElog.options.theme = 'light1'
        chartElog.options.backgroundColor = '#fff'
        $('#chart_statusRobot').highcharts().update({
            chart: {
                backgroundColor: '#fff'
            },
            legend: {
                itemStyle: {
                    color: '#333333'
                },
                itemHoverStyle: '#000'
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#666666'
                    }
                }
            }
        })
        chartEnergy.update({
            chart: {
                backgroundColor: '#fff'
            },
            colors: ['#a9a9a9'],
            rangeSelector: {
                inputStyle: {
                    color: '#426084',
                    // fontWeight: 'bold'
                },
                labelStyle: {
                    color: 'silver',
                    // fontWeight: 'bold'
                },
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#666666'
                    }
                }
            }
        })
        // chartElog.options.legend.color = '#262626'
    }
    // console.log(theme)
    // console.log(chartStatusRobot)
    // $('#chart_statusRobot').highcharts().reflow()
    chartElog.render()
    // console.log(chartStatusRobot)
}

window.onload = function () {
    console.log('DashBoard Page...')
    readyState = 2;

    createChartElog();
    chartPropertiesCustomization(null);
    showData();
    $(window).resize(chartPropertiesCustomization);
    // createChartWorkTime();
}

// $(document).ready(function () {
//     console.log('hi')
// })