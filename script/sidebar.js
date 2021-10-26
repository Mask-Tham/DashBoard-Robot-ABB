var namePage;
var href = ['/docs/DashBoard.html',
    '/docs/elog.html',
    '/docs/energy.html',
    '/docs/io.html',
    '/docs/RobotControl.html',
    '/docs/Jogging.html',
    '/docs/TCPSpeed.html',
    '/docs/sis.html',
    // '/docs/test.html'
]
var nameIcon = ['fa fa-bar-chart-o fa-lg fa-fw',
    'fa fa-newspaper-o fa-lg fa-fw',
    'fa fa-battery-4 fa-lg fa-fw',
    'fa fa-tv fa-lg fa-fw',
    'fa fas fa-laptop fa-lg fa-fw',
    'fa fas fa-gamepad fa-lg fa-fw ',
    'fa fa-tachometer fa-lg fa-fw ',
    'fa fa-clock-o fa-lg fa-fw',]
    // 'fa fa-battery-4 fa-lg fa-fw']
var namePageSidebar = ['Dashboard',
    'Event Log',
    'Energy',
    'Rapid Data',
    'Operation Panel',
    'Jogging',
    'TCP Speed',
    'SIS Data',]
    // 'TEST']

function createSidebar() {
    var tree = document.createDocumentFragment();
    var ul_block = document.createElement("ul");
    ul_block.setAttribute("class", "nav nav-sidebar");

    for (var i = 0; i < href.length; i++) {
        var liNamePage = document.createElement("li");

        var aHref = document.createElement("a")
        aHref.setAttribute("href", href[i])
        if (namePageSidebar[i] == namePage) {
            aHref.setAttribute("class", 'active')
        }

        var tag_i = document.createElement('i');
        tag_i.setAttribute('class', nameIcon[i]);

        var span = document.createElement('span');
        span.appendChild(document.createTextNode(namePageSidebar[i]));

        aHref.appendChild(tag_i)
        aHref.appendChild(span)

        var li_divider = document.createElement('li');
        li_divider.setAttribute('role', 'separator'); ''
        li_divider.setAttribute('class', 'divider');

        liNamePage.appendChild(aHref)

        ul_block.appendChild(liNamePage);
        ul_block.appendChild(li_divider);
    }

    tree.appendChild(ul_block);
    document.getElementById("sidebar").appendChild(tree);
}

// collapsible side bar
function sidebarToggleOnClick() {
    $('#sidebar-toggle-button').on('click', function () {
        $('#sidebar').toggleClass('sidebar-toggle');
        $('#page-content-wrapper').toggleClass('page-content-toggle');
        console.log('namePage', namePage)
        switch (namePage) {
            case 'Energy':
                $.getScript('./script/energy.js', function () {
                    $("#chart_total").highcharts().reflow();
                    $("#chart_Axes1").highcharts().reflow();
                    $("#chart_Axes2").highcharts().reflow();
                    $("#chart_Axes3").highcharts().reflow();
                    $("#chart_Axes4").highcharts().reflow();
                    $("#chart_Axes5").highcharts().reflow();
                    $("#chart_Axes6").highcharts().reflow();
                });
                break;
            case 'Event Log':
                $.getScript('./script/elog.js', function () {
                    chartElog.render();
                });
                break;
            case 'Dashboard':
                $.getScript('./script/dashboard.js', function () {
                    // console.log('1554456456456')
                    chartElog.render();
                    $("#chart_Energy").highcharts().reflow();
                    $("#chart_statusRobot").highcharts().reflow();
                    // chartEnergy.highcharts().reflow();
                    // chartStatusRobot .highcharts().reflow();
                });
                break;
        }
    });
}

// window.onload = function () {
//     sidebarToggleOnClick();
// }

$(document).ready(function () {
    namePage = document.getElementsByTagName("title")[0].textContent;
    console.log('namePage', namePage)
    createSidebar();
    sidebarToggleOnClick();
})