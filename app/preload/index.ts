import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { AppStatus, InvokeResponse, Message, MossConfig } from "../types";

contextBridge.exposeInMainWorld("electronAPI", {
  /** 获取应用状态 */
  getAppStatus: (): Promise<AppStatus> => ipcRenderer.invoke("get-app-status"),

  /** 获取日志 */
  getLogs: (): Promise<string[]> => ipcRenderer.invoke("get-logs"),

  /** 清理日志 */
  clearLogs: (): Promise<void> => ipcRenderer.invoke("clear-logs"),

  /** 更新配置 */
  updateSettings: (config: MossConfig): Promise<InvokeResponse> =>
    ipcRenderer.invoke("update-settings", config),

  /** 启动浏览器 */
  startBrowser: (): Promise<InvokeResponse> =>
    ipcRenderer.invoke("start-browser"),

  /** 停止浏览器 */
  stopBrowser: (): Promise<InvokeResponse> =>
    ipcRenderer.invoke("stop-browser"),

  /** 重启应用 */
  restartApp: (): Promise<InvokeResponse> => ipcRenderer.invoke("restart-app"),

  /** 选择目录 */
  selectDirectory: (): Promise<string | undefined> =>
    ipcRenderer.invoke("select-directory"),

  /** 监听应用消息 */
  onAppMessage: (callback: (msg: Message) => void) => {
    const listener = (event: IpcRendererEvent, msg: Message) => callback(msg);

    ipcRenderer.on("app-message", listener);

    // 清理函数
    return () => {
      ipcRenderer.off("app-message", listener);
    };
  },

  /** 监听日志变更 */
  onLogsChange: (callback: (log: string) => void) => {
    const listener = (event: IpcRendererEvent, log: string) => callback(log);

    ipcRenderer.on("logs-change", listener);

    // 清理函数
    return () => {
      ipcRenderer.off("logs-change", listener);
    };
  },

  /** 监听配置变更 */
  onSettingsChange: (callback: (config?: MossConfig) => void) => {
    const listener = (event: IpcRendererEvent, config?: MossConfig) =>
      callback(config);

    ipcRenderer.on("settings-change", listener);

    // 清理函数
    return () => {
      ipcRenderer.off("settings-change", listener);
    };
  },

  /** 监听状态变更 */
  onBrowserChange: (callback: (running: boolean) => void) => {
    const listener = (event: IpcRendererEvent, running: boolean) =>
      callback(running);

    ipcRenderer.on("browser-change", listener);

    // 清理函数
    return () => {
      ipcRenderer.off("browser-change", listener);
    };
  },
});
