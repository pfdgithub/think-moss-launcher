/* eslint-disable no-console */
import { appName, isProd } from "./config";

/** 创建日志记录器 */
export const createLogger = (scope: string) => {
  const debug = (...rest: any[]) => {
    if (!isProd) {
      console.debug(`[${scope}]`, ...rest);
    }
  };

  const info = (...rest: any[]) => {
    console.info(`[${scope}]`, ...rest);
  };

  const log = (...rest: any[]) => {
    console.log(`[${scope}]`, ...rest);
  };

  const warn = (...rest: any[]) => {
    console.warn(`[${scope}]`, ...rest);
  };

  const error = (...rest: any[]) => {
    console.error(`[${scope}]`, ...rest);
  };

  return {
    debug,
    info,
    log,
    warn,
    error,
  };
};

/** 默认日志记录器 */
const logger = createLogger(appName);

export default logger;
