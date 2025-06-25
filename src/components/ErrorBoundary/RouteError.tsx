import { Button, Result, ResultProps, Space } from "antd";
import cls, { Argument } from "classnames";
import { useEffect, useMemo } from "react";
import { useRouteError } from "react-router-dom";
import logger from "../../utils/logger";
import stl from "./index.module.less";

export type RouteErrorProps = ResultProps & {
  className?: Argument;
  style?: React.CSSProperties;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * 路由错误边界
 */
const RouteError = (props: RouteErrorProps) => {
  const { className, style, action, children, ...rest } = props;

  const error: any = useRouteError();

  const subTitle = useMemo(
    () =>
      error?.message ??
      error?.error?.message ??
      "Something went wrong, please try again!",
    [error],
  );
  const errorDetail = useMemo(
    () => error?.stack ?? error?.error?.stack ?? JSON.stringify(error),
    [error],
  );

  useEffect(() => {
    logger.error(error);
  }, [error]);

  if (!error) {
    return children;
  }

  return (
    <Result
      className={cls(stl.errorBoundary, className)}
      style={style}
      status="error"
      title="出错了"
      subTitle={subTitle}
      extra={
        <Space>
          {action}
          <Button onClick={() => window.location.reload()}>刷新页面</Button>
        </Space>
      }
      {...rest}
    >
      {errorDetail ? <div className={stl.detail}>{errorDetail}</div> : null}
    </Result>
  );
};

export default RouteError;
