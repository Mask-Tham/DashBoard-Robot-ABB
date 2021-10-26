var countELog = [0, 0, 0];
var msgtype;
var dateStart = null
var dateEnd = null
var indexChartColor = 0;
var countMess;
var indexLast;
var x = 1;
var path = ['/rw/elog/0', '?lang=en&json=1', '?order=lifo&lang=en&start=', '&limit=50&json=1'];
var showList, showType;
var chartElog;
var jData = {}
var arData = []
var sum = '0';
var show = 0;

// get data with ajex
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
                    getData(urlPath, eventfunc)
                }
                    , 50)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });

}

// check last index of elog link and read show list
function checkIndexMess(data) {
    showList = document.getElementById('showList').value
    showType = document.getElementById('showType').value
    n_link = data._links.last
    // console.log('n_link', n_link)
    if (n_link === undefined) {
        // console.log('undefined')

        indexLast = 1
    }
    else {
        indexLast = data._links.last.href.replace('0?order=lifo&lang=en&start=', '')
        indexLast = indexLast.replace('&limit=50&json=1', '')
    }

    showMassage()

}

// manage data 
function massageelog(data) {
    // console.log("code",data._embedded._state[0].code)
    let elog = data._embedded._state;
    if (show == 0) {
       showPage(); 
       show++
    }
    for (var k in elog) {
        msgtype = elog[k].msgtype;
        code1 = elog[k].code;
        tstamp1 = elog[k].tstamp;
        title1 = elog[k].title;
        desc1 = elog[k].desc;
        conseqs1 = elog[k].conseqs;
        causes1 = elog[k].causes;
        actions1 = elog[k].actions;

        // check date of elog with date select
        var time = TimeDriff(dateStart, dateEnd, tstamp1);
        // console.log("k",k)
        if (time == true && sum < showList) {
            // console.log("msgtype",msgtype,'showType',showType)
            if (msgtype == showType || showType == '0') {
                console.log('true')
                switch (msgtype) {
                    case '1':
                        var type1 = 'information'
                        ++countELog[0];
                        break;
                    case '2':
                        var type1 = 'warning'
                        ++countELog[1];
                        break;
                    case '3':
                        var type1 = 'error'
                        ++countELog[2];
                        break;
                    default:
                        break;
                }

                var tctt = [type1, code1, title1, tstamp1]
                var dcca = [desc1, conseqs1, causes1, actions1]

                // create block elog
                createElementBlock(tctt, dcca, msgtype);
                jData = {}
                jData['time stamp'] = tstamp1
                jData['message type'] = type1
                jData['code'] = code1
                jData['title'] = title1
                jData['description'] = desc1
                jData['consequences'] = conseqs1
                jData['causes'] = causes1
                jData['actions'] = actions1

                // console.log('jData', jData, typeof (jData))

                arData.push(jData)

                sum = countELog.reduce(function (a, b) {
                    return a + b;
                }, 0)
            }

        }
        else {
            console.log('false')
        }
        if (sum == showList) {
            console.log('sum == showList')
            renderChart();
            break;

        }else if (k == elog.length - 1) {
            x++
            console.log('x', x)
            if (x <= indexLast) {
                forPath(x);
            }
            else {
                console.log('x <= indexLast')
                if (sum > 0) {
                    renderChart();
                }
                break;
            }
        }

    }
}

// collapsible for elog block
// function collapsible() {
//     var coll = document.getElementsByClassName("collapsible");
//     var i;
//     console.log('col ', coll.length);
//     for (i = 0; i < coll.length; i++) {
//         coll[i].addEventListener("click", function () {
//             this.classList.toggle("collapsible-active");
//             var content = this.nextElementSibling;
//             if (content.style.maxHeight) {
//                 content.style.maxHeight = null;
//                 content.style.border = null;
//             } else {
//                 content.style.maxHeight = content.scrollHeight + "px";
//                 content.style.borderWidth = 1 + 'px';
//             }

//         });
//     }
// }

// // change color block elog
// function collapsibleColor() {
//     var blo = document.getElementsByClassName("block");
//     console.log('block ', blo.length);
//     for (var i = 0; i < blo.length; i++) {

//         if (msgtype[i] == '1') {
//             blo[i].classList.toggle('block-info')
//         }
//         else if (msgtype[i] == '2') {
//             blo[i].classList.toggle('block-warn')
//         }
//         else if (msgtype[i] == '3') {
//             blo[i].classList.toggle('block-error')
//         }

//     }
// }

