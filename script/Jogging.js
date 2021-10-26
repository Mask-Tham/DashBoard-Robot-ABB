var A, B, C;
var value;
var OldInputTool, OldInputWobj;
var Search;
var xhrP = [];
var xhrG = [];
var xhrJ = [];
var xhru_j = [];
var Upper_Lower_Joint_Bound = [];
var Cal_Upper_Lower_Joint_Bound = [];
var mode = [];
var motion_axis;
var jointtarge_axes = [0, 0, 0, 0, 0, 0];
var Id_axis = [0, 0, 0, 0, 0, 0];
var Axis = [0, 0, 0, 0, 0, 0];
var k = 1;
var p = 1;
var j = 1;
// for (var i = 1; i < 17 + 1; i++) {
//     xhrP[i] = new XMLHttpRequest;
// }
function motion_mode(data) {
    motion_axis = data;
    switch (motion_axis) {
        case ('Axis 1-3'):
            A = '2'; B = '1'; C = '3';
            break;
        case ('Axis 4-6'):
            A = '5'; B = '4'; C = '6';
            break;
        case ('Linear'):
            A = 'X'; B = 'Y'; C = 'Z'
            break;
    }
    document.getElementById("text1").innerHTML = A
    document.getElementById("text2").innerHTML = B
    document.getElementById("text3").innerHTML = C
    return (motion_axis);
}
function c_click(data) {
    condition_click = data + '_' + motion_axis;
    String(condition_click)
    var urlclick = '/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/click?action=set';
    var sendclick = 'value=\"click"'
    PostJ(urlclick, sendclick);
    url = '/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/condition_click?action=set';
    switch (condition_click) {
        //---------up-----------//
        case 'up_Axis 1-3':
            send = 'value=\"up_Ax2"';
            break;
        case 'up_Axis 4-6':
            send = 'value=\"up_Ax5"';
            break;
        case 'up_Linear':
            send = 'value=\"up_X"';
            break;
        //---------down-----------//
        case 'down_Axis 1-3':
            send = 'value=\"down_Ax2"';
            break;
        case 'down_Axis 4-6':
            send = 'value=\"down_Ax5"';
            break;
        case 'down_Linear':
            send = 'value=\"down_X"';
            break;
        //---------left-----------//
        case 'left_Axis 1-3':
            send = 'value=\"left_Ax1"';
            break;
        case 'left_Axis 4-6':
            send = 'value=\"left_Ax4"';
            break;
        case 'left_Linear':
            send = 'value=\"left_Y"';
            break;
        //---------right-----------//
        case 'right_Axis 1-3':
            send = 'value=\"rigth_Ax1"';
            break;
        case 'right_Axis 4-6':
            send = 'value=\"rigth_Ax4"';
            break;
        case 'right_Linear':
            send = 'value=\"right_Y"';
            break;
        //---------up-right-----------//
        case 'up-right_Axis 1-3':
            send = 'value=\"up-right_Ax3"';
            break;
        case 'up-right_Axis 4-6':
            send = 'value=\"up-right_Ax6"';
            break;
        case 'up-right_Linear':
            send = 'value=\"up-right_Z"';
            break;
        //---------left-----------//
        case 'down-left_Axis 1-3':
            send = 'value=\"down-left_Ax3"';
            break;
        case 'down-left_Axis 4-6':
            send = 'value=\"down-left_Ax6"';
            break;
        case 'down-left_Linear':
            send = 'value=\"down-left_Z"';
            break;
        case ('Run_Joint_Tagrt_Axis 1-3'):
            send = 'value=\"Run_Joint_Tagrt"';
            break;
        case ('Run_Joint_Tagrt_Axis 4-6'):
            send = 'value=\"Run_Joint_Tagrt"';
            break;
        case ('Run_Joint_Tagrt_Linear'):
            send = 'value=\"Run_Joint_Tagrt"';
            break;
        default:
            send = 'value=\"home"';
            break;
    }
    PostJ(url, send);
}
function PostJ(url, send) {
    xhrP[p] = new XMLHttpRequest;
    xhrP[p].open('POST', url, true);
    xhrP[p].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhrP[p].send(send);
    p = p + 1;

}
function showValue1(newValue) {
    document.getElementById('SpeedRatio').innerHTML = newValue;
}
function Postspeed(val, P) {
    if (P == 'Non Post') {
        document.getElementById('range').value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    }
    else {
        document.getElementById('range').value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
        url = '/rw/panel/speedratio?action=setspeedratio';
        send = 'speed-ratio=' + val;
        PostJ(url, send);
    }

    showValue1(val)
}
function Value_Speed(Value_sp) {
    value = Number(Value_sp);
    Postspeed(value, 'Non Post')
    showPage()
    return value;
}
function GetJogging(url, json) {
    xhrG[k] = new XMLHttpRequest;
    xhrG[k].open('GET', url, true);
    xhrG[k].onreadystatechange = function () {
        if (xhrG[k].readyState == 4 && xhrG[k].status == 200) {
            var obj = JSON.parse(xhrG[k].responseText);
            mode[k] = obj._embedded._state[0][json];
            xhrG[k].abort()
            switch (json) {
                case ('speedratio'):
                    Value_Speed(mode[k]);
                    break;
                case ('value'):
                    console.log("value")
                    Searchfunc(mode[k]);
                    break;

            }
            k = k + 1;
        }
    }
    xhrG[k].send(null);

}
function Searchfunc(data) {
    console.log("data " + data)
    if (data == "1") {
        Search = 'true';
        console.log("Search888  " + Search);
    }
    if (data == "0") {
        Search = 'false';
        console.log("Search888 " + Search);
    }
    return Search;
}
function Getdata(type) {
    switch (type) {
        case ('robot type'):
            url = '/rw/system/robottype?json=1';
            json = "robot-type";
            GetJogging(url, json);
            break;
        case ('speed ratio'):
            url = '/rw/panel/speedratio?json=1';
            json = "speedratio";
            GetJogging(url, json);
            break;
    }
}
function upper_lower_joint(data, i) {
    var data, i, atb, array;
    switch (data) {
        case ('upper'):
            atb = 10;
            array = 0;
            break;
        case ('lower'):
            atb = 11;
            array = 6;
            break;
    }
    xhru_j[(i + array)] = new XMLHttpRequest;
    xhru_j[(i + array)].open('GET', '/rw/cfg/MOC/ARM/instances/rob1_' + i + '?json=1=1&fbclid', true);
    xhru_j[(i + array)].onreadystatechange = function () {
        if (xhru_j[(i + array)].readyState == 4 && xhru_j[(i + array)].status == 200) {
            var obj = JSON.parse(xhru_j[(i + array)].responseText);
            Upper_Lower_Joint_Bound[(i + array)] = parseFloat(obj._embedded._state[0].attrib[atb].value)
            Cal_Upper_Lower_Joint_Bound[(i + array)] = cal_upper_lower_joint(Upper_Lower_Joint_Bound[(i + array)], (i + array))
        }
        if (xhru_j[(i + array)].readyState == 4 && xhru_j[(i + array)].status == 503) {
            setTimeout(function () {
                upper_lower_joint((i + array));
            }, 100)
        }
    }
    xhru_j[(i + array)].send(null);
}
function cal_upper_lower_joint(data, i) {
    var i, data;
    Upper_Lower_Joint_Bound[i] = data;
    Upper_Lower_Joint_Bound[i] = Number(Upper_Lower_Joint_Bound[i])
    Upper_Lower_Joint_Bound[i] = (data * (180 / Math.PI)).toFixed(0);
    return Upper_Lower_Joint_Bound[i];
}




