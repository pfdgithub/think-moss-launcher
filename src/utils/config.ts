const NODE_ENV = process.env.NODE_ENV;
const GLOBAL_CONFIG = window.THINK_GLOBAL_CONFIG || {};
const APP_NAME = GLOBAL_CONFIG.APP_NAME || "APP";
const APP_VERSION = GLOBAL_CONFIG.APP_VERSION || "0.0.0";

/** 生产模式 */
export const isProd = NODE_ENV !== "development";

/** 应用名称  */
export const appName = APP_NAME;

/** 应用版本 */
export const appVersion = APP_VERSION;
