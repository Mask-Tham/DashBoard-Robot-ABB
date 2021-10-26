var namePage;
var typeMessage = [];
function sub(urlPath) {
    $.ajax({
        url: urlPath,
        type: 'POST',
        data: 'resources=1&1=/rw/system/energy&1-p=0'
            // + '&resources=2&2=/rw/elog/0&2-p=0'
            + '&resources=3&3=/rw/panel/opmode&3-p=1'
            + '&resources=4&4=/rw/panel/speedratio&4-p=1'
            + '&resources=5&5=/rw/panel/ctrlstate&5-p=1'
            + '&resources=6&6=/rw/rapid/execution;rapidexeccycle&6-p=1'
            + '&resources=7&7=/rw/rapid/execution;ctrlexecstate&7-p=1',
        success: function (response) {
            console.log('sub success', 'response is ', response)
            locationSub = response.childNodes[0].childNodes[3].childNodes[1].childNodes[1].href
            console.log('location', locationSub)
            createWebSocket(locationSub)
        }
    })
}
function deleteSub(urlPath) {
    $.ajax({
        url: urlPath,
        type: 'DELETE',
        success: function (response) {
            console.log('Delete success', 'response is ', response)
        }
    })
}

function addSub() {
    $.ajax({
        url: '/subscription/1',
        type: 'PUT',
        data: 'resources=1&1=/rw/elog/0&1-p=1',
        success: function (response) {
            console.log('add sub success', 'response is ', response)

        }
    })
}

function getSubG() {
    $.ajax({
        url: '/subscription/2',
        type: 'GET',
        success: function (response) {
            console.log('getSubG response is ', response)

        }
    })
}

// check status sub
function getSub(urlPath) {
    $.ajax({
        url: urlPath,
        type: 'GET',
        success: function (response) {
            console.log('get success', 'response is ', response)
            console.log('childNodes[0] ', response.childNodes[0].childNodes[3].childNodes[1].childNodes[2])
            var subStatus = response.childNodes[0].childNodes[3].childNodes[1].childNodes[2].childNodes[0]
            console.log('sub state', subStatus, typeof (subStatus))

            // if not sub call sub
            if (subStatus == null) {
                console.log('not sub', subStatus)
                sub('/subscription')
            }

            // if sub create websocket
            else {
                console.log('sub', subStatus)
                baseLocation = response.childNodes[0].childNodes[1].childNodes[3].href.replace('http://', '')
                baseLocation = baseLocation.replace('subscription/', '')
                console.log('baseLocation', baseLocation, typeof (baseLocation))
                locationSub = subStatus.childNodes[0].href
                // console.log('location1', locationSub, typeof (locationSub))
                locationSub = locationSub.slice(0, 5) + baseLocation + locationSub.slice(5)
                // console.log('location1', locationSub, typeof (locationSub))
                // locationSub = 'ws://127.0.0.1/poll/1'
                console.log('location1', locationSub, typeof (locationSub))
                createWebSocket(locationSub)
            }

        }

    })
}

function getData(urlpath, eventfunc) {
    $.ajax({
        url: urlpath,
        dataType: 'json'
    }).done(eventfunc);
}