// function create block elog
function createElementBlock(for1, for2, type) {
    var tree = document.createDocumentFragment();
    var div_block = document.createElement("div");
    div_block.setAttribute("class", "block");

    var collapsibletag = document.createElement("button");
    collapsibletag.setAttribute("class", "collapsible");

    var classspan = ['elog-type', 'elog-code', 'elog-title', 'elog-time']
    var titleh4 = ['Description', 'Consequences', 'Causes', 'Actions']

    var div_content = document.createElement('div');
    div_content.setAttribute('class', 'content');

    for (var i = 0; i < 4; i++) {
        var span = document.createElement("span");
        span.setAttribute('class', classspan[i]);
        span.appendChild(document.createTextNode(for1[i]));
        collapsibletag.appendChild(span)
    }

    for (var i = 0; i < 4; i++) {
        var h4 = document.createElement('h4');
        var p = document.createElement('p');

        if (for2[i].length > 0) {
            h4.appendChild(document.createTextNode(titleh4[i]));
            p.appendChild(document.createTextNode(for2[i]));
        }
        else {
            h4.appendChild(document.createTextNode(''));
            p.appendChild(document.createTextNode(''));
        }

        div_content.appendChild(h4)
        div_content.appendChild(p)
    }

    if (type == '1') {
        div_block.classList.toggle('block-info')
    }
    else if (type == '2') {
        div_block.classList.toggle('block-warn')
    }
    else if (type == '3') {
        div_block.classList.toggle('block-error')
    }

    collapsibletag.addEventListener("click", function () {
        // console.log(this)
        this.classList.toggle("collapsible-active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            content.style.border = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.borderWidth = 1 + 'px';
        }

    });

    div_block.appendChild(collapsibletag);
    div_block.appendChild(div_content);
    tree.appendChild(div_block);
    document.getElementById("mess").appendChild(tree);
}

// function select date
$(function () {

    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        dateStart = picker.startDate.format('DD/MM/YYYY')
        dateEnd = picker.endDate.format('DD/MM/YYYY')
        // TimeDriff(dateStart, dateEnd, '2020-11-03');
        showMassage();

    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        dateStart = null
        dateEnd = null
        showMassage();
    });

});

// function check date
function TimeDriff(st, en, dM) {
    var diff;
    var start = new Array(3);
    var end = new Array(3);
    var Mess = new Array(3);

    if (st == null | en == null) {
        return true
    }

    start[0] = st.substr(0, 2);
    start[1] = st.substr(3, 2);
    start[2] = st.substr(6, 4);

    end[0] = en.substr(0, 2);
    end[1] = en.substr(3, 2);
    end[2] = en.substr(6, 4);

    Mess[0] = dM.substr(8, 2);
    Mess[1] = dM.substr(5, 2);
    Mess[2] = dM.substr(0, 4);

    end[1] -= 1;
    start[1] -= 1;
    Mess[1] -= 1;

    StartDate = new Date(start[2], start[1], start[0]);
    EndDate = new Date(end[2], end[1], end[0]);
    MessDate = new Date(Mess[2], Mess[1], Mess[0]);

    // StartDate.setDate(start[0]);
    // StartDate.setMonth(start[1]);
    // StartDate.setFullYear(start[2]);

    // EndDate.setDate(end[0]);
    // EndDate.setMonth(end[1]);
    // EndDate.setFullYear(end[2]);

    // MessDate.setDate(Mess[0]);
    // MessDate.setMonth(Mess[1]);
    // MessDate.setFullYear(Mess[2]);
    // console.log('StartDate',StartDate.getTime())

    if (StartDate.getTime() <= MessDate.getTime() & MessDate.getTime() <= EndDate.getTime()) {
        diff = EndDate.getTime() - StartDate.getTime();
        diff = Math.floor(diff / (1000 * 60 * 60 * 24));
        return true
    }
    else {
        return false
    }
}


CanvasJS.addColorSet("elogShades",
    [//colorSet Array

        "#347FD3",
        "#E7E011",
        "#DA1111",
        "#BDBDBD"
    ]);

function showMassage() {
    console.log('showMassage')
    countELog = [0, 0, 0];
    sum = 0;
    document.getElementById("mess").innerHTML = '';
    console.log('indexLast is', indexLast)
    console.log('showList', showList)
    console.log('showType', showType)
    countMess = 0;
    arData = []
    x = 1;
    forPath(x);

}


function forPath(x) {
    console.log(x)
    if (x <= indexLast) {
        // setTimeout(function() {
        getData(path[0] + path[2] + x + path[3], massageelog);
        // }, 100);
    }
}