function joint_deg() {
    xhrJ[j] = new XMLHttpRequest;
    xhrJ[j].open('GET', '/rw/motionsystem/mechunits/ROB_1/jointtarget?json=1', true);
    xhrJ[j].onreadystatechange = function () {
        if (xhrJ[j].readyState == 4 && xhrJ[j].status == 200) {
            var obj = JSON.parse(xhrJ[j].responseText);
            for (var i = 0; i < jointtarge_axes.length; i++) {
                var json = ('rax_' + (i + 1));
                jointtarge_axes[i] = parseFloat(obj._embedded._state[0][json]).toFixed(2);
                Axis[i] = ("Axis" + (i + 1))
                document.getElementById(Axis[i]).innerHTML = ('Axis ' + (i + 1) + ' : ') + jointtarge_axes[i];
            }
            xhrJ[j].abort();
            xhrJ = [];
            j = j + 1;
        }
    }
    xhrJ[j].send(null);
}

function c_unclick() {
    console.log("unclick")
    var url = '/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/click?action=set';
    var send = 'value=\"unclick"'
    PostJ(url, send);
}
function Joint_max_min() {
    console.log("unclick")
    var url = '/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/click?action=set';
    var send = 'value=\"unclick"'
    PostJ(url, send);
}

function InputToolsWobj(data) {
    switch (data) {
        case ('Tool'):
            Tool_or_Wobj = 'toolname';
            SearchTool_or_Wobj = '/rw/rapid/symbol/data/RAPID/T_ROB1/SearchTool?json=1';
            Display = 'Tool name'
            inputDef = 'tool0'
            break;
        case ('Wobj'):
            Tool_or_Wobj = 'wobjname';
            SearchTool_or_Wobj = '/rw/rapid/symbol/data/RAPID/T_ROB1/SearchWobj?json=1';
            Display = 'Wobj name'
            inputDef = 'wobj0'
            console.log("check "+'wobj0')
            break;
    }
    Swal.fire({
        loaderHtml: `<div class="spinner-border text-danger"></div>`,
        customClass: {
            loader: 'custom-loader'
        },
        title: 'Input ' + Display,
        input: 'text',
        showCancelButton: true,
        confirmButtonColor: '#ff000f',
        confirmButtonText: 'Submit',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: (Input) => {
            return new Promise(function (resolve) {
                if (Input === "") {
                    Swal.showValidationMessage("Error Please input " + "[" + Display + "]");
                    resolve()
                    return false;

                }
                if (Input == false) {
                    resolve()
                    return false;
                    
                }
                else {
                    url = '/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/' + Tool_or_Wobj + '?action=set';
                    if (Input == false && OldInput == undefined) {
                        Input = inputDef
                        console.log("input1 "+input)
                    }
                    if (Input == false) {
                        Input = OldInput
                        console.log("input2 "+input)
                    }

                    send = "value=" + '\"' + Input + '"'
                    console.log("input3"+Input)
                    PostJ(url, send)
                    OldInput = Input
                    console.log("input3"+Input)
                    setTimeout(function () {
                        GetJogging(SearchTool_or_Wobj, 'value')
                        resolve()
                    }, 1000);
                    return false;
                }
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed==true) {
            GetJogging(SearchTool_or_Wobj, 'value')
            console.log("Search1 " + Search)
            setTimeout(function () {
                console.log("Search2 " + Search)
                if (Search == 'true') {
                    Swal.fire({
                        icon: 'success',
                        title: 'complete',
                        confirmButtonColor: '#ff000f',
                        confirmButtonText: 'OK',
                        focusConfirm: false
                    })
                    document.getElementById('text-tool').innerHTML = Display + " : " + result.value
                }
                if (Search == 'false') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Check ' + "[" + Display + "]",
                        iconColor: '#ff000f',
                        confirmButtonColor: '#ff000f',
                        focusConfirm: false,
                        confirmButtonText: 'OK',

                    })

                }
            }, 200);
        }
    })
}
function Position(data) {
    var a = [], value = [];
    for (let index = 1; index < 7; index++) {
        a[index] = '<input id="swal-input' + index + '"' + ' class="swal2-input"' + ' placeholder="Axis ' +
            index + ' ( ' + Upper_Lower_Joint_Bound[index + 6] + ' to ' + Upper_Lower_Joint_Bound[(index)] + ' ) deg ' + '"' + '>'
    }

    (async () => {

        const { value: formValues } = await Swal.fire({

            title: 'Set Position Home',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#ff000f",
            html: a[1] + a[2] + a[3] + a[4] + a[5] + a[6],
            preConfirm: () => {

                for (var index = 1; index < 7; index++) {
                    value[index] = $("#swal-input" + index).val()
                    value[index] = Number(value[index])
                    if ($("#swal-input" + index).val() === "") {
                        Swal.showValidationMessage("Error!!!");

                    }
                    else if ((value[index] > Upper_Lower_Joint_Bound[index]) || value[index] < Upper_Lower_Joint_Bound[index + 6]) {
                        Swal.showValidationMessage("Error Axis " + index);

                    }
                    if (((value[index] > 0) && (value[index] < 1))) {
                        Swal.showValidationMessage("Error Close to singularity");
                    }
                    if (value[index] == 0) {
                        Swal.showValidationMessage("Error Close to singularity");
                    }
                }
                if ((value[1] == 0) && (value[2] == 0) && (value[3] == 0) && (value[4] == 0) && (value[5] == 0) && (value[6] == 0)) {
                    Swal.showValidationMessage("Error Close to singularity");
                }
                return [
                    $("#swal-input1").val(),
                    $("#swal-input2").val(),
                    $("#swal-input3").val(),
                    $("#swal-input4").val(),
                    $("#swal-input5").val(),
                    $("#swal-input6").val()
                ]
            }
        })

        if (formValues) {
            var Module, variable;

            switch (data) {
                case ('Joint'):
                    Module = 'Joint_target';
                    variable = "AxJ";
                    break;
                case ('Home'):
                    Module = 'Home';
                    variable = "AxH";
                    break;
            }
            var url = [];
            var send = [];
            for (var Ax = 0; Ax < 6; Ax++) {
                url[Ax] = '/rw/rapid/symbol/data/RAPID/T_ROB1/' + Module + "/" + variable + (Ax + 1) + '?action=set';
                send[Ax] = "value=" + formValues[(Ax)]
            }
            for (var i = 0; i < 6; i++) {
                PostJ(url[i], send[i])
            }
        }
    })()
}

