
var arrName = [];
var arrPath = [];
var arrValue = [];

var jsonobjConfig;
var file;
var PackageJSON = [];
var preDir;

var DataNumber;
var jsonobj = [];
var xhr = new XMLHttpRequest();
var xhrA = [];
var xhrB = [];
var selectedField;
var OldField = "Field1";
var Firstelem;
var Lastelem;

function AddField() {


    Lastelem = document.querySelector("#Field" + String(DataNumber));
    console.log('Lastelem', Lastelem)
    // Get the element
    if (Lastelem != null) {
        var clone = Lastelem.cloneNode(true);
        DataNumber++;
        // Update the ID and add a class
        clone.id = "Field" + String(DataNumber);
        var cClone = clone.childNodes;
        cClone[1].firstElementChild.style.backgroundColor = "#e9ecef";
        cClone[1].firstElementChild.style.color = "#495057";

    }


    // Create a copy of it


    // Inject it into the DOM
    if (Lastelem != null) {
        Lastelem.after(clone);
    }
    else {
        Lastelem = Firstelem;
        var field = document.getElementById("fieldArea").childNodes;
        field[1].appendChild(Lastelem);
    }



}

function back() {
    window.open("io.html", "_self");
}

function Clear() {

    if (DataNumber > 1) {
        for (let index = 2; index < Number(DataNumber) + 1; index++) {


            var elem = document.querySelector("#Field" + String(index));
            if (elem != null) {
                elem.remove();
            }


        }

        DataNumber = 1;

    }


    var c = Firstelem.childNodes;



    c[3].value = "";
    c[7].value = "";
    c[11].value = "";


}

function SelectField(elem) {
    //console.log(OldField);
    if (document.getElementById(OldField) != null) {
        var cElemHLO = document.getElementById(OldField).childNodes;
        cElemHLO[1].firstElementChild.style.backgroundColor = "#e9ecef";
        cElemHLO[1].firstElementChild.style.color = "#495057";
    }


    selectedField = elem.parentNode.id;
    var cElemHL = elem.childNodes;
    cElemHL[1].style.backgroundColor = "#c82333";
    cElemHL[1].style.color = "white";

    OldField = String(selectedField);

    console.log(selectedField);
    //elem[2]
}