// render chart
function renderChart() {
    for (var i = 0; i < countELog.length; i++)
        chartElog.options.data[0].dataPoints[i].y = countELog[i];
    chartElog.render();
}

$(function () {
    $('#showList').change(function () {
        showList = this.value
        showMassage();
        // console.log('show ', showList)
    });
    $('#showType').change(function () {
        showType = this.value
        showMassage();
        // console.log('show ', showList)
    });
});

function exportTableToExcel() {
    let ws_data = arData
    let ws = XLSX.utils.json_to_sheet(ws_data);

    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS Event Log",
        Subject: "Elog",
        Author: "Mask T.",
        CreatedDate: new Date
    };

    wb.SheetNames.push("Event Log Sheet");
    wb.Sheets["Event Log Sheet"] = ws;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Event Log.xlsx');

}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function myFunction() {
    setTimeout(showPage, 3000);
}

function showPage() {
    console.log('show page')
    document.getElementById("coverLoading").style.display = "none";
    // chartPropertiesCustomization();
    // console.log('show page')
    if (indexChartColor == 1) {
        $.getScript('./script/theme.js', function () {
            let icon = getCookie("theme_icon");
            changeThemeChart(icon);
        });
        indexChartColor = 0;
    }
}

function chartPropertiesCustomization(e) {
    // console.log(e)
    if ($(window).outerWidth() >= 1000) {
        // console.log('resize 1')
        chartElog.options.legend.fontSize = 20;
        chartElog.options.legend.horizontalAlign = "right";
        chartElog.options.legend.verticalAlign = "center";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 80;

    } else if ($(window).outerWidth() < 500) {
        // console.log('resize 2')
        chartElog.options.legend.fontSize = 16;
        chartElog.options.legend.horizontalAlign = "center";
        chartElog.options.legend.verticalAlign = "bottom";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 40;

    }
    else if ($(window).outerWidth() < 992) {
        // console.log('resize 3')
        chartElog.options.legend.fontSize = 16;
        chartElog.options.legend.horizontalAlign = "center";
        chartElog.options.legend.verticalAlign = "bottom";
        chartElog.options.legend.maxWidth = null;
        chartElog.options.data[0].innerRadius = 60;

    }

    // console.log('resize')
    if (e != null) {
        chartElog.render();
    }
    // console.log('resize')
}

function checkTheme(icon) {
    console.log(icon)
    if (icon == 'moon') {
        chartElog.options.theme = 'dark2'
        chartElog.options.backgroundColor = '#262626'
        $('.block.block-info').css('background', '#adadad')
        $('.block.block-info .collapsible').css('background', '#adadad')
        $('.block.block-info .collapsible').hover(function(){
            $(this).css("background", "#6E6E6E");
        },function(){
            $(this).css("background", "#adadad");
        })
        $('.block.block-info .content ').css('background', '#adadad')

    } else {
        chartElog.options.theme = 'light1'
        chartElog.options.backgroundColor = '#fff'
        $('.block.block-info').css('background', '#fff')
        $('.block.block-info .collapsible').css('background', '#fff')
        $('.block.block-info .collapsible').hover(function(){
            $(this).css("background", "#E4F1FF");
        },function(){
            $(this).css("background", "#fff");
        })
        $('.block.block-info .content ').css('background', '#fff')
    }
    console.log(chartElog)
    chartElog.render()
}

window.onload = function () {
    chartElog = new CanvasJS.Chart("chart_Elog", {
        colorSet: 'elogShades',
        theme: 'light1', // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        legend: {
            // reversed: true,
            // fontFamily: "calibri",
            fontSize: 24,
            horizontalAlign: "right",
            verticalAlign: "center",
            // dockInsidePlotArea: true,
            // itemTextFormatter: function (e) {
            //     return e.dataPoint.name + ": " + e.dataPoint.y + "(" + (e.dataPoint.y / sum * 100) + ")" + "%";
            // }

        },
        // title: {
        // 	dockInsidePlotArea: true,
        // 	fontSize: 55,
        // 	fontWeight: "normal",
        // 	horizontalAlign: "center",
        // 	verticalAlign: "center",
        // 	text: sum
        // },
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
                { y: countELog[0], name: "Information" },
                { y: countELog[1], name: "Warning" },
                { y: countELog[2], name: "Error" }
            ]
        }]
    });
    indexChartColor = 1;
    chartPropertiesCustomization(null);
    // setTimeout(function() {
    getData(path[0] + path[1], checkIndexMess);
    $(window).resize(chartPropertiesCustomization);
    console.log('inload')
    // },100);
    // getData(path[0] + path[1], checkIndexMess);
    // myFunction();
}