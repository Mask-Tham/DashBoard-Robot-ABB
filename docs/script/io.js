var jsonobj = [];
var seq = 1;
var DataNumber = localStorage.getItem('Number_Data');
var xhr = [];
var xhr1 = new XMLHttpRequest();
var xhrB = [];
var Time = [];
var ctime = 0;
var myLineChart = [];
var ChartArray = [];
var dataLength = 80;
function Start() {

    setInterval(update, 300);
}

function Load() {


    console.log(DataNumber);

    firstCall();

    console.log('DataNumber', DataNumber)
    // setInterval(update, 100);
}

function firstCall() {
    xhr1.open('GET', "/rw/rapid/modules/Dashboard?task=T_ROB1&json=1", true);
    xhr1.setRequestHeader("Content-type", "application/json");
    xhr1.send();


    xhr1.onreadystatechange = function () {
        if (xhr1.readyState == 4 && xhr1.status == 200) {
            showPage();
            var obj = JSON.parse(xhr1.responseText);
            var Rawd = obj._embedded._state[0];

            var data = Rawd["filename"];
            // console.log(data);
            if (data == "Dashboard.mod") {
                GETnTotalConfig_Xhr();
                console.log('if')

            } else {
                var alarea = document.getElementById("AlertArea");
                alarea.removeChild(alarea.lastChild);
                var al = document.createElement("div");
                al.setAttribute("class", "alert alert-danger")
                al.setAttribute("id", "alModNotfound")
                al.innerHTML = "Module not found. Please add Dashboard.mod to task";
                alarea.appendChild(al);
                console.log('else')
            }


        }
        if (xhr1.readyState == 4 && xhr1.status == 503) {
            console.log('overload503');
            firstCall();
        }
    }
    if (xhr1.readyState == 4 && xhr1.status == 400) {
        console.log('Failed');

    }
}

function update() {

        // console.log('jsonobj',jsonobj)
        // console.log('xhr.length',xhr.length)
    if (DataNumber > 1) {

        ctime = ctime + 0.3;
        Time.push(ctime);

        for (let i = 1; i < xhr.length; i++) {
            GETdata_Xhr(jsonobj[i].PreDir + jsonobj[i].Path, jsonobj[i].Value, i);

        }


    } else {


        //c1[3].innerHTML = GETdata_Xhr(jsonobj[1].Path,jsonobj[1].Value);
        GETdata_Xhr(jsonobj[1].PreDir + jsonobj[1].Path, jsonobj[1].Value, 1);
    }

}

function GETdata_Xhr(Path, dataV, nID) {

    xhr[nID].open('GET', Path + "?json=1", true);
    xhr[nID].setRequestHeader("Content-type", "application/json");
    xhr[nID].withCredentials = true;
    //xhr[nID].setRequestHeader('Authorization', 'Digest Auth' + btoa("Default User:robotics"));
    xhr[nID].send();


    xhr[nID].onreadystatechange = function () {
        if (xhr[nID].readyState == 4 && xhr[nID].status == 200) {

            var obj = JSON.parse(xhr[nID].responseText);
            var Rawd = obj._embedded._state[0];

            var data = Rawd[String(dataV)];


            switch (jsonobj[nID].Display) {
                case "1":
                    TextCard(nID, data);
                    break;
                case "2":
                    SignalCard(nID, data);
                    break;
                case "3":
                    ChartCard(nID, data);
                    break;
                default:
                    break;
            }


        }
        if (xhr[nID].status == 503) {
            console.log('Failed');

        }
    };


}

