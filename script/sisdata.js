var path = ['/rw/devices/HW_DEVICES/MECH_UNITS/ROB1/', '?lang=en&json=1']
var refFolder = new Array
var nameFolder = new Object
var oldRef = new Array
var indexGlobal = -1
var objData = new Object

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

function getData2(urlPath, eventfunc, title) {
    $.ajax({
        url: urlPath,
        dataType: 'json'
    }).done(function (data) {
        eventfunc(data, title)
        // console.log('title', title)
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
                    getData2(urlPath, eventfunc, title);
                }, 100)
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.error('[ERROR] ', msg)
            // $('#post').html(msg);
        });

}

function listSIS(data, title) {
    let base = data._links.base.href
    let devices = data._embedded._state[0].devices

    console.log(devices)
    var content = document.getElementById('content')

    var div_row_title = document.createElement("div");
    div_row_title.setAttribute("class", "row");
    for (const iterator of devices) {
        // console.log(iterator)
        var div_row = document.createElement("div");
        div_row.setAttribute("class", "row");
        if (iterator.value == undefined) {
            // console.log(iterator._links.self.href)
            let href = iterator._links.self.href
            let name = iterator.name

            let block = document.createElement('div')
            // block.setAttribute('class', 'card')
            // block.setAttribute('id', href)

            let CardTitle = document.createElement("div");
            CardTitle.setAttribute("class", "card_title");
            CardTitle.appendChild(document.createTextNode(name));

            block.appendChild(CardTitle)
            if (title != 'success') {
                console.log('title', title)
                // let block = document.createElement('li')
                block.setAttribute('class', 'card_title_block')
                block.setAttribute('id', href)
                let block_title = document.getElementById(title)
                block_title.appendChild(block)
            } else {
                // console.log('block')
                // let block = document.createElement('div')
                block.setAttribute('class', 'card')
                block.setAttribute('id', href)
                div_row.appendChild(block)
                content.appendChild(div_row)
            }

            getData2(base + href + path[1], listSIS, href)

        } else {
            const name = iterator.name;
            const value = iterator.value;
            const unit = iterator.unit;
            // console.log('name',name)
            var card = createElementBlock(name, value, unit)
            div_row_title.appendChild(card)

            // let card_title = document.getElementById(title)
            // card_title.appendChild(card)

        }
    }

    if (devices[0].value != undefined) {
        let card_title = document.getElementById(title)
        card_title.appendChild(div_row_title)
        showPage()
    }
}

function createElementBlock(name, value, unit) {
    var div_col = document.createElement("div");
    div_col.setAttribute("class", "col1")

    var card = document.createElement("div");
    card.setAttribute("class", "card_block card-body");

    var CardHeader = document.createElement("div");
    CardHeader.setAttribute("class", "card_header");

    var CardBody = document.createElement("div");
    CardBody.setAttribute("class", "text-right");

    CardHeader.appendChild(document.createTextNode(name));
    CardBody.appendChild(document.createTextNode(value + ' ' + unit));

    card.appendChild(CardHeader)
    card.appendChild(CardBody)
    div_col.appendChild(card)

    return div_col

}

function showPage() {
    document.getElementById("coverLoading").style.display = "none";
    
}

window.onload = function () {
    refFolder = new Array
    nameFolder = new Object
    // getData('/rw/devices/HW_DEVICES/MECH_UNITS/ROB1/SIS_DATA_ROB1?lang=en&json=1', manageData)
    getData('http://127.0.0.1:80/rw/devices/HW_DEVICES/MECH_UNITS/ROB1/?lang=en&json=1', listSIS)
    // getData('http://127.0.0.1:80/rw/devices/HW_DEVICES/MECH_UNITS/ROB1/?lang=en&json=1', SISObjData)
}