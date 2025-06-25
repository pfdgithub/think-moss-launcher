import { Result } from "antd";
import { Navigate } from "react-router-dom";
import Forbidden from "../../views/Basic/Forbidden";
import NotFound from "../../views/Basic/NotFound";
import Layout from "../../views/Layout";
import { ExtendRoute, ExtendRouteMeta } from "../utils";
import { bizRoutes } from "./biz";

/**
 * 基础路由
 */
export const basicRoutes: ExtendRoute<ExtendRouteMeta>[] = [
  {
    path: "forbidden",
    element: <Forbidden />,
    handle: { title: "无权限" },
  },
  {
    path: "*",
    element: <NotFound />,
    handle: { title: "页面不存在" },
  },
];

/**
 * 根路由
 */
export const rootRoute: ExtendRoute<ExtendRouteMeta> = {
  path: "/",
  element: <Layout />,
  children: [
    ...basicRoutes,
    ...bizRoutes,
    {
      index: true,
      element: <Navigate to="control" />,
    },
    {
      path: "*",
      element: (
        <Result status="404" title="Not Found" style={{ margin: "0 auto" }} />
      ),
    },
  ],
};
