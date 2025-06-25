import { useEffect, useMemo } from "react";
import { useMatches } from "react-router";

const docTitle = document.title;

export type RouteWrapperProps = {
  children?: React.ReactNode;
};

/**
 * 路由包装器
 */
export const RouteWrapper = (props: RouteWrapperProps) => {
  const { children } = props;

  // #region 页面标题

  const matches = useMatches();

  const lastRouteTitle = useMemo(() => {
    const list = matches
      .map(({ handle }) => ((handle || {}) as any).title)
      .filter((x) => x !== undefined);
    return list[list.length - 1];
  }, [matches]);

  useEffect(() => {
    const _docTitle = docTitle || "";

    if (lastRouteTitle) {
      if (lastRouteTitle !== document.title) {
        document.title = !_docTitle
          ? lastRouteTitle
          : `${lastRouteTitle} - ${_docTitle}`;
      }
    } else {
      if (_docTitle !== document.title) {
        document.title = _docTitle;
      }
    }
  }, [lastRouteTitle]);

  // #endregion

  return children;
};

export default RouteWrapper;
