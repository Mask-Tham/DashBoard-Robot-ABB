var speed;
var jointtarge_axes = [0, 0, 0, 0, 0, 0];
var Id_axes = [0, 0, 0, 0, 0, 0];
var Axes = [0, 0, 0, 0, 0, 0];
var ctrlstate;
var value;
var Start;
var Opmode, AUTO, MANUAL;
var Motormode, Motor, MOTORON, MOTOROFF, GUARDSTOP;
var RunMode_Data, FOREVER, ONCE, RUN, STOP
var time = 500;
/////New///////
var getdata = 10;
var xhrG = [];
var xhrP = [];
var xhrJ = [];
var mode = [];
var p = 2;
var test;
var k = 1;
var j = 1;
var send;
var chart;
var axis, axis2, range0, range1, label, hand;
var theme_color = '#000'
for (var i = 1; i < getdata + 1; i++) {
    xhrP[i] = new XMLHttpRequest;
}
/**Start Range Speed**/
function showValue1(newValue) {
    document.getElementById('SpeedRatio').innerHTML = newValue;
}
function Post(url, send, k) {
    xhrP[k].open('POST', url, true);
    xhrP[k].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhrP[k].send(send);
}
function Postspeed(val, P) {
    if (P == 'Post') {
        if (Opmode == 'MANR' || Motormode == 'motoroff') {
            WebErrors();
        }
        else {
            document.getElementById('range').value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
            url = '/rw/panel/speedratio?action=setspeedratio';
            send = 'speed-ratio=' + val;
            Post(url, send, 1);
            showValue1(val)
        }
    }
    if (P == 'Non Post') {
        document.getElementById('range').value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
        showValue1(val)
    }
}
function StartXHR() {
    if (Opmode == 'MANR' || Motormode == 'motoroff') {
        WebErrors();
    }
    else {
        url = '/rw/rapid/execution?action=start';
        send = 'regain=continue&execmode=continue&cycle=' + Start + '&condition=none&stopatbp=disabled&alltaskbytsp=false'
        Post(url, send, 2);
    }
}
function StopXHR() {
    if (Opmode == 'MANR' || Motormode == 'motoroff') {
        WebErrors();
    }
    else {
        url = '/rw/rapid/execution?action=stop';
        send = 'stopmode=stop&usetsp=normal'
        Post(url, send, 3);
    }
}
function ResetXHR() {
    if (Opmode == "MANR" || Motormode == "motoroff") {
        WebErrors();
    }
    else {
        url = '/rw/rapid/execution?action=resetpp'
        send = 'None'
        Post(url, send, 4);
    }
}
function MotorModexhr() {
    if (Opmode == "MANR") {
        WebErrors();
        var isChecked = document.getElementById("toggle-1").checked;
        if (isChecked) {
            $('.toggle-1_input').prop('checked', false).change();
        }
        else {
            console.log("off")
            $('.toggle-1_input').prop('checked', true).change();
        }
    }
    else {
        var isChecked = document.getElementById("toggle-1").checked;
        if (isChecked) {
            url = '/rw/panel/ctrlstate?action=setctrlstate'
            send = 'ctrl-state=motoroff'
            Post(url, send, 5);

        } else {
            url = '/rw/panel/ctrlstate?action=setctrlstate'
            send = 'ctrl-state=motoron'
            Post(url, send, 6);
        }
    }
}
/** Run Mode continuous */
function RunModexhr() {
    if (Opmode == "MANR") {
        WebErrors();
        var isChecked = document.getElementById("toggle-2").checked;
        if (isChecked) {
            $('.toggle-2_input').prop('checked', false).change();
        }
        else {
            console.log("off")
            $('.toggle-2_input').prop('checked', true).change();
        }
    }
    else {
        var isChecked = document.getElementById("toggle-2").checked;
        if (isChecked) {
            url = '/rw/rapid/execution?action=setcycle'
            send = 'cycle=once'
            Post(url, send, 7)
        } else {
            url = '/rw/rapid/execution?action=setcycle'
            send = 'cycle=forever'           
            Post(url, send, 8)
        }
    }
}
function WebErrors() {
    if (Opmode == 'MANR') {
        text = '" Manual Mode "'
    }
    if (Motormode == 'motoroff') {
        text = '" Motors OFF "'
    }
    setTimeout(function () {
        swal({
            title: "ERROR",
            confirmButtonColor: "#ff000f",
            text: 'The command is not allowed in ' + text,
            type: "error"
        }, function () {

        });
    }, 50);
}