function GETnTotalConfig_Xhr() {

    xhr1.open('GET', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/nTotalConfig?json=1", true);
    xhr1.setRequestHeader("Content-type", "application/json");
    xhr1.withCredentials = true;
    //xhr[nID].setRequestHeader('Authorization', 'Digest Auth' + btoa("Default User:robotics"));
    xhr1.send();


    xhr1.onreadystatechange = function () {
        if (xhr1.readyState == 4 && xhr1.status == 200) {

            var obj = JSON.parse(xhr1.responseText);
            var Rawd = obj._embedded._state[0];
            // console.log('Rawd',Rawd)
            var data = Rawd["value"];
            // console.log(data);
            DataNumber = Number(data);

            var c0 = document.getElementById("col1");
            c0.remove();

            for (let p = 1; p < DataNumber + 1; p++) {
                getsConfig(p);
            };

            setInterval(update, 100);

        }
        if (xhr1.readyState == 4 && xhr1.status == 503) {
            console.log('[ERROR] GETnTotalConfig_Xhr : ', xhr1.responseText);
            GETnTotalConfig_Xhr();
        }
    };
}

function getsConfig(p) {
    xhrB[p] = new XMLHttpRequest();
    console.log(p);
    xhrB[p].open('GET', "/rw/rapid/symbol/data/RAPID/T_ROB1/Dashboard/sConfig{" + String(p) + '}?json=1', true);
    xhrB[p].setRequestHeader("Content-type", "application/json");
    xhrB[p].send();

    xhrB[p].onreadystatechange = function () {
        if (xhrB[p].readyState == 4 && xhrB[p].status == 200) {

            var obj = JSON.parse(xhrB[p].responseText);
            var Rawd = obj._embedded._state[0];
            console.log('Rawd', Rawd)

            var data = Rawd.value;

            // console.log('data',data)

            var datac = JSON.parse(data);
            //datac = cutdata.split(',');

            console.log('datac', datac[0])

            if (datac[0] == "") {
                console.log('none')

                var alarea = document.getElementById("AlertArea");
                alarea.removeChild(alarea.lastChild);
                var al = document.createElement("div");
                al.setAttribute("class", "alert alert-danger")
                al.setAttribute("id", "alModNotfound")
                al.innerHTML = "Please setting parameter io signal";
                alarea.appendChild(al);
            }
            else {

                var jsonobjConfig = {

                    "Name": datac[0],
                    "Type": datac[1],
                    "PreDir": datac[2],
                    "Path": datac[3],
                    "Value": datac[4],
                    "Display": datac[5],
                    "DParam": datac[6]

                };

                console.log(datac[0]);

                jsonobj[p] = jsonobjConfig;

                xhr[p] = new XMLHttpRequest;

                var CardArea = document.getElementById("cardArea");

                var col = document.createElement("div");
                col.setAttribute("class", "col1")
                col.setAttribute("id", "col" + String(p))

                var card = document.createElement("div");
                card.setAttribute("class", "card");
                card.setAttribute("id", "card" + String(p));
                var CardHeader = document.createElement("div");
                CardHeader.setAttribute("class", "card1-header");
                CardHeader.setAttribute("id", "CardHeader" + String(p));
                CardHeader.innerHTML = jsonobj[p].Name;

                var CardBody = document.createElement("div");
                CardBody.setAttribute("class", "card-body text-right");
                CardBody.setAttribute("id", "CardBody" + String(p));

                switch (jsonobj[p].Display) {
                    case "1":
                        var txt = document.createElement("h2");
                        txt.setAttribute("id", "txt" + String(p));
                        var unit = document.createElement("h5");
                        unit.setAttribute("id", "unit" + String(p));

                        CardBody.appendChild(txt);
                        CardBody.appendChild(unit);
                        break;
                    case "2":
                        var light = document.createElement("div");
                        light.setAttribute("class", "p-3 mb-2 bg-warning text-white");
                        light.setAttribute("id", "light" + String(p));
                        CardBody.appendChild(light);
                        break;

                    case "3":
                        var chart = document.createElement("canvas");
                        chart.setAttribute("id", "chart" + String(p));


                        myLineChart[p] = new Chart(chart, {
                            type: 'line',
                            height: 300,
                            width: 550,
                            data: {
                                datasets: [{
                                    data: [],
                                    pointBackgroundColor: '#007bff',
                                    backgroundColor: '#007bff',
                                    pointRadius: 0
                                }]
                            },
                            options: {
                                responsive: true,
                                title: {
                                    display: false,
                                    text: ''
                                },
                                scales: {
                                    xAxes: [{
                                        type: "time",
                                        display: false,
                                        distribution: 'series',
                                        time: {
                                            unit: 'millisecond'
                                        },
                                        position: 'bottom',

                                        ticks:
                                        {
                                            autoSkip: true,
                                            maxTicksLimit: 20,

                                        },

                                    }]
                                },

                                legend: {
                                    display: false,
                                    labels: {
                                        fontColor: 'rgb(255, 99, 132)'
                                    }
                                }
                            }
                        });

                        console.log(myLineChart[p]);
                        CardBody.appendChild(chart);
                        break;
                    default:
                        break;
                }


                card.appendChild(CardHeader);
                card.appendChild(CardBody);
                col.appendChild(card);
                CardArea.appendChild(col);

            }

        }
        if (xhrB[p].status == 503) {
            console.log('Failed');
            console.log('[ERROR] GETsConfig : ', xhr1.responseText);
            getsConfig(p);
        }
    };
}

function TextCard(nId, data) {
    //console.log(typeof data);

    var txt = document.getElementById("txt" + String(nId));
    if (isNaN(data) == false) {
        if (Number(data) % 1 != 0) {
            txt.innerHTML = Number(data).toPrecision(4) + " ";
        } else {
            txt.innerHTML = data + " ";
        }

    } else {
        txt.innerHTML = data + " ";
    }

    var unit = document.getElementById("unit" + String(nId));
    unit.innerHTML = jsonobj[nId].DParam;

}



function SignalCard(nId, data) {

    var light = document.getElementById("light" + String(nId));
    if (Number(data) >= Number(jsonobj[nId].DParam)) {
        light.setAttribute("class", "p-3 mb-2 bg-warning text-white");
    } else {
        light.setAttribute("class", "p-3 mb-2 bg-light text-white");
    }

}

function ChartCard(nId, data) {
    var Chartdata = { x: 0, y: 0 };
    Chartdata.y = (Number(data));
    //Chartdata.x = (Number(ctime));
    Chartdata.x = new Date();
    //console.log(Chartdata);
    //ChartArray[nId].push(Chartdata);
    //myLineChart[nId].data.push(Chartdata);



    myLineChart[nId].data.datasets.forEach((dataset) => {

        dataset.data.push(Chartdata);
        if (dataset.data.length > dataLength) {
            dataset.data.shift();
        }

    });


    // myLineChart[nId].data.push(Number(data));
    myLineChart[nId].update();
    Chartdata = null;
}

function setting() {
    window.open("set_io.html", "_self");
}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";
}