function Remove() {

    if (Number(DataNumber) > 1) {

        var elem = document.querySelector("#" + selectedField);

        elem.remove();


        //DataNumber--;
        //localStorage.setItem('Number_Data', DataNumber);
        //console.log(DataNumber);
    }

}
function Save() {

    var seq = 1;
    console.log(DataNumber);
    if (DataNumber < 1) {
        DataNumber = 1;
    }
    for (let index = 1; index < Number(DataNumber) + 1; index++) {

        if (document.getElementById("Field" + String(index)) != null) {
            var c = document.getElementById("Field" + String(index)).childNodes;

            //console.log(c);
            arrName[seq] = c[3].value;
            switch (c[7].selectedIndex) {
                case 0:
                    preDir = "";
                    break;
                case 1:
                    preDir = "/rw/rapid/symbol/data/RAPID/";
                    break;
                case 2:
                    preDir = "/rw/iosystem/signals/";
                    break;
                case 3:
                    preDir = "";
                    break;
                default:
                    preDir = "";
                    break;
            }
            arrPath[seq] = c[9].value;
            arrValue[seq] = c[13].value;
            //file.config.push({ "Name": arrName[index], "Path": arrPath[index], "Value": arrValue[index] });
            var confign = "Config" + String(seq);
            jsonobjConfig = {

                "Name": arrName[seq],
                "Type": c[7].selectedIndex,
                "PreDir": preDir,
                "Path": arrPath[seq],
                "Value": arrValue[seq],
                "Display": c[17].selectedIndex,
                "DParam": c[21].value

            };

            PackageJSON[seq] = jsonobjConfig;
            //console.log(PackageJSON[seq]);
            //console.log(newMem);
            //localStorage.setItem("config" + String(index), JSON.stringify(jsonobjConfig));
            //localStorage.setItem('Number_Data', DataNumber);

            seq = seq + 1;
        } else {
            console.log("fail");
        }

    }
    DataNumber = Number(seq - 1);
}
function SaveCloud() {
    Save();

    var listRef = firebase.database().ref('Config');
    var newMem = listRef.push(PackageJSON);

    var ConfRef = firebase.database().ref('LastConfig');
    ConfRef.set(newMem.key);
    localStorage.setItem('LastDataPath', newMem.key);
    localStorage.setItem('Number_Data', DataNumber);
    console.log(DataNumber);

    xhr.open('POST', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/sDatabase?action=set", true);
    xhr.setRequestHeader("Content-type", "x-www-form-urlencoded");
    xhr.send("value=" + '\"' + newMem.key + '"');


    var alarea = document.getElementById("AlertArea");
    alarea.removeChild(alarea.lastChild);
    var al = document.createElement("div");
    al.setAttribute("class", "alert alert-success")
    al.setAttribute("id", "alSave")
    al.innerHTML = "Save to cloud successfully";

    alarea.appendChild(al);
}

function LoadCloud() {
    var arrName = [];
    var arrPath = [];
    var arrValue = [];
    var preDir;

    var file;

    Clear();
    console.log("Start recall");
    //DataNumber = localStorage.getItem('Number_Data');
    if (DataNumber == "null") {
        DataNumber = 1;
    }

    console.log(DataNumber);
    var area = document.getElementById("Loadingarea");

    var loading = document.createElement('div');
    loading.setAttribute('id', 'loadspin')
    loading.setAttribute('class', "spinner-border text-center");
    area.appendChild(loading);


    xhr.open('GET', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/sDatabase?json=1", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

            var obj = JSON.parse(xhr.responseText);
            var Rawd = obj._embedded._state[0];

            var data = Rawd["value"];
            var dataCut = data.slice(1, data.length - 1);
            //console.log(dataCut);

            var getConf = firebase.database().ref("Config/" + String(dataCut));
            getConf.once('value')
                .then(function (dataSnapshot2) {
                    if (dataSnapshot2.val() != null) {
                        //console.log("get data");
                        jsonobj = dataSnapshot2.val();
                        //console.log(jsonobj);
                        var datac = jsonobj[1];
                        if (jsonobj.length > 0) {
                            DataNumber = jsonobj.length - 1;

                            var c1 = document.getElementById("Field1").childNodes;
                            //console.log(c1);


                            c1[3].value = datac[0];
                            c1[7].value = datac[1];
                            switch (datac[2]) {
                                case 0:
                                    preDir = "";
                                    break;
                                case 1:
                                    preDir = "//rw/rapid/symbol/data/RAPID/";
                                    break;
                                case 2:
                                    preDir = "//rw/iosystem/signals/";
                                    break;
                                case 3:
                                    preDir = "";
                                    break;
                            }

                            c1[9].value = datac[3];
                            c1[13].value = datac[4];
                            c1[17].value = datac[5];
                            c1[21].value = datac[6];

                            switch (c1[17].selectedIndex) {
                                case 1:
                                    c1[19].innerHTML = "Unit";
                                    break;
                                case 2:
                                    c1[19].innerHTML = "Threshold";
                                    break;
                                case 3:
                                    c1[19].innerHTML = "Style";
                                    break;
                                default:
                                    break;
                            }

                            console.log(DataNumber);
                            if (DataNumber > 1) {
                                var total = Number(DataNumber) + 1;
                                for (let index = 2; index < total; index++) {
                                    var elem = document.querySelector("#Field" + String(index - 1));

                                    // Create a copy of it
                                    var clone = elem.cloneNode(true);

                                    // Update the ID and add a class
                                    clone.id = "Field" + index;

                                    // Inject it into the DOM
                                    elem.after(clone);
                                }

                                for (let j = 1; j < total; j++) {

                                    //jsonobj[j] = JSON.parse(localStorage.getItem("config" + String(j)));
                                    var c = document.getElementById("Field" + String(j)).childNodes;
                                    var datac = jsonobj[j];
                                    //console.log(datac);
                                    c[3].value = datac.Name;
                                    c[7].value = datac.Type;
                                    switch (datac.Type) {
                                        case 0:
                                            preDir = "";
                                            break;
                                        case 1:
                                            preDir = "//rw/rapid/symbol/data/RAPID/";
                                            break;
                                        case 2:
                                            preDir = "//rw/iosystem/signals/";
                                            break;
                                        case 3:
                                            preDir = "";
                                            break;
                                    }

                                    c[9].value = datac.Path;
                                    c[13].value = datac.Value;
                                    c[17].value = datac.Display;
                                    c[21].value = datac.DParam;

                                    switch (c[17].selectedIndex) {
                                        case 1:
                                            c[19].innerHTML = "Unit";
                                            break;
                                        case 2:
                                            c[19].innerHTML = "Threshold";
                                            break;
                                        case 3:
                                            c[19].innerHTML = "Style";
                                            break;
                                        default:
                                            break;
                                    }
                                }

                                document.getElementById("Loadingarea").removeChild(document.getElementById("Loadingarea").lastChild);
                            }
                        }

                    }


                });

        }
    }



    var savebtn = document.getElementById("SaveCloudbtn");
    savebtn.removeAttribute("disabled");




}