function Value_Speed(Value_sp) {
    value = Number(Value_sp);
    Postspeed(value, 'Non Post')
    return value;
}

function robottype(robotname) {
    document.getElementById("Robot-name").innerHTML = "Robot version " + robotname
}
/**jointtarge_axes**/
function joint() {
    xhrJ[j] = new XMLHttpRequest;
    xhrJ[j].open('GET', '/rw/motionsystem/mechunits/ROB_1/jointtarget?json=1', true);
    xhrJ[j].onreadystatechange = function () {
        if (xhrJ[j].readyState == 4 && xhrJ[j].status == 200) {
            var obj = JSON.parse(xhrJ[j].responseText);
            for (var i = 0; i < jointtarge_axes.length; i++) {
                var json = ('rax_' + (i + 1));
                jointtarge_axes[i] = parseFloat(obj._embedded._state[0][json]).toFixed(2);
                Id_axes[i] = ("RangeAxes" + (i + 1))
                Axes[i] = ("Axis" + (i + 1))
                document.getElementById(Id_axes[i]).value = isNaN(parseInt(jointtarge_axes[i], 10)) ? 0 : parseInt(jointtarge_axes[i], 10);
                document.getElementById(Axes[i]).innerHTML = jointtarge_axes[i];
            }
            xhrJ[j].abort();
            xhrJ = [];
            j = j + 1;
        }

    }
    xhrJ[j].send(null);
}

