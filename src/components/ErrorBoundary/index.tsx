import { Button, Result, ResultProps, Space } from "antd";
import cls, { Argument } from "classnames";
import React from "react";
import logger from "@/utils/logger";
import stl from "./index.module.less";
import RouteError from "./RouteError";

export type ErrorBoundaryProps = ResultProps & {
  className?: Argument;
  style?: React.CSSProperties;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * 错误边界
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
  static RouteError: typeof RouteError;

  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error(error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { className, style, action, children, ...rest } = this.props;
    const { error, errorInfo } = this.state;

    if (!error) {
      return children;
    }

    const subTitle =
      error?.message ?? "Something went wrong, please try again!";
    const errorDetail = `${error?.toString()}${errorInfo?.componentStack}`;

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
  }
}

ErrorBoundary.RouteError = RouteError;

export default ErrorBoundary;
