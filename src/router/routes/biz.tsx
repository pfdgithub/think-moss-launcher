import Control from "@/views/Control";
import Logs from "@/views/Logs";
import Settings from "@/views/Settings";
import { ExtendRoute, ExtendRouteMeta } from "../utils";

/**
 * 业务路由
 */
export const bizRoutes: ExtendRoute<ExtendRouteMeta>[] = [
  {
    path: "control",
    element: <Control />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "logs",
    element: <Logs />,
  },
];
