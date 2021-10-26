var poll;
function addsub() {
    $.ajax({
        url: '/subscription/' + '2',
        type: 'PUT',
        data: 'resources=1&1=/rw/cfg&1-p=0',
        success: function (response) {
            console.log('add sub success', 'response is ', response)

        }
    })
}

function unsub1() {
    $.ajax({
        url: '/subscription/' + poll + '/rw/elog/0',
        type: 'DELETE',
        success: function (response) {
            console.log('Delete success', 'response is ', response)
        }
    })
}

function unsub2() {
    $.ajax({
        url: '/subscription/' + poll + '/rw/cfg',
        type: 'DELETE',
        success: function (response) {
            console.log('Delete success', 'response is ', response)
        }
    })
}

function getSubGroup() {
    $.ajax({
        url: '/subscription/' + poll,
        type: 'GET'

    }).done(function (response) {
        console.log('getSubG response is ', response)
        var state = response.childNodes[0].childNodes[3].childNodes[0].childNodes[3]
        let i = 0;
        while (state.childNodes[i] !== undefined) {
            console.log('state ', state.childNodes[i])

            i++
        }

    })
}

function getSub(urlPath) {
    $.ajax({
        url: urlPath,
        type: 'GET'
    }).done(getSubManage)
        .fail(function (jqXHR, exception) {
            failRequest(jqXHR, exception, getSub)
        });
}

function failRequest(jqXHR, exception, func) {
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
        setTimeout(
            func
            , 100)
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }
    console.error('[ERROR] ', msg)
}

function getSubManage(response) {
    console.log('get success', 'response is ', response)
    console.log('childNodes[0] ', response.childNodes[0].childNodes[3].childNodes[1].childNodes[2])
    var subStatus = response.childNodes[0].childNodes[3].childNodes[1].childNodes[2].childNodes[0]
    // if not sub call sub
    if (subStatus == null) {
        sub('/subscription')
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
        console.log('poll', poll, typeof (poll))
        locationSub = locationSub.slice(0, 5) + baseLocation + locationSub.slice(5)
    }
}

function name1(params) {
    console.log("click" + params)

    testCall(name1)

    console.log("click123123")

}

function testCall(params) {
    console.log("testCall")
    setTimeout(
        params
        , 1000)


}