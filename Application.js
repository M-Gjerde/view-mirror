const {workerData, parentPort, isMainThread} = require("worker_threads");
const axios = require('axios').default;

const UPDATE_LOOP_INTERVAL_MS = 1000;
const UPDATE_WEATHER_INTERVAL_MS = 1000 * 60;
const UPDATE_WEEKLY_WEATHER_INTERVAL_MS = 1000 * 3600;
const UPDATE_TIME_INTERVAL_MS = 1000 * 30;

module.exports = class Application {
    constructor(logger) {
        this.logger = logger;
        this.timeTimer = new Date().valueOf();
        this.weatherTodayTimer = new Date().valueOf();
        this.weatherWeeklyTimer = new Date().valueOf();

        this.weatherInfo = {
            city: "Home",
            coord: {lat: "57.0488", lon: "9.9217"},
            temp: "23",
            desc: "",
            descLong: "",
            feelsLike: "",
            icon: "",
            max: "",
            min: "",
            sunrise: "",
            sunset: "",
            weeklyUpdate: [
                {
                    maxTemp: "",
                    desc: "",
                    descLong: "",
                    date: "",
                    icon: ""
                }
            ]

        }
        ; //vanilla object

    }

    // Prepare loop. inspired by game-loops. https://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/
    // Will exit on exceptions, otherwise it will just keep on calling the update function
    interval(func, wait, times) {
        var interv = function (w, t, app) {
            return function () {
                if (typeof t === "undefined" || t-- > 0) {
                    setTimeout(interv, w);
                    try {
                        app.update()
                    } catch (e) {
                        console.log("CONSOLEEE:" + e);
                        t = 0;
                        app.logger.error("Update loop error: " + e.toString());
                    }
                }
            };
        }(wait, times, this);

        setTimeout(interv, wait);
    };

    run() {
        // Set up communication
        this.logger.info("Initializing worker");
        parentPort.on("message", message => {
            if (message === "stop") {
                this.cleanUp();

            } else {
                parentPort.postMessage(message);
            }
        });
        parentPort.postMessage({start: workerData, isMainThread});


        // Prepare render loop and set update interval
        this.interval(this.update, UPDATE_LOOP_INTERVAL_MS);


        setTimeout(() => {
            this.timeUpdate(true);
            this.dailyWeatherUpdate(true);
            this.weeklyWeatherUpdate(true);
        }, 1000);




        this.running = true;
        this.logger.info("Worker initialized");

        setTimeout(() => {
            parentPort.postMessage("renderer::" + "fade::in");
        }, 3000)

    }

    sendUpdate(dst, msg) {
        if (dst === "render") {
            parentPort.postMessage("renderer::" + msg);
        } else {
            parentPort.postMessage("electron::" + msg);
        }
    }

    dailyWeatherUpdate(bypass) {
        // Gather information from OpenWeather API.
        // - Get current weather
        // Make a request for a user with a given ID
        if (this.weatherTodayTimer + UPDATE_WEATHER_INTERVAL_MS < new Date().valueOf() || bypass) {
            let self = this;
            let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.weatherInfo.coord.lat + '&lon=' + this.weatherInfo.coord.lon + '&appid=b5c73fdb1f1e82f68dd7ed28e90bb66c&units=metric';
            self.logger.info("Running dailyWeatherUpdate");
            axios.get(url)
                .then(function (response) {
                    // handle success
                    let res = response.data;
                    self.weatherInfo.desc = res.weather[0].main;
                    self.weatherInfo.descLong = res.weather[0].description;
                    self.weatherInfo.temp = Math.round(res.main.temp) + "\u00B0";
                    self.weatherInfo.max = Math.round(res.main.temp_max) + "\u00B0";
                    self.weatherInfo.min = Math.round(res.main.temp_min) + "\u00B0";
                    self.weatherInfo.feelsLike = Math.round(res.main.feels_like)  + "\u00B0";
                    self.weatherInfo.icon = res.weather[0].icon;

                    // Convert to human-readable dates
                    // Multiply by 1000 because seconds is returned by openweather API and Date object takes milliseconds.
                    // Convert to local time using toLocalteTimeString. Remove last three characters to omit seconds.
                    self.weatherInfo.sunrise = new Date(res.sys.sunrise * 1000).toLocaleTimeString('da-DK').slice(0, -3);
                    self.weatherInfo.sunset = new Date(res.sys.sunset * 1000).toLocaleTimeString('da-DK').slice(0, -3);

                    self.logger.info("Success: dailyWeatherUpdate");
                    self.sendUpdate("render", "weather::" + JSON.stringify(self.weatherInfo));

                })
                .catch(function (error) {
                    // handle error
                    self.logger.error("dailyWeatherUpdate: " + error);
                })
                .then(function () {
                    self.weatherTodayTimer = new Date().valueOf();
                    // always executed
                });


        }
    }

    weeklyWeatherUpdate(bypass) {
        // - Get 5 days forecast
        if (this.weatherWeeklyTimer + UPDATE_WEEKLY_WEATHER_INTERVAL_MS < new Date().valueOf() || bypass) {
            let self = this;
            let url = "https://api.openweathermap.org/data/3.0/onecall";
            self.logger.info("Running weeklyWeatherUpdate");
            let payload =
                {
                    lat: self.weatherInfo.coord.lat,
                    lon: self.weatherInfo.coord.lon,
                    units: 'metric',
                    APPID: 'b5c73fdb1f1e82f68dd7ed28e90bb66c',
                    exclude: "exclude=current,minutely,hourly,alerts",
                };

            axios.get(url, {params: payload})
                .then(function (response) {
                    // handle success
                    let res = response.data;
                    self.weatherInfo.weeklyUpdate = []

                    for (let i = 0; i < res.daily.length; i++) {
                        let obj = res.daily[i];
                        let date = new Date(res.daily[i].dt * 1000).toDateString();
                        // Skip today because we don't need it.
                        if (date === new Date().toDateString()) {
                            continue;
                        }
                        self.weatherInfo.weeklyUpdate.push({
                            desc: obj.weather[0].main,
                            descLong: obj.weather[0].description,
                            maxTemp: Math.round(obj.temp.max) + "\u00B0",
                            date: new Date(obj.dt * 1000).toLocaleDateString('en-GB', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).slice(0, 3),
                            icon: obj.weather[0].icon,
                        })
                    }

                    self.logger.info("Success: weeklyWeatherUpdate");
                    self.sendUpdate("render", "weather::" + JSON.stringify(self.weatherInfo));
                })
                .catch(function (error) {
                    // handle error
                    self.logger.error("weeklyWeatherUpdate: " + error);
                })
                .then(function () {
                    self.weatherWeeklyTimer = new Date().valueOf();
                    // always executed
                });
        }
    }

    timeUpdate(bypass){
        // Set current time
        if (this.timeTimer + UPDATE_TIME_INTERVAL_MS < new Date().valueOf() || bypass) {

            let timeString = "time::" + new Date().toLocaleTimeString("en-us", {hour12: false}).slice(0, -3);
            this.sendUpdate("render", timeString);
            this.timeTimer = new Date().valueOf();
            this.logger.info("Success: timeUpdate");

        }

    }

    update() {
        this.dailyWeatherUpdate();
        this.weeklyWeatherUpdate();
        this.timeUpdate();


    }

    cleanUp() {
        parentPort.close();
    }
}


