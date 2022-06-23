
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

let imgCurrentWeather = document.createElement("img");
imgCurrentWeather.id = "currentWeatherImg";
imgCurrentWeather.src = "icons/sunny_clouds.png";
let txtCurrentWeather = document.createElement("p");
txtCurrentWeather.innerText = "19\u00B0"
txtCurrentWeather.className = "txtCurrentWeather"
let txtCurrentWeatherDescription = document.createElement("p");
txtCurrentWeatherDescription.innerText = "Mostly sunny"
txtCurrentWeatherDescription.className = "txtCurrentWeatherDescription"
divCurrentWeatherDesc.append(txtCurrentWeather);
divCurrentWeatherDesc.append(txtCurrentWeatherDescription);
divCurrentWeather.append(imgCurrentWeather);
divCurrentWeather.append(divCurrentWeatherDesc);


weatherDiv.append(divCurrentWeather);

/** TODAY'S WEATHER STATS **/
let divCurrentWeatherStats = document.createElement("div");
divCurrentWeatherStats.id = "divCurrentWeatherStats";

let divUpperRow =  document.createElement("div");
divUpperRow.className = "divCurrentWeatherRow";
let divLowerRow =  document.createElement("div");
divLowerRow.className = "divCurrentWeatherRow";

let divWeatherTodayElementHigh = document.createElement("div");
divWeatherTodayElementHigh.className = "divWeatherTodayElement";

let divWeatherTodayElementLow = document.createElement("div");
divWeatherTodayElementLow.className = "divWeatherTodayElement";

let divWeatherTodayElementSunrise = document.createElement("div");
divWeatherTodayElementSunrise.className = "divWeatherTodayElement";

let divWeatherTodayElementSunset = document.createElement("div");
divWeatherTodayElementSunset.className = "divWeatherTodayElement";

let txtWeatherTodayHigh = document.createElement("p");
txtWeatherTodayHigh.className = "weatherTodayStats";
txtWeatherTodayHigh.innerText = "24\u00B0";

let txtWeatherTodayLow = document.createElement("p");
txtWeatherTodayLow.className = "weatherTodayStats";
txtWeatherTodayLow.innerText = "13\u00B0";

let txtWeatherSunrise = document.createElement("p");
txtWeatherSunrise.className = "weatherTodayStats";
txtWeatherSunrise.innerText = "06:26";

let txtWeatherSunSet = document.createElement("p");
txtWeatherSunSet.className = "weatherTodayStats";
txtWeatherSunSet.innerText = "21:07";

let txtWeatherTodayHighDesc = document.createElement("p");
txtWeatherTodayHighDesc.className = "weatherTodayDesc";
txtWeatherTodayHighDesc.innerText = "High";

let txtWeatherTodayLowDesc = document.createElement("p");
txtWeatherTodayLowDesc.className = "weatherTodayDesc";
txtWeatherTodayLowDesc.innerText = "Low";

let txtWeatherSunriseDesc = document.createElement("p");
txtWeatherSunriseDesc.className = "weatherTodayDesc";
txtWeatherSunriseDesc.innerText = "Sunrise";

let txtWeatherSunSetDesc = document.createElement("p");
txtWeatherSunSetDesc.className = "weatherTodayDesc";
txtWeatherSunSetDesc.innerText = "Sunset";


divWeatherTodayElementHigh.append(txtWeatherTodayHigh);
divWeatherTodayElementHigh.append(txtWeatherTodayHighDesc);

divWeatherTodayElementLow.append(txtWeatherTodayLow);
divWeatherTodayElementLow.append(txtWeatherTodayLowDesc);

divWeatherTodayElementSunrise.append(txtWeatherSunrise);
divWeatherTodayElementSunrise.append(txtWeatherSunriseDesc);

divWeatherTodayElementSunset.append(txtWeatherSunSet);
divWeatherTodayElementSunset.append(txtWeatherSunSetDesc);

divUpperRow.append(divWeatherTodayElementHigh);
divUpperRow.append(divWeatherTodayElementSunrise);

divLowerRow.append(divWeatherTodayElementLow);
divLowerRow.append(divWeatherTodayElementSunset);

divCurrentWeatherStats.append(divUpperRow);
divCurrentWeatherStats.append(divLowerRow);
weatherDiv.append(divCurrentWeatherStats);

/** CURRENT TIME **/
let divCurrentTime = document.createElement("div");
divCurrentTime.id = "divCurrentTime";

let txtCurrentTime = document.createElement("p");
txtCurrentTime.id = "currentTime";
txtCurrentTime.innerText = "11:32";

divCurrentTime.append(txtCurrentTime);
weatherDiv.append(divCurrentTime);

/** 7 DAY FORECAST **/
let divForecast = document.createElement("div");
divForecast.id = "divForecast";

for (let i = 0; i < 7; i++){
    let divForecastElement = document.createElement("div");
    divForecastElement.className = "divForecastElement";

    let txtForecastDay = document.createElement("p");
    txtForecastDay.innerText = "Mon";
    txtForecastDay.className = "forecastDay";

    let imgForecastDay = document.createElement("img");
    imgForecastDay.className = "forecastDayImg";
    imgForecastDay.src = "icons/sunny_clouds.png";

    let txtForecastTemp = document.createElement("p");
    txtForecastTemp.innerText = "24\u00B0";
    txtForecastTemp.className = "forecastDay";

    divForecastElement.append(txtForecastDay)
    divForecastElement.append(imgForecastDay)
    divForecastElement.append(txtForecastTemp)

    divForecast.append(divForecastElement);
}

weatherAndTimeDiv.append(weatherDiv);
weatherAndTimeDiv.append(divForecast);

document.body.append(weatherAndTimeDiv);


window.electronAPI.data((event, value) => {
    console.log(event, value);
})