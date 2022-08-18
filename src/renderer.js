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
            default:
                console.log("Renderer did not accept key in msg from application")
                break;
        }
    } else {
        console.log("Not a valid renderer data format: " + value)
    }

})