/** Mode**/
//Blink//
function Optionmode(data) {
    Opmode = data;
    clearInterval(MANUAL);
    console.log('mode')
    if (Opmode == "AUTO") {
        document.getElementById("mode").innerHTML = 'Auto';
    }
    if (Opmode == "MANR") {
        document.getElementById("mode").innerHTML = 'Manual';
    }
    return Opmode;
}
function motormode(motor) {
    Motormode = motor;
    if (Motormode == "motoron") {
        
        document.getElementById("mortor").innerHTML = 'On';
        document.getElementById("toggle-1").checked = false;
        $('.toggle-1_input').prop('checked', false).change();
    }
    else {
        document.getElementById("mortor").innerHTML = 'Off';
        document.getElementById("toggle-1").checked = true;
        $('.toggle-1_input').prop('checked', true).change();
    }
    return Motormode;
}
/** execution_state**/
function workingstatus(status) {
    if (status == "running") {
        document.getElementById("Execution").innerHTML = 'Running';
    }
    else {
        document.getElementById("Execution").innerHTML = 'Stop';
    }
}
function runmode(RunMode_Data) {
    if (RunMode_Data == "forever") {
        document.getElementById("runmode").innerHTML = 'Continuous';
        document.getElementById("toggle-2").checked = false;
        $('.toggle-2_input').prop('checked', false).change();
        Start = "forever";
    }
    else {
        document.getElementById("runmode").innerHTML = 'Single Cycle';
        document.getElementById("toggle-2").checked = true;
        $('.toggle-2_input').prop('checked', true).change();
        Start = "once";
    }
    return Start;
}
/** Speed Ratio**/
function Speed_Ratiofunc(data) {
    Speed = data._embedded._state[0].speedratio;
    // Value_Speed(Speed)
    value = Number(Speed);
    changeRangeValue(value, 'Non Post')
    return value;
}
/**joint targe**/
function showjointtarget() {
    getdata('/rw/motionsystem/mechunits/ROB_1/jointtarget?json=1', jointtargetfunc);
}
function Get(url, json) {
    // console.log(k)
    xhrG[k] = new XMLHttpRequest;
    xhrG[k].open('GET', url, true);
    xhrG[k].onreadystatechange = function () {
        if (xhrG[k].readyState == 4 && xhrG[k].status == 200) {
            var obj = JSON.parse(xhrG[k].responseText);
            mode[k] = obj._embedded._state[0][json];
            xhrG[k].abort()
            // console.log(json)
            switch (json) {
                case ('robot-type'):
                    robottype(mode[k]);
                    break;
                case ('speedratio'):
                    Value_Speed(mode[k]);
                    break;
                case ('ctrlstate'):
                    motormode(mode[k]);
                    break;
                case ('cycle'):
                    runmode(mode[k]);
                    break;
                case ('opmode'):
                    Optionmode(mode[k]);
                    break;
                case ('ctrlexecstate'):
                    workingstatus(mode[k]);
                    break;
            }
            k++;
        }
    }
    xhrG[k].send(null);
    if (k => 4) {
        showPage()
    }
    // k++;
}
function Getdata(type) {
    // console.log(type)
    switch (type) {
        case ('robot type'):
            url = '/rw/system/robottype?json=1';
            json = "robot-type";
            Get(url, json);
            break;
        case ('speed ratio'):
            url = '/rw/panel/speedratio?json=1';
            json = "speedratio";
            Get(url, json);
            break;
        case ('motor mode'):
            url = '/rw/panel/ctrlstate?json=1';
            json = "ctrlstate";
            Get(url, json,);
            break;
        case ('run mode'):
            url = '/rw/rapid/execution?json=1';
            json = "cycle";
            Get(url, json);
            break;
        case ('option mode'):
            url = '/rw/panel/opmode?json=1';
            json = "opmode";
            Get(url, json);
            break;
        case ('working status'):
            url = '/rw/rapid/execution?json=1';
            json = "ctrlexecstate";
            Get(url, json);
            break;
    }
}
//--gauge speed--//
function gauge() {
    console.log("valueG" + value)
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // create chart
        chart = am4core.create("chartdiv", am4charts.GaugeChart);
        chart.innerRadius = am4core.percent(88);

        /**
         * Normal axis
         */

        // var axis = chart.xAxes.push(new am4charts.ValueAxis());
        // axis.min = 0;
        // axis.max = 100;
        // axis.strictMinMax = true;
        // axis.renderer.radius = am4core.percent(80);
        // axis.renderer.inside = true;
        // axis.renderer.line.strokeOpacity = 1;
        // axis.renderer.ticks.template.disabled = false
        // axis.renderer.ticks.template.strokeOpacity = 1;
        // axis.renderer.ticks.template.length = 2;
        // axis.renderer.grid.template.disabled = true;
        // axis.renderer.labels.template.radius = "28%";
        // // axis.renderer.labels.template.fill=am4core.color('#ff000f');
        // axis.renderer.labels.template.adapter.add("text", function (text) {
        //     return text;
        // })

        axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = 0;
        axis.max = 100;
        axis.strictMinMax = true;
        axis.renderer.radius = am4core.percent(80);
        axis.renderer.inside = true;
        axis.renderer.line.strokeOpacity = 1;
        
        axis.renderer.ticks.template.disabled = false
        axis.renderer.ticks.template.strokeOpacity = 1;
        axis.renderer.ticks.template.length = 2;
        axis.renderer.line.strokeWidth = 1;
        axis.renderer.line.stroke = am4core.color("#ff000f");
        axis.renderer.ticks.template.strokeWidth = 1;
        axis.renderer.ticks.template.stroke = am4core.color("#ff000f");
        axis.renderer.grid.template.disabled = true;
        axis.renderer.labels.template.radius = "28%";
        axis.renderer.labels.template.fill=am4core.color('#ff000f');
        axis.renderer.labels.template.adapter.add("text", function (text) {
            return text;
        })
        /**
         * Axis for ranges
         */

        // var colorSet = new am4core.ColorSet();

        axis2 = chart.xAxes.push(new am4charts.ValueAxis());
        axis2.min = 0;
        axis2.max = 100;
        axis2.strictMinMax = true;
        axis2.renderer.labels.template.disabled = true;
        axis2.renderer.ticks.template.disabled = true;
        axis2.renderer.grid.template.disabled = true;

        range0 = axis2.axisRanges.create();
        range0.value = 0;
        range0.endValue = 50;
        range0.axisFill.fillOpacity = 1;
        range0.axisFill.fill = am4core.color('#ff000f');

        range1 = axis2.axisRanges.create();
        range1.value = 50;
        range1.endValue = 100;
        range1.axisFill.fillOpacity = 1;
        range1.axisFill.fill = am4core.color('#9a9a9a');

        /**
         * Label
         */

        label = chart.radarContainer.createChild(am4core.Label);
        label.isMeasured = false;
        label.fontSize = 36;
        label.x = am4core.percent(40);
        label.y = am4core.percent(100);
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.text = "50%";
        // label.fill = am4core.color(theme_color);


        /**
         * Hand
         */

        hand = chart.hands.push(new am4charts.ClockHand());
        hand.axis = axis2;
        hand.innerRadius = am4core.percent(50);
        hand.startWidth = 4;
        hand.pin.disabled = true;
        hand.value = 0;
        // hand.fill = am4core.color("#9a9a9a");
        // hand.stroke = am4core.color("#9a9a9a");

        hand.events.on("propertychanged", function (ev) {
            range0.endValue = ev.target.value;
            range1.value = ev.target.value;
            label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
            axis2.invalidate();
        });

        setInterval(function () {

            var animation = new am4core.Animation(hand, {
                property: "value",
                to: value
            }, 300, am4core.ease.cubicOut).start();
        }, 50);

    }); // end am4core.ready()
}

