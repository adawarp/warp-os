const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const url = require('url');
const Server = require('./server/Server');

let mainWindow;
let server;

function createWindow() {
  server = new Server();
  server.start();
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(url.format({
    pathname: 'localhost:9000',
    protocol: 'http:',
    slashes: true
  }));

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }

});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }

});