function Coordinate(data) {

    switch (data) {
        case ('World'):
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/MotionMode/coordinete?action=set', 'value=\"wobj"');
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/toolname?action=set', 'value=\"tool0"');
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/wobjname?action=set', 'value=\"wobj0"');
            document.getElementById("text-tool").innerHTML = data
            break;
        case ('Base'):
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/MotionMode/coordinete?action=set', 'value=\"wobj"');
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/toolname?action=set', 'value=\"tool0"');
            PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/wobjname?action=set', 'value=\"wobj0"');
            document.getElementById("text-tool").innerHTML = data
            break;
        case ('Tool'):
            url = '/rw/rapid/symbol/data/RAPID/T_ROB1/MotionMode/coordinete?action=set';
            send = 'value=\"tool"';
            PostJ(url,send);
            setTimeout(function () {
            InputToolsWobj('Tool'),30})
            break;
        case ('Wobj'):
            url = '/rw/rapid/symbol/data/RAPID/T_ROB1/MotionMode/coordinete?action=set';
            send = 'value=\"wobj"';
            PostJ(url,send);
            setTimeout(function () {
            InputToolsWobj('Wobj'),30})
            break;

    }
}
function StartJogging() {
    Coordinate('World')
    PostJ('/rw/rapid/tasks/T_ROB1/pcp?action=set-pp-routine-from-url', "module=Jogging&routine=rJog");
    PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/manual?action=set', 'value=\"yes"');
    PostJ('/rw/rapid/execution?action=start', 'regain=continue&execmode=continue&cycle=forever&condition=none&stopatbp=disabled&alltaskbytsp=false');
}
function StopJogging() {
    PostJ('/rw/rapid/symbol/data/RAPID/T_ROB1/Jogging/manual?action=set', 'value=\"no"');
    PostJ('/rw/rapid/execution?action=stop', 'stopmode=stop&usetsp=normal');

    PostJ('/rw/rapid/execution?action=resetpp', 'None');
}
function ResetJogging() {
    url = '/rw/rapid/execution?action=resetpp'
    send = 'None'
    PostJ(url, send);
}

