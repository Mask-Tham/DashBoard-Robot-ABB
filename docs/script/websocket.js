var namePage;
var poll;
var listSub = ['rw/elog/0', 
    'rw/system/energy', 
    'rw/cfg',
    'rw/rapid/execution;hdtrun', 
    'rw/rapid/execution;ctrlexecstate',
    'rw/motionsystem/errorstate;erroreventchange', 
    'rw/panel/opmode',
    'rw/panel/speedratio', 
    'rw/panel/ctrlstate',
    'rw/rapid/execution;rapidexeccycle']
var timeDelay = 50;

function sub(urlPath, resources) {
    $.ajax({
        url: urlPath,
        type: 'POST',
        data: resources
    }).done(function (response) {
        console.log('sub success', 'response is ', response)
        locationSub = response.childNodes[0].childNodes[3].childNodes[1].childNodes[1].href
        console.log('location', locationSub)
        createWebSocket(locationSub)
    })
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
                    sub(urlPath, resources);
                }, timeDelay)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });
}
function deleteSub(urlPath) {
    $.ajax({
        url: urlPath + poll,
        type: 'DELETE',
        success: function (response) {
            console.log('Delete success', 'response is ', response)
        }
    })
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
                    deleteSub(urlPath);
                }, timeDelay)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });
}

function addSub(resources) {
    $.ajax({
        url: '/subscription/' + poll,
        type: 'PUT',
        data: resources
    }).done(function (response) {
        console.log('addSub response is ', response)
    })
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
                    addSub(resources);
                }, timeDelay)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });
}

function unSub(resources) {
    $.ajax({
        url: '/subscription/' + poll + '/' + resources,
        type: 'DELETE',
    }).done(function (response) {
        console.log('Delete success', 'response is ', response)
    }).fail(function (jqXHR, exception) {
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
                unSub(resources);
            }, timeDelay)
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.error('[ERROR] ', msg)
    });
}

function getSubG() {
    $.ajax({
        url: '/subscription/' + poll,
        type: 'GET'

    }).done(function (response) {
        // console.log('getSubG response is ', response)
        let state = response.childNodes[0].childNodes[3].childNodes[0].childNodes[3]
        let localhost = response.childNodes[0].childNodes[1].childNodes[3].href
        let i = 0;
        // console.log('localhost', localhost)
        // console.log('listSub', listSub)
        while (state.childNodes[i] !== undefined) {
            resources = state.childNodes[i].childNodes[0].href.replace(localhost, '');
            // console.log('state', resources)
            listSub = listSub.filter(e => e !== resources)

            // if (resources == 'rw/elog/0') {
            //     // console.log('unSub', resources)
            //     // unSub(resources)
            // }

            i++
        }
        // console.log('listSub', listSub, listSub.length)
        var sourcesAddSub = createResourcesSub(listSub)

        // console.log('sourcesAddSub', sourcesAddSub)
        if (listSub.length != 0) {
            addSub(sourcesAddSub)
        }
    }).fail(function (jqXHR, exception) {
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
                getSubG();
            }, timeDelay)
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.error('[ERROR] ', msg)
    });
}

// var urlPath;
// check status sub
function getSub(urlPath) {
    $.ajax({
        url: urlPath,
        type: 'GET'
    }).done(getSubManage)
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
                    getSub(urlPath);
                }, timeDelay)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });
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
                }, timeDelay)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
        });

}

function createResourcesSub(listSub) {
    var sourcesSub = ''
    for (let j = 0; j < listSub.length; j++) {
        if (j > 0) {
            sourcesSub = sourcesSub + '&'
        }
        sourcesSub = sourcesSub + 'resources=' + (j + 1) + '&' + (j + 1) + '=/' + listSub[j] + '&' + (j + 1) + '-p=0'

    }
    return sourcesSub
}

function getSubManage(response) {
    console.log('get success', 'response is ', response)
    // console.log('childNodes[0] ', response.childNodes[0].childNodes[3].childNodes[1].childNodes[2])
    var subStatus = response.childNodes[0].childNodes[3].childNodes[1].childNodes[2].childNodes[0]
    // console.log('sub state', subStatus, typeof (subStatus))

    // if not sub call sub
    if (subStatus == null) {
        // console.log('not sub', subStatus)
        sourcesSub = createResourcesSub(listSub)
        sub('/subscription', sourcesSub)
    }

    // if sub create websocket
    else {
        // console.log('sub', subStatus)
        baseLocation = response.childNodes[0].childNodes[1].childNodes[3].href.replace('http://', '')
        baseLocation = baseLocation.replace('subscription/', '')
        // console.log('baseLocation', baseLocation, typeof (baseLocation))
        locationSub = subStatus.childNodes[0].href
        // console.log('location1', locationSub, typeof (locationSub))
        poll = locationSub.slice(10)
        // console.log('poll', poll, typeof (poll))
        locationSub = locationSub.slice(0, 5) + baseLocation + locationSub.slice(5)
        // console.log('location1', locationSub, typeof (locationSub))
        // locationSub = 'ws://127.0.0.1/poll/1'
        getSubG();
        // console.log('location2', locationSub, typeof (locationSub))
        createWebSocket(locationSub)
    }
}

