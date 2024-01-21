
const {ipcRenderer,contextBridge} = require ('electron')

contextBridge.exposeInMainWorld('electron' , {
    notificationApi: {
        sendNotification(message) {
            ipcRenderer.send('notify' , message)
        }
    },
    printApi: {
        sendPrint(message) {
            // window.postMessage(message, "*");
            const qr = new BroadcastChannel("test");
            qr.postMessage( message );

            console.log(message,'oom')
            ipcRenderer.send('printPdf' )
            return message

        }
    }

   
})

console.log('hello from preload')