function checkTheme(icon) {
    let r = document.querySelector(':root');
    // console.log($('#chartdiv'.style))
    if (icon == 'moon') {
        r.style.setProperty('--toggle-base-color', '#6e6e6e');
        r.style.setProperty('--card-head-color', '#262626');
        r.style.setProperty('--speed-color', '#fff');

    } else {
        r.style.setProperty('--toggle-base-color', '#efefef');
        r.style.setProperty('--card-head-color', '#fafafa');
        r.style.setProperty('--speed-color', '#262626');
    }
}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";

    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}

function myFunction() {
    var x = document.getElementById("sort-relevance").value;
    motion_axis = motion_mode(x)
    $('.dropdown-el').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('expanded');
        $('#' + $(e.target).attr('for')).prop('checked', true);
        var motion = e.target.textContent;
        motion_axis = motion_mode(motion)
    });
    $(document).click(function () {
        $('.dropdown-el').removeClass('expanded');
    });
    for (var n = 1; n <= 5 + 1; n++) {
        (function (n) {
            setTimeout(function () {
                if (n == 1) {
                    for (var i = 1; i < 7; i++) {
                        upper_lower_joint('upper', i)
                    }
                }
                if (n == 2) {
                    for (var i = 1; i < 7; i++) {
                        upper_lower_joint('lower', i)
                    }
                }
                if (n == 3) {
                    Getdata('speed ratio')
                }
                if (n == 4) {
                    setInterval(joint_deg, 50);
                }
            }, 200 * n);
        })(n);
    };


}