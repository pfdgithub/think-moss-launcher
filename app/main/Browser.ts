import childProcess, { ChildProcess } from "child_process";
import { MossConfig } from "../types.js";
import { playwrightBrowsersPath } from "./config.js";
import Logs from "./Logs.js";

class Browser {
  /** 日志 */
  private logs: Logs;

  /** moss 进程 */
  private mossProcess: ChildProcess | undefined;

  /** 运行状态 */
  private isRunning: boolean = false;

  /** 监听状态变更 */
  private onChange?: (running: boolean) => void;

  constructor(
    logs: Logs,
    options?: {
      onChange?: (running: boolean) => void;
    },
  ) {
    this.logs = logs;
    this.onChange = options?.onChange;
  }

  /** 获取运行状态 */
  public getRunning() {
    return this.isRunning;
  }

  /** 更新运行状态 */
  private setRunning(running: boolean) {
    if (this.isRunning !== running) {
      this.isRunning = running;
      this.onChange?.(running);
    }
  }

  /** 启动浏览器 */
  public async startBrowser(config: MossConfig) {
    const { apiBase, connectCode, logDir, logLevel, browserHeaded } = config;

    this.logs.info("启动进程");

    // 命令行地址
    const cliPath = require.resolve("@think/moss-browser/dist/cli.js");

    // 命令行参数
    const args: string[] = [];
    if (apiBase) {
      args.push("--api-base", apiBase);
    }
    if (connectCode) {
      args.push("--connect-code", connectCode);
    }
    if (logDir) {
      args.push("--log-dir", logDir);
    }
    if (logLevel) {
      args.push("--log-level", logLevel);
    }
    if (browserHeaded) {
      args.push("--browser-headed");
    }

    // this.logs.debug(`${cliPath} ${args.join(" ")}`);

    return new Promise<void>((resolve, reject) => {
      try {
        // 启动进程
        this.mossProcess = childProcess.fork(cliPath, args, {
          env: {
            ...process.env,
            PLAYWRIGHT_BROWSERS_PATH: playwrightBrowsersPath,
          },
        });

        // 监听定制消息
        this.mossProcess.on("message", (msg) => {
          const { type, payload } = (msg || {}) as any;
          if (type === "winston-IPCTransport") {
            this.logs.addMessage(payload);
          }
        });

        // 监听标准输出
        this.mossProcess.stdout?.on("data", (data) => {
          const output = data.toString().trim();
          if (output) {
            this.logs.addLog(output);
          }
        });

        // 监听错误输出
        this.mossProcess.stderr?.on("data", (data) => {
          const output = data.toString().trim();
          if (output) {
            this.logs.addLog(output);
          }
        });

        // 监听退出
        this.mossProcess.on("exit", (code, signal) => {
          this.logs.warn(`进程退出: ${code} ${signal}`);
          this.mossProcess = undefined;
          this.setRunning(false);
        });

        // 监听错误
        this.mossProcess.on("error", (error) => {
          this.logs.error(`进程错误: ${error.message}`);
          this.mossProcess = undefined;
          this.setRunning(false);
          reject(error);
        });

        // 延迟检查
        setTimeout(() => {
          if (this.mossProcess && !this.mossProcess.killed) {
            this.setRunning(true);
            resolve();
          } else {
            this.setRunning(false);
            reject(new Error("启动进程失败"));
          }
        }, 2000);
      } catch (error: any) {
        this.logs.error(`启动进程失败: ${error?.message}`);
        reject(error);
      }
    });
  }

  /** 停止浏览器 */
  public async stopBrowser() {
    this.logs.info("停止进程");

    return new Promise<void>((resolve) => {
      if (!this.mossProcess) {
        resolve();
        return;
      }

      let timer: any = undefined;

      this.mossProcess.on("exit", () => {
        clearTimeout(timer);

        this.mossProcess = undefined;
        this.setRunning(false);
        resolve();
      });

      // 强制停止
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (this.mossProcess && !this.mossProcess.killed) {
          this.logs.warn("强制停止: SIGKILL");
          this.mossProcess.kill("SIGKILL");
        }
      }, 5000);

      // 优雅停止
      this.logs.info("优雅停止: SIGTERM");
      this.mossProcess.kill("SIGTERM");
    });
  }
}

export default Browser;
