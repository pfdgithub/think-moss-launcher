export type MessageInfo = {
  level?: string;
  message?: string;
  timestamp?: string;
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
    const restStr = Object.keys(rest).length
      ? `\n${JSON.stringify(rest, null, 2)}`
      : "";

    const log = timestampStr + levelStr + labelStr + messageStr + restStr;
    this.addLog(log);
  }

  /** debug 消息 */
  public debug(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "debug",
      timestamp: new Date().toISOString(),
    });
  }

  /** info 消息 */
  public info(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "info",
      timestamp: new Date().toISOString(),
    });
  }

  /** warn 消息 */
  public warn(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "warn",
      timestamp: new Date().toISOString(),
    });
  }

  /** error 消息 */
  public error(message: string) {
    this.addMessage({
      message,
      label: "launcher",
      level: "error",
      timestamp: new Date().toISOString(),
    });
  }
}

export default Logs;
