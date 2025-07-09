import { toLocalISOString } from "./utils/utils";

export type MessageInfo = {
  [key: string]: any;
  /** 日志级别 */
  level?: string;
  /** 日志消息 */
  message?: string;
  /** 日志时间戳 */
  timestamp?: string;
  /** 附加标签 */
  label?: string;
};

class Logs {
  /** 日志 */
  private logs: string[];

  /** 最大数量 */
  private maxCount: number;

  /** 监听日志变更 */
  private onChange?: (log: string) => void;

  constructor(options?: {
    maxCount?: number;
    onChange?: (log: string) => void;
  }) {
    this.logs = [];
    this.maxCount = options?.maxCount || 1000;
    this.onChange = options?.onChange;
  }

  /** 获取日志 */
  public getLogs() {
    return this.logs;
  }

  /** 清理日志 */
  public clearLogs() {
    this.logs = [];
  }

  /** 添加日志 */
  public addLog(log: string) {
    let cloned = [...this.logs, log];

    if (cloned.length > this.maxCount) {
      cloned = cloned.slice(-this.maxCount);
    }

    this.logs = cloned;
    this.onChange?.(log);
  }

  /** 添加消息 */
  public addMessage(info: MessageInfo) {
    const { level, message, timestamp, label, ...rest } = info;

    const timestampStr = timestamp ? `${timestamp} ` : "";
    const levelStr = `[${level}]: `;
    const labelStr = label ? `[${label}] ` : "";
    const messageStr = message || "";

    const jsonStr = JSON.stringify(rest, null, 2);
    const restStr = jsonStr && jsonStr !== "{}" ? `\n${jsonStr}` : "";

    const log = timestampStr + levelStr + labelStr + messageStr + restStr;
    this.addLog(log);
  }

  /** debug 消息 */
  public debug(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "debug",
      timestamp: toLocalISOString(),
    });
  }

  /** info 消息 */
  public info(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "info",
      timestamp: toLocalISOString(),
    });
  }

  /** warn 消息 */
  public warn(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "warn",
      timestamp: toLocalISOString(),
    });
  }

  /** error 消息 */
  public error(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "error",
      timestamp: toLocalISOString(),
    });
  }
}

export default Logs;
