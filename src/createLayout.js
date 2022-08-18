const WEAHTER_ICON_PATH = "./icons/"

export default class CreateLayout {
    constructor() {
        this.createLayout();
    }

    setTime(time) {
        console.log(time);
        this.txtCurrentTime.innerText = time;
    }

    setWeather(msg) {
        let obj = JSON.parse(msg);
        this.setTodayWeatherInfo("temp", obj.temp);
        this.setTodayWeatherInfo("max", obj.max);
        this.setTodayWeatherInfo("min", obj.min);
        this.setTodayWeatherInfo("current desc", obj.desc);

        this.setTodayWeatherInfo("sunrise", obj.sunrise);
        this.setTodayWeatherInfo("sunset", obj.sunset);
        this.setTodayWeatherInfo("image", obj.icon);

        for (let i = 0; i < obj.weeklyUpdate.length; i++){
            this.setSevenDayForecast("temp", obj.weeklyUpdate[i].maxTemp, i);
            this.setSevenDayForecast("day", obj.weeklyUpdate[i].date, i);
            this.setSevenDayForecast("image", obj.weeklyUpdate[i].icon, i);

        }


    }

    setTodayWeatherInfo(key, value) {
        switch (key) {
            case "temp":
                this.txtCurrentWeather.innerText = value;
                break;
            case "current desc":
                this.txtCurrentWeatherDesc.innerText = value;
                break;
            case "image":
                this.imgCurrentWeather.src = WEAHTER_ICON_PATH + value +  "@2x.png";
                break;
            case "max":
                this.txtWeatherTodayMax.innerText = value;
                break;
            case "min":
                this.txtWeatherTodayMin.innerText = value;
                break;
            case "sunrise":
                this.txtWeatherSunrise.innerText = value;
                break;
            case "sunset":
                this.txtWeatherSunSet.innerText = value;
                break;
            default:
                console.log("WeatherTodayInfo Key value not found");
        }
    }

    setSevenDayForecast(key, value, index) {
        if (index < 0 || index > 6) {
            console.log("Seven day index out of range");
            return;
        }

        switch (key) {
            case "temp":
                document.getElementsByClassName("forecastDayTemp")[index].innerText = value;
                break;
            case "day":
                document.getElementsByClassName("forecastDate")[index].innerText = value;
                break;
            case "image":
                document.getElementsByClassName("forecastDayImg")[index].src = WEAHTER_ICON_PATH + value +  "@2x.png";
                break;
            default:
                console.log("WeatherTodayInfo Key value not found");
        }


    }

