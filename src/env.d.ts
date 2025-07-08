/// <reference types="vite/client" />

// 运行时变量
declare interface Window {
  /** 运行时全局配置 */
  THINK_GLOBAL_CONFIG?: {
    /** 应用名称 */
    APP_NAME?: string;
    /** 应用版本 */
    APP_VERSION?: string;
    /** 构建时间 */
    BUILD_DATE?: string;
    /** 提交记录 */
    BUILD_COMMIT?: string;
  };
}

// https://github.com/vitejs/vite/issues/2269#issuecomment-843688852
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const url: string;
  export default url;
}

// Electron API
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

    /** 监听应用消息 */
    onAppMessage?: (callback: (msg: Message) => void) => () => void;
    /** 监听日志变更 */
    onLogsChange?: (callback: (log: string) => void) => () => void;
    /** 监听配置变更 */
    onSettingsChange?: (callback: (config?: MossConfig) => void) => () => void;
    /** 监听状态变更 */
    onBrowserChange?: (callback: (running: boolean) => void) => () => void;
  };
}