function UpdateValue(event) {

    var cid = event.parentNode.id;
    var c = document.getElementById(cid).childNodes;
    // console.log('c',c)
    switch (c[7].selectedIndex) {
        case 1:
            c[13].value = "value";
            c[9].placeholder = "T_ROB1/Module_Name/Symbol_name"
            break;
        case 2:
            c[13].value = "lvalue";
            c[9].placeholder = "Signal_name"
            break;
        default:
            break;
    }

}

function UpdateParameter(event) {

    var cid = event.parentNode.id;
    var c = document.getElementById(cid).childNodes;

    switch (c[17].selectedIndex) {
        case 1:
            c[19].innerHTML = "Unit";
            break;
        case 2:
            c[19].innerHTML = "Threshold";
            break;
        case 3:
            c[19].innerHTML = "Style";
            break;
        default:
            break;
    }

}

function Load() {
    // console.log('load data')
    Firstelem = document.getElementById("Field1");
    //Check module Existing
    firstCall();
}

function firstCall() {
    xhr.open('GET', "/rw/rapid/modules/Dashboard?task=T_ROB1&json=1", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            showPage();
            // console.log('load data')
            var obj = JSON.parse(xhr.responseText);
            var Rawd = obj._embedded._state[0];

            var data = Rawd["filename"];
            // console.log(data);
            if (data == "Dashboard.mod") {
                // console.log('load data')
                GETnTotalConfig_Xhr();



                //console.log(c);


            } else {
                var alarea = document.getElementById("AlertArea");
                alarea.removeChild(alarea.lastChild);
                var al = document.createElement("div");
                al.setAttribute("class", "alert alert-danger")
                al.setAttribute("id", "alModNotfound")
                al.innerHTML = "Module not found. Please add Dashboard.mod to task";
                alarea.appendChild(al);
            }


        }
        if (xhr.readyState == 4 && xhr.status == 503) {
            console.log('overload503');
            firstCall();
        }
    }
    if (xhr.readyState == 4 && xhr.status == 400) {
        console.log('Failed');

    }
}



function SaveMod() {
    saving_icon();

    var alarea = document.getElementById("AlertArea");
    alarea.innerHTML = ''
    // alarea.removeChild(alarea.lastChild);

    Save();

    save_nTotalConfig();

    for (let o = 1; o < Number(DataNumber) + 1; o++) {
        save_sConfig(o);
    }

}

