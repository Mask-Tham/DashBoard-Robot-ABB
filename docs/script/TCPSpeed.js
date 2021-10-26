var TCP;

function showPage() {
    console.log('show page')
    document.getElementById("coverLoading").style.display = "none";
    // chartPropertiesCustomization();
    // console.log('show page')
    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}

function checkTheme(icon) {
    if (icon == 'moon') {
        $('#container').highcharts().update({
            chart: {
                backgroundColor: '#262626'
            },
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
        $('#container').highcharts().update({
            chart: {
                backgroundColor: '#fff'
            },
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
    }
}

function getdata(urlpath, eventfunc) {
    $.ajax({
        url: urlpath,
        dataType: 'json'
    }).done(eventfunc);
}

function TCP_Speed() {
    getdata('/rw/iosystem/signals/Local/AI/TCP_Speed?json=1', TCP_Speedfunc);
}
function TCP_Speedfunc(data) {
    TCP = data._embedded._state[0].lvalue;
    TCP = Number(TCP) * 1000
    return TCP;
}

/**-Get-**/
window.onload = function () {

    // function sidebarToggleOnClick() {
    //     $('#sidebar-toggle-button').on('click', function () {
    //         $('#sidebar').toggleClass('sidebar-toggle');
    //         $('#page-content-wrapper').toggleClass('page-content-toggle');
    //     });
    // }
    Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = TCP;
                        series.addPoint([x, y], true, true);
                    }, 100);
                }
            }
        },

        time: {
            useUTC: false
        },

        rangeSelector: {
            buttons: [{
                count: 0.5,
                type: 'minute',
                text: '30s.'
            }, 
            {
                count: 1,
                type: 'minute',
                text: '1min.'
            },
            {
                count: 5,
                type: 'minute',
                text: '5min.'
            },
            {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        },

        title: {
            text: ''
        },
        tooltip: {
            shared: true,
            valueSuffix: ' mm/s'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text:'Time'
            }
        },
        yAxis: {
            labels: {
                format: '{value} V'
            }
        },
        series: [{
            name: 'Speed',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(), i;

                for (i = -3000; i <= 0; i += 1) {
                    data.push([
                        time + i * 1000,0
                    ]);
                }
                return data;
            }()),
            // color: Highcharts.getOptions().colors[5],
            color: '#ff000f',
            type: 'areaspline'

        }]

    });
    setInterval(TCP_Speed, 100);
    showPage();
    // sidebarToggleOnClick();
};







