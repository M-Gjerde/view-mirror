// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Application = require("./Application");
const {Worker, isMainThread} = require('node:worker_threads');
const {transports, createLogger, format} = require('winston');
const {log} = require("winston");
/** INITIALIZE LOGGER **/
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'}),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
    }));
}

/** INITIALIZE WORKER THREAD FOR BACKEND TASKS **/
let windowHandler = null;
if (isMainThread) {
    // This re-loads the current file inside a Worker instance.

    const worker = new Worker(__filename);

    worker.on("message", incoming => {
        try {
            logger.info("Message from worker: " + incoming);
            if (typeof incoming === 'string' || incoming instanceof String) {
                let msgArr = incoming.split("::");
                if (msgArr[0] === "renderer" && windowHandler) {
                    windowHandler.webContents.send('data', incoming.replace("renderer::", ""));
                }
            }
        } catch
            (e) {
            logger.error(incoming, e);
        }

    });

    worker.on("error", code => {
        new Error(`Worker error with exit code ${code}`);
        logger.error(`Worker error with exit code ${code}`);
    });
    worker.on("exit", code => {
            console.log(`Worker stopped with exit code ${code}`)
            logger.error(`Worker stopped with exit code ${code}`);
        },
    );

    logger.info("Initialized worker");

} else {
    application = new Application(logger);
    application.run();
    return;
}

/** INITIALIZE WINDOW AND RENDERER **/
const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    win.loadFile('src/index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    win.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'q') {
            win.close();
        }
    })

    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })
    windowHandler = win;

    logger.info("Window successfully created")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();

        logger.info("Window Launched")

    })
})

app.on("ready", () => {
    logger.info("Application is ready")
})

// Change
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


/** INITIALIZE BACKEND **/