function checkTheme(icon) {
    let r = document.querySelector(':root');
    // console.log($('#chartdiv'.style))
    console.log(chart)
    if (icon == 'moon') {
        r.style.setProperty('--toggle-base-color', '#6e6e6e');
        r.style.setProperty('--card-head-color', '#262626');
        r.style.setProperty('--speed-color', '#fff');
        // theme_color = '#fff'
        // chart.Themes(am4themes_dark);
        axis.renderer.line.strokeWidth = 1;
        axis.renderer.line.stroke = am4core.color("#fff");
        axis.renderer.ticks.template.strokeWidth = 1;
        axis.renderer.ticks.template.stroke = am4core.color("#fff");
        axis.renderer.labels.template.fill=am4core.color('#fff');
        label.fill = am4core.color('#fff');
        hand.fill = am4core.color("#fff");
        hand.stroke = am4core.color("#fff");

    } else {
        r.style.setProperty('--toggle-base-color', '#efefef');
        r.style.setProperty('--card-head-color', '#fafafa');
        r.style.setProperty('--speed-color', '#262626');
        // theme_color = '#000'
        // chart.Themes(am4themes_dark);
        // am4core.useTheme(am4themes_animated);
        axis.renderer.line.strokeWidth = 1;
        axis.renderer.line.stroke = am4core.color("#000");
        axis.renderer.ticks.template.strokeWidth = 1;
        axis.renderer.ticks.template.stroke = am4core.color("#000");
        axis.renderer.labels.template.fill=am4core.color('#000');
        label.fill = am4core.color('#000');
        hand.fill = am4core.color("#000");
        hand.stroke = am4core.color("#000");
    }
}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";

    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}


// window.location.reload(true);
function myFunction() {
    // Post('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/manual?action=set', 'value=\"no"', 8);
    //Send run to jogging
    Post('/rw/rapid/execution', "action=resetpp", 10);
    for (var n = 1; n <= 7 + 1; n++) {
        (function (n) {
            setTimeout(function () {

                // if (n == 1) {
                //     Getdata('robot type')
                // }
                if (n == 1) {
                    // joint();
                    setInterval(joint, 50);
                }
                if (n == 2) {
                    Getdata('option mode')
                }
                if (n == 3) {
                    Getdata('motor mode')
                }
                if (n == 4) {
                    Getdata('speed ratio')
                }
                if (n == 5) {
                    Getdata('run mode')
                }
                if (n == 6) {
                    Getdata('working status')
                }
                // console.log("N ", n)
            }, 100 * n);
        })(n);
    };
    gauge();

}

