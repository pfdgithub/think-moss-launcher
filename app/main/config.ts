import path from "path";
import { MossConfig } from "../types.js";

// const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** 生产模式 */
export const isProd = process.env.NODE_ENV !== "development";

/** renderer 开发网址 */
export const rendererDevUrl = "http://localhost:9527";

/** renderer 文件路径 */
export const rendererFilePath = path.join(__dirname, "../../web/index.html");

/** preload 文件路径 */
export const preloadFilePath = path.join(__dirname, "../preload/index.js");

/** playwright 浏览器路径 */
export const playwrightBrowsersPath = path.join(
  isProd ? process.resourcesPath : process.cwd(),
  ".local-browsers",
);

/** 默认配置 */
export const defaultMossConfig: MossConfig = {
  apiBase: "https://agent.thinkmoss.com",
};
