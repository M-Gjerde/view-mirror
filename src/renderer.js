//const PageLoader = require('./PageLoader');
import PageLoader from "./PageLoader.js"

class Application {
    constructor() {

    }

    initialize(){
        this.PageLoader = new PageLoader();

        console.log("Initialized");
        this.running = true;
    }

    update(){


    }

    cleanUp(){

    }
}

let app = new Application()
app.initialize();

while (app.running){
    app.update();

}

app.cleanUp();