function createWebSocket(location) {
    console.log('location in websocket', location);
    console.log('create websocket');
    websocket = new WebSocket(location, "robapi2_subscription");    //create websocket
    websocket.onopen = function () {
        // alert("connected");
        console.log('!!web socket connected!!')
        websocketOn();
    }
    websocket.onmessage = function (event) {    // listen Event
        parser = new DOMParser();
        console.log('event', event);
        xmlDoc = parser.parseFromString(event.data, "text/xml");
        console.log('xmlDoc', xmlDoc);

        li_event = xmlDoc.getElementsByClassName("state")[0].childNodes[2]
        for (let i = 1; li_event.childNodes[i] != undefined; i += 2) {

            var typeMessage = li_event.childNodes[i].className;
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
                case 'elog-message-ev':
                    console.log('elog-message-ev')

                    if (namePage == 'Event Log') {
                        var RawLink = xmlDoc.getElementsByClassName("elog-message-ev")[0].childNodes[0].href;
                        console.log('RawLink', RawLink);
                        $.getScript('./script/elog.js', function (response) {
                            showMassage();
                        });
                    }
                    else if (namePage == 'Dashboard') {
                        $.getScript('./script/dashboard.js', function () {
                            chartElog.render();
                        });
                    }
                    break;

                case 'rap-ctrlexecstate-ev':
                    console.log('rap-ctrlexecstate-ev')
                    let state = li_event.childNodes[i].childNodes[1].textContent
                    // console.log('state', state, typeof (state))
                    let dateNow = new Date()
                    let time_stamp = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate()
                        + ' T ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds()
                    // console.log('time_stamp', time_stamp, typeof (time_stamp))
                    manageState(state, time_stamp)
                    // var Status = xmlDoc.getElementsByClassName("rap-ctrlexecstate-ev")[0].childNodes[1].textContent;
                    $.getScript('./script/RobotControl.js', function (response) {
                        workingstatus(state)
                    });
                    break
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
                    console.log(Motormode)
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
        }

        // var RawLink = xmlDoc.getElementsByClassName("sys-energy-ev")[0].childNodes[1].href;
        // console.log('RawLink', RawLink);
        // jsonLink = RawLink + '?json=1'
        // console.log('jsonLink', jsonLink);
        // getData(jsonLink, manageEnergyData)


    }
    // websocket.onclose = function () {
    //     alert("closed");
    //     websocket.close();
    // }
    websocket.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };
    $(window).on('unload', function () {
        websocket.close();
    });


}

function manageState(state, timeN) {

    let new_data = { _state: state, time_stamp: timeN }

    $.getJSON('/fileservice/$home/docs/data/state.json', function (data) {

        count = timeN
        console.log('data', data, typeof (data))

        data[count] = new_data

        dataWrite = JSON.stringify(data)


        $.ajax({
            type: 'PUT',
            url: '/fileservice/$home/docs/data/state.json',
            dataType: 'json',
            data: dataWrite
        }).done(
            console.log('!!write new state robot success!!')
        ).fail(
            console.error('!! write data fail !!')
        )

        if (namePage == 'Dashboard') {
            console.log('run chart state robot in dash board page')
            setTimeout(function () {
                $.getScript('./script/dashboard.js', function () {
                    getData('/fileservice/$home/docs/data/state.json', stateTimework);
                });
            }
                , 10 * 1000)
        }

    });
}

function manageEnergyData(data) {
    let energy = data._embedded._state[0];
    console.log('energy', energy, typeof (energy))

    $.getJSON('/fileservice/$home/docs/data/energy.json', function (data) {
        change_count = energy["change-count"]
        count = energy['time-stamp']
        console.log('data', data, typeof (data))
        delete energy._links
        // delete energy["change-count"]

        data[count] = energy
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
        }).done(function () {
            console.log('!!write new energy data success!!')
        }).fail(function () {
            console.error('!! write data fail !!')
        })

        if (namePage == 'Energy') {
            console.log('run chart energy in energy page')
            setTimeout(function () {
                $.getScript('./script/energy.js', function () {
                    manageData()
                    console.log('get script success')
                })
            }
                , 10 * 1000)
        }
        else if (namePage == 'Dashboard') {
            console.log('run chart energy in dash board page')
            setTimeout(function () {
                $.getScript('./script/dashboard.js', function () {
                    getData('/fileservice/$home/docs/data/energy.json', energyChart);
                });
            }
                , 10 * 1000)
        }

        // $.getScript('./script/energy.js', function () {
        //     console.log('data[change_count]', dataUpdate)
        //     energyChart(data)
        //     // manageData()
        //     console.log('get script success')
        // });

    });

}

// call getSub 
function checkSub() {
    getSub('/subscription')
}

function websocketOn() {
    // $('#websocketStatus').css('background-color', 'green')
    // $('#websocketStatus').css('z-index', '1000')
    $('.fixed-top ').css('top', '0px')
    $('#sidebar ').css('top', '72px')
    $('body').css('padding-top', '72px')
    // document.documentElement.style.cssText = "--hight-websocket-status: 0px";
}

$(document).ready(function () {
    namePage = document.getElementsByTagName("title")[0].textContent;
    setTimeout(checkSub, 100)
    // checkSub()
    // getSubG()
    // setTimeout(getData('/rw/system/energy?json=1', manageEnergyData),20000)
    // getData('/rw/system/energy?json=1', manageEnergyData)

    // getSub('/subscription')
    // sub('/subscription')
    // deleteSub('/subscription/1')
    // setTimeout(getSub('/subscription'),1000)
    // console.log('success', 'response is ', response)
})