function saving_icon() {
    var button_save = document.getElementById('save')
    button_save.innerHTML = ''
    console.log('button_save', button_save)
    saving = document.createElement("div");
    saving.setAttribute('class', 'lds-ellipsis')
    for (var i = 0; i < 4; i++) {
        div = document.createElement("div");
        saving.appendChild(div)
        // console.log(i)
    }
    span = document.createElement('span')
    span.appendChild(document.createTextNode('Saving'));
    button_save.appendChild(saving)
    button_save.appendChild(span);
}

function save_icon() {
    var button_save = document.getElementById('save')
    button_save.innerHTML = ''
    console.log('button_save', button_save)
    saving = document.createElement("img");
    saving.setAttribute('src', '/docs/svg/save.svg')
    saving.setAttribute('height', '24')
    saving.setAttribute('width', '24')
    span = document.createElement('span')
    span.appendChild(document.createTextNode('Save'));
    button_save.appendChild(saving)
    button_save.appendChild(span);
}

function save_sConfig(o) {
    xhrA[o] = new XMLHttpRequest();
    //console.log(o);
    xhrA[o].open('POST', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/sConfig{" + String(o) + '}?action=set', true);
    xhrA[o].setRequestHeader("Content-type", "x-www-form-urlencoded");
    xhrA[o].send("value=[" + '\"' + PackageJSON[o].Name + '",\"' + PackageJSON[o].Type + '",\"' + PackageJSON[o].PreDir + '",\"' + PackageJSON[o].Path + '",\"' + PackageJSON[o].Value + '",\"' + PackageJSON[o].Display + '",\"' + PackageJSON[o].DParam + '"]');
    xhrA[o].onreadystatechange = function () {
        if (xhrA[o].readyState == 4 && xhrA[o].status == 204) {
            if (o == DataNumber) {
                console.log('send complete' + o)

                var alarea = document.getElementById("AlertArea");
                alarea.innerHTML = ''
                // alarea.removeChild(alarea.lastChild);
                var al = document.createElement("div");
                al.setAttribute("class", "alert alert-success")
                al.setAttribute("id", "alSave")
                al.innerHTML = "Save to MOD successfully";
                alarea.appendChild(al);

                save_icon();


            }
        }

        if (xhrA[o].readyState == 4 && xhrA[o].status == 503) {
            console.log('overload503');
            save_sConfig(o);
        }

        if (xhrA[o].readyState == 4 && xhrA[o].status == 400) {
            console.log('[STATUS] The controller had manual mode. Please change to auto mode before save setting io')

            var alarea = document.getElementById("AlertArea");
            alarea.innerHTML = ''
            // alarea.removeChild(alarea.lastChild);
            var al = document.createElement("div");
            al.setAttribute("class", "alert alert-danger")
            al.setAttribute("id", "alSave")
            al.innerHTML = "The controller had manual mode. Please change to auto mode before save setting io";
            alarea.appendChild(al);

            save_icon();
        }
    }

}

function save_nTotalConfig() {
    xhr.open('POST', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/nTotalConfig?action=set", true);
    xhr.setRequestHeader("Content-type", "x-www-form-urlencoded");
    xhr.send("value=" + String(DataNumber));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 503) {
            console.log('overload503');
            save_nTotalConfig();
        }
    }
    xhr.onerror = function () {
        console.log('xhr Error', xhr.responseText)
    }
}

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

function GETnTotalConfig_Xhr() {
    // console.log('load data')
    getData("/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/nTotalConfig?json=1", GETnTotalConfig_Xhr_state)
    // xhr.open('GET', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/nTotalConfig?json=1", true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // xhr.withCredentials = true;
    // //xhr[nID].setRequestHeader('Authorization', 'Digest Auth' + btoa("Default User:robotics"));
    // xhr.send();

    // // console.log('load data')

    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         // console.log('load data')
    //         var obj = JSON.parse(xhr.responseText);
    //         var Rawd = obj._embedded._state[0];

    //         var data = Rawd["value"];
    //         // console.log(data);
    //         DataNumber = Number(data);
    //         console.log(DataNumber);
    //         if (DataNumber > 0) {
    //             var savebtn = document.getElementById("SaveCloudbtn");
    //             savebtn.removeAttribute("disabled");
    //         }
    //         var total = Number(DataNumber) + 1;
    //         for (let index = 2; index < total; index++) {
    //             var elem = document.querySelector("#Field" + String(index - 1));
    //             // console.log(elem);
    //             // Create a copy of it
    //             var clone = elem.cloneNode(true);

    //             // Update the ID and add a class
    //             clone.id = "Field" + index;

    //             // Inject it into the DOM
    //             elem.after(clone);
    //         }

    //         for (let p = 1; p < Number(DataNumber) + 1; p++) {
    //             GETnTotalConfig_Xhr_sConfig(p);
    //         };
    //     }
    //     if (xhr.status == 503) {
    //         console.log('Failed');
    //         GETnTotalConfig_Xhr();
    //     }
    // };
}

function GETnTotalConfig_Xhr_state(obj) {
    console.log(obj)
    var Rawd = obj._embedded._state[0];

    var data = Rawd["value"];
    // console.log(data);
    DataNumber = Number(data);
    console.log(DataNumber);
    if (DataNumber > 0) {
        var savebtn = document.getElementById("SaveCloudbtn");
        savebtn.removeAttribute("disabled");
    }
    var total = Number(DataNumber) + 1;
    for (let index = 2; index < total; index++) {
        var elem = document.querySelector("#Field" + String(index - 1));
        // console.log(elem);
        // Create a copy of it
        var clone = elem.cloneNode(true);

        // Update the ID and add a class
        clone.id = "Field" + index;

        // Inject it into the DOM
        elem.after(clone);
    }

    for (let p = 1; p < Number(DataNumber) + 1; p++) {
        GETnTotalConfig_Xhr_sConfig(p);
    };
}

function GETnTotalConfig_Xhr_sConfig(p) {
    xhrB[p] = new XMLHttpRequest();
    //console.log(p);
    xhrB[p].open('GET', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/sConfig{" + String(p) + '}?json=1', true);
    xhrB[p].setRequestHeader("Content-type", "application/json");
    xhrB[p].send();

    xhrB[p].onreadystatechange = function () {
        if (xhrB[p].readyState == 4 && xhrB[p].status == 200) {

            var obj = JSON.parse(xhrB[p].responseText);
            var Rawd = obj._embedded._state[0];

            var data = Rawd.value;

            var datac = JSON.parse(data);
            //datac = cutdata.split(',');
            console.log('datac ', datac);
            var c = document.getElementById("Field" + String(p)).childNodes;

            c[3].value = datac[0];
            c[7].value = datac[1];
            switch (datac[2]) {
                case 0:
                    preDir = "";
                    break;
                case 1:
                    preDir = "//rw/rapid/symbol/data/RAPID/";
                    break;
                case 2:
                    preDir = "//rw/iosystem/signals/";
                    break;
                case 3:
                    preDir = "";
                    break;
            }

            c[9].value = datac[3];
            c[13].value = datac[4];
            c[17].value = datac[5];
            c[21].value = datac[6];

            switch (c[17].selectedIndex) {
                case 1:
                    c[19].innerHTML = "Unit";
                    break;
                case 2:
                    c[19].innerHTML = "Threshold";
                    break;
                case 3:
                    c[19].innerHTML = "Style";
                    break;
                default:
                    break;
            }


        }
        if (xhrB[p].status == 503) {
            console.log('Failed');
            GETnTotalConfig_Xhr_sConfig(p);
        }
    };
}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";
    $.getScript('./script/theme.js', function () {
        let icon = getCookie("theme_icon");
        changeThemeChart(icon);
    });
}

function checkTheme(icon) {
    if (icon == 'moon') {
        document.getElementById("clear").className = "btn btn-outline-light";
    } else {
        document.getElementById("clear").className = "btn btn-outline-dark";
    }
}