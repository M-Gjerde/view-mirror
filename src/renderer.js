import CreateLayout from "./createLayout.js";


// 2. Trigger this event wherever you wish
setInterval(function () {
    console.log("SetMouse");
    document.dispatchEvent(new Event('mousemove'));
}, 10000)

//document.dispatchEvent(new Event('mousemove'));


let layout = new CreateLayout();


window.electronAPI.data((event, value) => {

    if (value.split(":").length > 1) {
        let key = value.split("::")[0];
        let msg = value.replace(key + "::", "");
        switch (key) {
            case "time":
                layout.setTime(msg);
                break;
            case "weather":
                layout.setWeather(msg);
                break;
            default:
                console.log("Renderer did not accept key in msg from application")
                break;
        }
    }
})

