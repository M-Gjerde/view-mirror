// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Application = require("./Application");
const { Worker, isMainThread } = require('node:worker_threads');

/** INITIALIZE WORKER THREAD FOR BACKEND TASKS **/
let windowHandler = null;
if (isMainThread) {
    // This re-loads the current file inside a Worker instance.
    const worker = new Worker(__filename);

    worker.on("message", incoming => {
        try{
            let msgArr = incoming.split(":");

            if (msgArr[0] === "renderer" && windowHandler){
                windowHandler.webContents.send('data', incoming.replace("renderer:", ""));
            }

        } catch (e){
            console.log(incoming, e);
        }
    });

    worker.on("error", code => new Error(`Worker error with exit code ${code}`));
    worker.on("exit", code =>
        console.log(`Worker stopped with exit code ${code}`)
    );

    setTimeout(() => worker.postMessage("stop"), 30000);

} else {
    application = new Application();
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("ready" , () =>{
    console.log("App is ready");
})

// Change
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


/** INITIALIZE BACKEND **/