    createLayout() {

        /** Create Weather Window **/
        let weatherAndTimeDiv = document.createElement("div");
        weatherAndTimeDiv.className = "weatherAndTimeDiv";

        let weatherDiv = document.createElement("div");
        weatherDiv.id = "weatherDiv";

        /** CURRENT WEATHER **/
        let divCurrentWeather = document.createElement("div");
        divCurrentWeather.id = "currentWeatherDiv";

        let divCurrentWeatherDesc = document.createElement("div");
        divCurrentWeatherDesc.id = "divCurrentWeatherDesc";

        this.imgCurrentWeather = document.createElement("img");
        this.imgCurrentWeather.id = "currentWeatherImg";
        this.imgCurrentWeather.src = "icons/sunny_clouds.png";
        this.txtCurrentWeather = document.createElement("p");
        this.txtCurrentWeather.innerText = "19\u00B0"
        this.txtCurrentWeather.className = "txtCurrentWeather"
        this.txtCurrentWeatherDesc = document.createElement("p");
        this.txtCurrentWeatherDesc.innerText = "Mostly sunny"
        this.txtCurrentWeatherDesc.className = "txtCurrentWeatherDesc"

        divCurrentWeatherDesc.append(this.txtCurrentWeather);
        divCurrentWeatherDesc.append(this.txtCurrentWeatherDesc);
        divCurrentWeather.append(this.imgCurrentWeather);
        divCurrentWeather.append(divCurrentWeatherDesc);


        weatherDiv.append(divCurrentWeather);

        /** TODAY'S WEATHER STATS **/
        let divCurrentWeatherStats = document.createElement("div");
        divCurrentWeatherStats.id = "divCurrentWeatherStats";

        let divUpperRow = document.createElement("div");
        divUpperRow.className = "divCurrentWeatherRow";
        let divMinerRow = document.createElement("div");
        divMinerRow.className = "divCurrentWeatherRow";

        let divWeatherTodayElementMax = document.createElement("div");
        divWeatherTodayElementMax.className = "divWeatherTodayElement";

        let divWeatherTodayElementMin = document.createElement("div");
        divWeatherTodayElementMin.className = "divWeatherTodayElement";

        let divWeatherTodayElementSunrise = document.createElement("div");
        divWeatherTodayElementSunrise.className = "divWeatherTodayElement";

        let divWeatherTodayElementSunset = document.createElement("div");
        divWeatherTodayElementSunset.className = "divWeatherTodayElement";

        this.txtWeatherTodayMax = document.createElement("p");
        this.txtWeatherTodayMax.className = "weatherTodayStats";
        this.txtWeatherTodayMax.innerText = "24\u00B0";

        this.txtWeatherTodayMin = document.createElement("p");
        this.txtWeatherTodayMin.className = "weatherTodayStats";
        this.txtWeatherTodayMin.innerText = "13\u00B0";

        this.txtWeatherSunrise = document.createElement("p");
        this.txtWeatherSunrise.className = "weatherTodayStats";
        this.txtWeatherSunrise.innerText = "06:26";

        this.txtWeatherSunSet = document.createElement("p");
        this.txtWeatherSunSet.className = "weatherTodayStats";
        this.txtWeatherSunSet.innerText = "21:07";

        let txtWeatherTodayMaxDesc = document.createElement("p");
        txtWeatherTodayMaxDesc.className = "weatherTodayDesc";
        txtWeatherTodayMaxDesc.innerText = "High";

        this.txtWeatherTodayMinDesc = document.createElement("p");
        this.txtWeatherTodayMinDesc.className = "weatherTodayDesc";
        this.txtWeatherTodayMinDesc.innerText = "Low";

        let txtWeatherSunriseDesc = document.createElement("p");
        txtWeatherSunriseDesc.className = "weatherTodayDesc";
        txtWeatherSunriseDesc.innerText = "Sunrise";

        let txtWeatherSunSetDesc = document.createElement("p");
        txtWeatherSunSetDesc.className = "weatherTodayDesc";
        txtWeatherSunSetDesc.innerText = "Sunset";


        divWeatherTodayElementMax.append(this.txtWeatherTodayMax);
        divWeatherTodayElementMax.append(txtWeatherTodayMaxDesc);

        divWeatherTodayElementMin.append(this.txtWeatherTodayMin);
        divWeatherTodayElementMin.append(this.txtWeatherTodayMinDesc);

        divWeatherTodayElementSunrise.append(this.txtWeatherSunrise);
        divWeatherTodayElementSunrise.append(txtWeatherSunriseDesc);

        divWeatherTodayElementSunset.append(this.txtWeatherSunSet);
        divWeatherTodayElementSunset.append(txtWeatherSunSetDesc);

        divUpperRow.append(divWeatherTodayElementMax);
        divUpperRow.append(divWeatherTodayElementSunrise);

        divMinerRow.append(divWeatherTodayElementMin);
        divMinerRow.append(divWeatherTodayElementSunset);

        divCurrentWeatherStats.append(divUpperRow);
        divCurrentWeatherStats.append(divMinerRow);
        weatherDiv.append(divCurrentWeatherStats);

        /** CURRENT TIME **/
        let divCurrentTime = document.createElement("div");
        divCurrentTime.id = "divCurrentTime";

        this.txtCurrentTime = document.createElement("p");
        this.txtCurrentTime.id = "currentTime";
        this.txtCurrentTime.innerText = "00:00";

        divCurrentTime.append(this.txtCurrentTime);
        weatherDiv.append(divCurrentTime);

        /** 7 DAY FORECAST **/
        let divForecast = document.createElement("div");
        divForecast.id = "divForecast";

        for (let i = 0; i < 7; i++) {
            let divForecastElement = document.createElement("div");
            divForecastElement.className = "divForecastElement";

            let txtForecastDay = document.createElement("p");
            txtForecastDay.innerText = "Mon";
            txtForecastDay.className = "forecastDate";

            let imgForecastDay = document.createElement("img");
            imgForecastDay.className = "forecastDayImg";
            imgForecastDay.src = "icons/sunny_clouds.png";

            let txtForecastTemp = document.createElement("p");
            txtForecastTemp.innerText = "24\u00B0";
            txtForecastTemp.className = "forecastDayTemp";

            divForecastElement.append(txtForecastDay)
            divForecastElement.append(imgForecastDay)
            divForecastElement.append(txtForecastTemp)

            divForecast.append(divForecastElement);
        }

        weatherAndTimeDiv.append(weatherDiv);
        weatherAndTimeDiv.append(divForecast);

        document.body.append(weatherAndTimeDiv);
    }
}
