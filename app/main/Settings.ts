import { app } from "electron";
import fs from "fs";
import path from "path";
import { MossConfig } from "../types.js";
import Logs from "./Logs.js";
import { defaultMossConfig } from "./config.js";

class Settings {
  /** 日志 */
  private logs: Logs;

  /** 文件路径 */
  private settingsPath: string;

  /** moss 配置 */
  private mossConfig: MossConfig | undefined;

  /** 监听配置变更 */
  private onChange?: (config?: MossConfig) => void;

  constructor(
    logs: Logs,
    options?: {
      onChange?: (config?: MossConfig) => void;
    },
  ) {
    this.logs = logs;
    this.settingsPath = path.join(app.getPath("userData"), "settings.json");
    this.onChange = options?.onChange;
  }

  /** 获取配置 */
  public getConfig() {
    return this.mossConfig;
  }

  /** 更新配置 */
  private setConfig(config?: MossConfig) {
    if (this.mossConfig !== config) {
      this.mossConfig = config;
      this.onChange?.(config);
    }
  }

  /** 加载配置 */
  public async loadConfig() {
    this.logs.info("加载配置文件");

    if (this.mossConfig) {
      return this.mossConfig;
    }

    try {
      if (fs.existsSync(this.settingsPath)) {
        const settingsData = await fs.promises.readFile(
          this.settingsPath,
          "utf-8",
        );
        const config = JSON.parse(settingsData);
        this.setConfig(config);
      } else {
        this.logs.warn("配置文件不存在，使用默认配置");
        this.setConfig(defaultMossConfig);
      }
    } catch (error: any) {
      this.logs.error(`加载配置文件失败: ${error?.message}`);
      throw error;
    }

    return this.mossConfig;
  }

  /** 保存配置 */
  public async saveConfig(config: MossConfig) {
    this.logs.info("保存配置文件");

    try {
      const settingsData = JSON.stringify(config, null, 2);
      await fs.promises.writeFile(this.settingsPath, settingsData, {
        encoding: "utf-8",
      });

      this.setConfig(config);
    } catch (error: any) {
      this.logs.error(`保存配置文件失败: ${error?.message}`);
      throw error;
    }
  }
}

export default Settings;
