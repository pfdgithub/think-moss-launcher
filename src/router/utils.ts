import { RouteObject } from "react-router";

/**
 * 路由元数据
 */
export interface RouteMeta extends Record<string, any> {}

/**
 * 扩展路由元数据
 */
export interface ExtendRouteMeta extends RouteMeta {
  /**
   * 页面标题
   */
  title?: false | string;
}

/**
 * 路由配置
 */
export interface ExtendRoute<T extends RouteMeta = ExtendRouteMeta>
  extends Omit<RouteObject, "handle" | "children"> {
  handle?: T;
  children?: ExtendRoute<T>[];
}
