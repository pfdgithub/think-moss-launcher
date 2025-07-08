import ipc from "@achrinza/node-ipc";
import { appName as appCliName } from "./config";

export type NodeIPC = typeof ipc;
export type IPCServer = typeof ipc.server;
export type IPCClient = (typeof ipc.of)[string];

/** 事件类型 */
export enum EventType {
  /** 日志 */
  log = "ipc-log",
  /** 通知 */
  notice = "ipc-notice",
}

/** 日志参数 */
export type LogParams = {
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

/** 通知参数 */
export type NoticeParams<P = any> = {
  /** 通知类型 */
  type?: string;
  /** 负载数据 */
  payload?: P;
};

/** 事件类型参数 */
export type EventTypeParams = {
  [EventType.log]: LogParams;
  [EventType.notice]: NoticeParams;
};

ipc.config.silent = true;
ipc.config.maxRetries = 10;
ipc.config.id = appCliName;

/** 启动 IPC */
export const startIPC = (
  callback?: (server: IPCServer, ipc: NodeIPC) => void,
) => {
  ipc.serve(() => {
    callback?.(ipc.server, ipc);
  });

  ipc.server.start();
};

/** 停止 IPC */
export const stopIPC = () => {
  if (!ipc.server) {
    throw new Error("IPC server is not started.");
  }

  ipc.server.stop();
};

/** 广播事件 */
export const broadcastEvent = <
  E extends keyof EventTypeParams,
  P = EventTypeParams[E],
>(
  event: E,
  params?: P,
) => {
  if (!ipc.server) {
    throw new Error("IPC server is not started.");
  }

  ipc.server.broadcast(event, params);
};

/** 连接服务端 */
export const connectTo = (
  id: string,
  callback?: (client: IPCClient, ipc: NodeIPC) => void,
) => {
  ipc.connectTo(id, () => {
    callback?.(ipc.of[id], ipc);
  });
};
