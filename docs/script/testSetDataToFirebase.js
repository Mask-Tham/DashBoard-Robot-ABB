

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

function writeUserData(child, obj) {
    firebase.database().ref(child).set(obj);
}

function nameRobot(data) {
    let nameRobot = data._embedded._state[1].options[6].option
    let rwVersion = data._embedded._state[0].rwversionname
    let nameController = data._embedded._state[0].name
    let obj = new Object
    obj['nameRobot'] = nameRobot;
    obj['rwVersion'] = rwVersion;
    obj['nameController'] = nameController;
    writeUserData('info', obj);
}


function statusByTime(data) {
    let timeA, state;
    let dateNow = new Date()
    // console.log('data', data.length)
    for (index in data) {
        state = data[index]._state;
        let time_stamp = data[index].time_stamp;
        time_stamp = time_stamp.replace('T', '')
        timeA = new Date(time_stamp)
        // console.log(timeA)

        if (dateNow.getTime() - timeA.getTime() > (24 * 36e5)) {

            delete data[index]
        }
        // console.log(data)
    }

    console.log(data)
    writeUserData('statusByTime', data);
}



function energyState(data) {
    // console.log(data)
    let energy = new Object;
    let time = new Object;
    let Total = new Object;
    let Axes = []
    Axes[0] = new Object;
    Axes[1] = new Object;
    Axes[2] = new Object;
    Axes[3] = new Object;
    Axes[4] = new Object;
    Axes[5] = new Object;
    for (const key in data) {
        // console.log(data[key])
        let time_stamp = data[key]["time-stamp"]
        time_stampT = time_stamp.replace('T', '')
        let timeA = new Date(time_stampT)
        time[time_stamp] = {
            time_stamp: timeA.getTime()
        }

        let totalEnergy = data[key]["interval-energy"]
        Total[time_stamp] = {
            // time_stamp: timeA.getTime(),
            interval_energy: totalEnergy
        }

        mechunits = data[key].mechunits[0].axes
        for (m in mechunits) {
            let energyAxes = mechunits[m]["interval-energy"]
            Axes[m][time_stamp] = {
                // time_stamp: timeA.getTime(),
                interval_energy: energyAxes
            }

        }

    }
    energy = {
        Total: Total,
        Axes1: Axes[0],
        Axes2: Axes[1],
        Axes3: Axes[2],
        Axes4: Axes[3],
        Axes5: Axes[4],
        Axes6: Axes[5],
        time_stamp: time
    }
    // console.log(Total)
    console.log(energy)
    writeUserData('energy', energy);
}

function ELog(data) {
    let elog = data._embedded._state;
    let obj = new Object
    console.log(elog)
    for (var k in elog) {
        msgtype = elog[k].msgtype;
        code1 = elog[k].code;
        tstamp1 = elog[k].tstamp;
        title1 = elog[k].title;
        desc1 = elog[k].desc;
        conseqs1 = elog[k].conseqs;
        causes1 = elog[k].causes;
        actions1 = elog[k].actions;

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

        jData = {}
        jData['time stamp'] = tstamp1
        jData['message type'] = type1
        jData['code'] = code1
        jData['title'] = title1
        jData['description'] = desc1
        jData['consequences'] = conseqs1
        jData['causes'] = causes1
        jData['actions'] = actions1

        obj[k] = jData
        // console.log('jData', jData, typeof (jData))


    }
    console.log(obj)
    writeUserData('eLog', obj);
}

function sendData() {
    getData('/rw/system?json=1', nameRobot);
    getData('/fileservice/$home/docs/data/state.json', statusByTime);
    getData('/fileservice/$home/docs/data/energy.json', energyState);
    getData('/rw/elog/0?lang=en&json=1', ELog);
}

// $(document).ready(function () {
//   // var firebaseRef = firebase.database.ref()
//   // console.log(firebaseRef)
//   var starCountRef = firebase.database().ref('');
//   starCountRef.on('value', (snapshot) => {
//     console.log(snapshot.val())
//     // const data = snapshot.val();
//     // updateStarCount(postElement, data);
//   });
// })

// window.onload = function () {
// var firebaseConfig = {
//   apiKey: "AIzaSyCgo0482ztq4TrYyx4qmob4MxJ2O4r7hMU",
//   authDomain: "use-floline.firebaseapp.com",
//   databaseURL: "https://use-floline-default-rtdb.firebaseio.com",
//   projectId: "use-floline",
//   storageBucket: "use-floline.appspot.com",
//   messagingSenderId: "1070273474599",
//   appId: "1:1070273474599:web:9e11f121235641bd5cde02"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// var firebaseRef = firebase
// console.log(firebaseRef)

var firebaseRef = firebase.database().ref();
firebaseRef.on('value', (snapshot) => {
    console.log(snapshot.val())
    // const data = snapshot.val();
    // updateStarCount(postElement, data);
});
// }