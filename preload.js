// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
/*window.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded")
    const replaceText = (selector, text) => {
        const element = document.createElement("p")
        element.innerText = selector + ": " + text;

        document.body.append(element);
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})
*/
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    data: (callback) => ipcRenderer.on('data', callback)
})
