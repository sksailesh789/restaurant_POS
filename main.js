
const { app, BrowserWindow,Notification,ipcMain,Menu,globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs')
const os = require('os')
const isDev = !app.isPackaged ;
let win;
let workerWindow;

function createWindow() {
  // Browser Window <- Renderer Process
   win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    frame: true,  //set frame to false
    webPreferences: {
      nodeIntegration: false,
    //   enableRemoteModule: true,
      // will sanitize JS code
      // TODO: explain when React application is initialize
      worldSafeExecuteJavaScript: true,
      // is a feature that ensures that both, your preload scripts and Electron
      // internal logic run in sparate context
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    
    }
  })
  win.setMenuBarVisibility(false); //hide menu bar
  isDev && win.webContents.openDevTools();
  win.loadFile('index.html')

  workerWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    
    }
  });
  workerWindow.loadFile('worker.html');
    // workerWindow.hide();
    workerWindow.webContents.openDevTools();
    workerWindow.on("closed", () => {
        workerWindow = undefined;
    });
}
if(isDev) {
  require('electron-reload') (__dirname , {
      electron : path.join(__dirname , 'node_modules' , '.bin' , 'electron')
  })
}

app.whenReady().then(() => {
  // const template = require('./utils/Menu').createTemplate(app);
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu)
  globalShortcut.register('Ctrl+O', () => {
    // Do something here
    console.log('global shortcut')
    win.webContents.executeJavaScript(`
    button = document.querySelector('.tableorder');
    if (button) {
      button.click();
    }
  `);
  });
  globalShortcut.register('Ctrl+P', () => {
    // Do something here
    console.log('global shortcut')
    win.webContents.executeJavaScript(`
    button = document.querySelector('.billingtable');
    if (button) {
      button.click();
    }
  `);
  });
  globalShortcut.register('Ctrl+G', () => {
    // Do something here
    console.log('global shortcut')
    win.webContents.executeJavaScript(`
    button = document.querySelector('.tabledata');
    if (button) {
      button.click();
    }
  `);
  });
  globalShortcut.register('Ctrl+F', () => {
    // Do something here
    win.webContents.executeJavaScript(`
    button = document.querySelector('.fastbillingprint');
    if (button) {
      button.click();
    }
  `);
  });

  createWindow();
}).catch(err => console.log(err,'err5'));

ipcMain.on('notify', (_, message) => {
  new Notification({title: 'Notification', body: message}).show();
})


// retransmit it to workerWindow
ipcMain.on("printPdf", (event, content) => {
  console.log(content,'mainpage');
  var options = {
    silent: false,
    printBackground: true,
    color: true,
    margin: {
        marginType: 'printableArea'
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Header of the Page',
    footer: 'Footer of the Page',

  }
  // workerWindow.webContents.send("data", content);
  workerWindow.webContents.print(options, (success, failureReason) => {
    if (!success) console.log(failureReason,'failurereason');

    console.log('Print Initiated');
});

});



ipcMain.on('app-quit', () => {
  app.quit();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })



// Chromium -> web eingine for rendering the UI, full Chrome-like web browser
// V8 -> engine that provides capabilities to execute, run, JS code in the browser
// Node JS(V8) -> we are able to run JS code + provides more features
// Webpack -> is a module builder , main purpose is to bundle JS files for usage in the  browser
// Babel -> is a JS compiler 