const {workerData, parentPort, isMainThread} = require("worker_threads");

const UPDATE_LOOP_INTERVAL_MS = 250;

module.exports = class Application {
    constructor() {
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
                        t = 0;
                        console.log(e)
                    }
                }
            };
        }(wait, times, this);

        setTimeout(interv, wait);
    };

    initialize() {
        // Set up communication
        console.log("initialization");
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

        this.running = true;
        console.log(this.running);
    }

    update() {
        parentPort.postMessage("Render loop");

    }

    cleanUp() {
        parentPort.close();

    }
}


