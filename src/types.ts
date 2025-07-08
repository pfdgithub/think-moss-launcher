export type Message = {
  /** 消息级别 */
  level?: "info" | "warning" | "error" | "success" | "loading";
  /** 延时关闭(秒) */
  duration?: number;
  /** 消息内容 */
  content?: string;
};

export type MossConfig = {
  /** 接口路径 */
  apiBase?: string;
  /** 连接码 */
  connectCode?: string;
  /** 日志目录 */
  logDir?: string;
  /** 日志级别 */
  logLevel?: "debug" | "info" | "warn" | "error";
  /** 有头模式(浏览器可见) */
  browserHeaded?: boolean;
};

export type InvokeResponse = {
  /** 操作成功 */
  success?: boolean;
  /** 失败原因 */
  message?: string;
};

export type AppStatus = {
  /** 版本 */
  version?: string;
  /** 状态 */
  running?: boolean;
  /** 配置 */
  config?: MossConfig;
};
