import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { MossConfig } from "../types.js";
import Browser from "./Browser.js";
import {
  isProd,
  preloadFilePath,
  rendererDevUrl,
  rendererFilePath,
} from "./config.js";
import Logs from "./Logs.js";
import Settings from "./Settings.js";

class Windows {
  /** 日志 */
  private logs: Logs;

  /** 配置 */
  private settings: Settings;

  /** 浏览器 */
  private browser: Browser;

  /** 主窗口 */
  private mainWindow: BrowserWindow | undefined;

  constructor() {
    this.logs = new Logs({ onChange: this.onLogsChange });
    this.settings = new Settings(this.logs, {
      onChange: this.onSettingsChange,
    });
    this.browser = new Browser(this.logs, {
      onChange: this.onBrowserChange,
    });

    this.handleIPC();
    this.settings.loadConfig();
  }

  /** 创建主窗口 */
  public createMainWindow() {
    const mainWindow = new BrowserWindow({
      width: 500,
      height: 400,
      minWidth: 500,
      minHeight: 400,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: preloadFilePath,
      },
    });
    this.mainWindow = mainWindow;

    mainWindow.once("ready-to-show", () => {
      mainWindow?.show();
    });

    mainWindow.once("closed", () => {
      this.mainWindow = undefined;
    });

    mainWindow.on("close", this.closeWindow);

    if (isProd) {
      mainWindow.loadFile(rendererFilePath);
    } else {
      mainWindow.webContents.openDevTools();
      mainWindow.loadURL(rendererDevUrl);
    }
  }

  /** 关闭窗口 */
  private closeWindow = async (event: Electron.Event) => {
    if (!this.browser.getRunning()) {
      return;
    }

    // 阻止关闭
    event.preventDefault();

    const result = await dialog.showMessageBox({
      type: "question",
      title: "确认关闭",
      message: "应用运行中，确认关闭窗口？",
      buttons: ["取消", "确认"],
    });

    if (result.response === 0) {
      return;
    }

    // 关闭浏览器
    await this.browser?.stopBrowser();

    // 避免递归调用
    this.mainWindow?.off("close", this.closeWindow);

    // 关闭窗口
    this.mainWindow?.close();
  };

  /** 监听日志变更 */
  private onLogsChange = (log: string) => {
    this.mainWindow?.webContents.send("logs-change", log);
  };

  /** 监听配置变更 */
  private onSettingsChange = (config?: MossConfig) => {
    this.mainWindow?.webContents.send("settings-change", config);
  };

  /** 监听状态变更 */
  private onBrowserChange = (running: boolean) => {
    this.mainWindow?.webContents.send("browser-change", running);
  };

  /** 处理消息调用 */
  private handleIPC() {
    /** 获取应用状态 */
    ipcMain.handle("get-app-status", () => {
      return {
        version: app.getVersion(),
        running: this.browser.getRunning(),
        config: this.settings.getConfig(),
      };
    });

    /** 获取日志 */
    ipcMain.handle("get-logs", async () => {
      return this.logs.getLogs();
    });

    /** 清理日志 */
    ipcMain.handle("clear-logs", () => {
      return this.logs.clearLogs();
    });

    /** 更新设置 */
    ipcMain.handle("update-settings", async (_, config: MossConfig) => {
      try {
        await this.settings.saveConfig(config);
        this.mainWindow?.webContents.send("settings-change", config);

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: `更新失败: ${error?.message}`,
        };
      }
    });

    /** 启动浏览器 */
    ipcMain.handle("start-browser", async () => {
      try {
        const config = await this.settings.loadConfig();
        if (!config) {
          return {
            success: false,
            message: "无效配置",
          };
        }

        await this.browser.startBrowser(config);

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: `启动失败: ${error?.message}`,
        };
      }
    });

    /** 停止浏览器 */
    ipcMain.handle("stop-browser", async () => {
      try {
        await this.browser.stopBrowser();

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: `停止失败: ${error?.message}`,
        };
      }
    });

    /** 重启应用 */
    ipcMain.handle("restart-app", async () => {
      try {
        await this.browser.stopBrowser();

        // 延迟重启
        setImmediate(() => {
          app.relaunch();
          app.quit();
        });

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          message: `重启失败: ${error?.message}`,
        };
      }
    });

    /** 选择目录 */
    ipcMain.handle("select-directory", async () => {
      if (this.mainWindow) {
        const result = await dialog.showOpenDialog(this.mainWindow, {
          properties: ["openDirectory", "createDirectory"],
        });
        return result.canceled ? undefined : result.filePaths[0];
      }
    });
  }
}

export default Windows;
