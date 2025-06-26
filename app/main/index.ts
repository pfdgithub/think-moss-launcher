import { app, BrowserWindow, dialog } from "electron";
import started from "electron-squirrel-startup";
import Windows from "./Windows.js";

const windows = new Windows();

const createWindow = async () => {
  try {
    await windows.createMainWindow();
  } catch (error: any) {
    dialog.showErrorBox("错误", error?.message);
  }
};

if (started) {
  app.quit();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
