import { createHashRouter, RouteObject } from "react-router";
import ErrorBoundary from "../components/ErrorBoundary";
import { rootRoute } from "./routes/basic";
import { ExtendRoute } from "./utils";

/** 递归修改路由 */
const recursionModifyRoute = (
  route: ExtendRoute,
  lowPriorityDiff?: ExtendRoute,
  highPriorityDiff?: ExtendRoute,
): ExtendRoute => {
  const { children, ...rest } = route || {};

  const child = children?.map((item) =>
    recursionModifyRoute(item, lowPriorityDiff, highPriorityDiff),
  );

  return {
    ...(lowPriorityDiff || {}),
    ...rest,
    children: child,
    ...(highPriorityDiff || {}),
  } as RouteObject;
};

const modifiedRoute = recursionModifyRoute(rootRoute, {
  errorElement: <ErrorBoundary.RouteError />,
});

const router = createHashRouter([modifiedRoute as RouteObject]);

export default router;
