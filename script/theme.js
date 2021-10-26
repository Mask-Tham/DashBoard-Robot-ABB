var namePage;

function changeTheme(icon) {
    // namePage = document.getElementsByTagName("title")[0].textContent;
    // let icon = document.getElementById('themeMode').className
    let r = document.querySelector(':root');
    // console.log('click')
    // console.log(icon)
    // $('#iconTheme').attr('src','/docs/svg/sun.svg')
    if (icon == 'moon') {
        // theme dark
        console.log(icon)
        $('#iconTheme').attr('src', '/docs/svg/sun.svg')
        $('#themeMode').attr('class', 'sun')
        r.style.setProperty('--background-color', '#6e6e6e');
        r.style.setProperty('--base-color', '#262626');
        r.style.setProperty('--text-color', '#fff');
        r.style.setProperty('--box-shadow-color', '#a9a9a9');
        r.style.setProperty('--box-shadow-hover-color', '#a9a9a9');
        r.style.setProperty('--cover-color', '#a9a9a9');
    } else {
        // theme light
        console.log(icon)
        $('#iconTheme').attr('src', '/docs/svg/moon.svg')
        $('#themeMode').attr('class', 'moon')
        r.style.setProperty('--background-color', '#f6f6f6');
        r.style.setProperty('--base-color', '#fff');
        r.style.setProperty('--text-color', '#000');
        r.style.setProperty('--box-shadow-color', '#0000001a');
        r.style.setProperty('--box-shadow-hover-color', '#0000001a');
        r.style.setProperty('--cover-color', '#f6f6f6');
    }
}

function changeThemeChart(icon) {
    switch (namePage) {
        case 'Dashboard':
            $.getScript('./script/dashboard.js', function () {

                checkTheme(icon);
            });
            break;
        case 'Event Log':
            $.getScript('./script/elog.js', function () {

                checkTheme(icon);
            });
            break;
        case 'Energy':
            $.getScript('./script/energy.js', function () {

                checkTheme(icon);
            });
            break;
        case 'Rapid Data setting':
            $.getScript('./script/set_io.js', function () {

                checkTheme(icon);
            });
            break;
        case 'Robot Control':
            $.getScript('./script/RobotControl.js', function () {

                checkTheme(icon);
            });
            break;
        case 'Jogging':
            $.getScript('./script/Jogging.js', function () {

                checkTheme(icon);
            });
            break;
        case 'TCP Speed':
            $.getScript('./script/TCPSpeed.js', function () {

                checkTheme(icon);
            });
            break;
        default:
            break;
    }
}

function clickChangeTheme() {
    let icon = document.getElementById('themeMode').className
    changeTheme(icon)
    changeThemeChart(icon)
    setCookie("theme_icon", icon, 365)
}

function checkTheme(data) {
    let icon = data.theme_icon
    console.log('theme', data)
    sessionStorage.setItem("icon", icon);
    changeTheme(icon)
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    // console.log('cookie', decodedCookie, 'cookie',ca)
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        // console.log('cookie', c.substring(1))
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
            // console.log('cookie', c)
        }
        // console.log('cookie', c.indexOf(name))
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var icon = getCookie("theme_icon");
    if (icon != "") {
        // alert("Welcome again " + user);
        changeTheme(icon)
        // changeThemeChart(icon)

    } else {
        // user = prompt("Please enter your name:", "");
        // if (user != "" && user != null) {
        //     setCookie("username", user, 30);
        // }
        console.log('set theme')
        setCookie("theme_icon", "sun", 365)
    }
}

$(document).ready(function () {
    namePage = document.getElementsByTagName("title")[0].textContent;
    console.log('theme again')
    checkCookie()
})