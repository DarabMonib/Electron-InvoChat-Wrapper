const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
app.commandLine.appendSwitch("ignore-certificate-errors");
const path = require("path");
const { electron } = require("process");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "views/main/preload.js"),
    },
  });

  // Base Screen..
  const view = new BrowserView({ show: false });

  mainWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 53, width: 800, height: 522 });
  view.setAutoResize({ height: true, width: true });
  // view.webContents.loadURL("https://random.localhost.app:4443/direct/darabmonib")
  view.webContents.loadURL("https://invofolks.invochat.io/rooms/general");
  view.webContents.openDevTools();
  view.setBackgroundColor("transparent");

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //  mainWindow.loadURL("https://random.localhost.app:4443/direct/darabmonib")
  mainWindow.loadFile(path.join(__dirname, "views/main/index.html"));
  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // mainWindow.on("resize", () => {
  //   view.setBounds({
  //     x: 0,
  //     y: 53,
  //     width: mainWindow.getSize()[0],
  //     height: mainWindow.getSize()[1] - 78,
  //   });
  //   console.log(mainWindow.getSize());
  // });

  // Create the browser window.
  const switchWindow = new BrowserWindow({
    width: 400,
    height: 270,
    webPreferences: {
      preload: path.join(__dirname, "views/switch/preload.js"),
    },
    frame: false,
    show: false,
  });

  switchWindow.setMenu(null);
  switchWindow.loadFile(path.join(__dirname, "views/switch/index.html"));

  ipcMain.on("toggleSwitch", () => {
    switchWindow.show();
  });

  ipcMain.on("cancelSwitch", () => {
    switchWindow.hide();
  });

  ipcMain.on("switch", (ev, urlToLoad) => {
    switchWindow.hide();
    view.webContents.loadURL(urlToLoad);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