function createWebSocket(location) {
    console.log('location in websocket', location);
    websocket = new WebSocket(location, "robapi2_subscription");    //create websocket
    websocket.onopen = function () {
        // alert("connected");
        console.log('connected')
    }
    websocket.onmessage = function (event) {    // listen Event
        parser = new DOMParser();
        console.log('event', event);
        xmlDoc = parser.parseFromString(event.data, "text/xml");
        console.log('xmlDoc', xmlDoc);

        typeMessage = xmlDoc.getElementsByClassName("state")[0].childNodes[2].childNodes[1].className;
        console.log('RawLink', typeMessage);
        switch (typeMessage) {
            case 'sys-energy-ev':
                console.log('sys-energy-ev')
                var RawLink = xmlDoc.getElementsByClassName("sys-energy-ev")[0].childNodes[1].href;
                console.log('RawLink', RawLink);
                jsonLink = RawLink + '?json=1'
                console.log('jsonLink', jsonLink);
                getData(jsonLink, manageEnergyData)
                break;
            case 'rap-ctrlexecstate-ev':
                var Status = xmlDoc.getElementsByClassName("rap-ctrlexecstate-ev")[0].childNodes[1].textContent;
                $.getScript('./script/RobotControl.js', function (response) {
                    workingstatus(Status)
                });
                break;
            case 'pnl-speedratio-ev':
                var Speed = xmlDoc.getElementsByClassName('pnl-speedratio-ev')[0].childNodes[1].textContent;
                $.getScript('./script/RobotControl.js', function (response) {
                    Value_Speed(Speed);
                });
                $.getScript('./script/Jogging.js', function (response) {
                    Value_Speed(Speed);
                });
                break;
            case 'pnl-opmode-ev':
                var Opmode = xmlDoc.getElementsByClassName('pnl-opmode-ev')[0].childNodes[1].textContent;
                $.getScript('./script/RobotControl.js', function (response) {
                    Optionmode(Opmode);
                });
                break;
            case 'pnl-ctrlstate-ev':
                var Motormode = xmlDoc.getElementsByClassName('pnl-ctrlstate-ev')[0].childNodes[1].textContent;
                $.getScript('./script/RobotControl.js', function (response) {
                    if (Motormode == "guardstop") {
                        Optionmode("MANR");
                    }
                    motormode(Motormode);
                });
                break;
            case 'rap-execcycle-ev':
                var Runmode = xmlDoc.getElementsByClassName("rap-execcycle-ev")[0].childNodes[1].textContent;
                if (Runmode == 'PGMRUN_CYCLE_SINGLE') {
                    Runmode = 'once';
                }
                if (Runmode == 'PGMRUN_CYCLE_CONTINUOUS') {
                    Runmode = 'forever';
                }
                $.getScript('./script/RobotControl.js', function (response) {
                    runmode(Runmode)
                });
                break;
            case 'pnl-opmode-ev':
                var Opmode = xmlDoc.getElementsByClassName('pnl-opmode-ev')[0].childNodes[1].textContent;
                $.getScript('./script/RobotControl.js', function (response) {
                    Optionmode(Opmode);
                });

                break;
        }
        // var RawLink = xmlDoc.getElementsByClassName("sys-energy-ev")[0].childNodes[1].href;
        // console.log('RawLink', RawLink);
        // jsonLink = RawLink + '?json=1'
        // console.log('jsonLink', jsonLink);
        // getData(jsonLink, manageEnergyData)


    }
    websocket.onclose = function () {
        alert("closed");
    }
    websocket.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };
    $(window).on('unload', function () {
        websocket.close();
    });


}

function manageEnergyData(data) {
    let energy = data._embedded._state[0];
    console.log('energy', energy, typeof (energy))

    $.getJSON('/fileservice/$home/docs/data/energy.json', function (data) {
        change_count = energy["change-count"]
        console.log('data', data, typeof (data))
        delete energy._links
        // delete energy["change-count"]

        data[change_count] = energy
        // var dataUpdate = {}
        // dataUpdate[change_count] = energy
        // console.log('data', data, typeof (data))
        dataWrite = JSON.stringify(data)
        // energy(data[change_count]);
        // console.log('data', data, typeof (data))
        // console.log('energy', energy)
        // console.log('change_count', change_count)
        // console.log('data[change_count]', data[change_count])
        // console.log('dataUpdate', dataUpdate)

        $.ajax({
            type: 'PUT',
            url: '/fileservice/$home/docs/data/energy.json',
            dataType: 'json',
            data: dataWrite
        }).done(
            console.log('put')
        )

        // $.getScript('./script/energy.js', function () {
        //     console.log('data[change_count]', dataUpdate)
        //     energyChart(data)
        //     // manageData()
        //     console.log('get script success')
        // });

    });
    if (namePage == 'Energy') {
        setTimeout(function () {
            $.getScript('./script/energy.js', function () {
                manageData()
                console.log('get script success')
            })
        }
            , 30 * 1000)
    }

}

// call getSub 
function checkSub() {
    getSub('/subscription')
}
$(document).ready(function () {
    namePage = document.getElementsByTagName("title")[0].textContent;
    checkSub()
    // getSubG();
    // setTimeout(getData('/rw/system/energy?json=1', manageEnergyData),20000)
    // getData('/rw/system/energy?json=1', manageEnergyData)

    // getSub('/subscription')
    // sub('/subscription')
    // deleteSub('/subscription/1')
    // setTimeout(getSub('/subscription'),1000)
    // console.log('success', 'response is ', response)
})