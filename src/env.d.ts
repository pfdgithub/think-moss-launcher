/// <reference types="vite/client" />

declare interface Window {
  electronAPI?: {
    /** 获取应用状态 */
    getAppStatus?: () => Promise<AppStatus>;
    /** 获取日志 */
    getLogs?: () => Promise<string[]>;
    /** 清理日志 */
    clearLogs?: () => Promise<void>;
    /** 更新设置 */
    updateSettings: (config: MossConfig) => Promise<InvokeResponse>;
    /** 启动浏览器 */
    startBrowser?: () => Promise<InvokeResponse>;
    /** 停止浏览器 */
    stopBrowser?: () => Promise<InvokeResponse>;
    /** 重启应用 */
    restartApp?: () => Promise<InvokeResponse>;
    /** 选择目录 */
    selectDirectory?: () => Promise<string | undefined>;

    /** 监听日志变更 */
    onLogsChange?: (callback: (log: string) => void) => () => void;
    /** 监听配置变更 */
    onSettingsChange?: (callback: (config?: MossConfig) => void) => () => void;
    /** 监听状态变更 */
    onBrowserChange?: (callback: (running: boolean) => void) => () => void;
  };
}
