import CreateLayout from "./createLayout.js";


let layout = new CreateLayout();
window.electronAPI.data((event, value) => {
    if (value.split("::").length > 1) {
        let key = value.split("::")[0];
        console.log(key)
        let msg = value.replace(key + "::", "");
        switch (key) {
            case "time":
                layout.setTime(msg);
                break;
            case "weather":
                layout.setWeather(msg);
                break;
            case "fade":
                if (msg === "in")
                    fadeIn(document.body);
                if (msg === "out")
                    fadeOut(document.body);

                break;
            case "fadeOut":
                break;
            default:
                console.log("Renderer did not accept key in msg from application")
                break;
        }
    } else {
        console.log("Not a valid renderer data format: " + value)
    }

})

function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.01) {
            clearInterval(timer);
            element.style.display = 'block';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 50);
}
