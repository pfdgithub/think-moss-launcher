import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import router from "./router";
import "dayjs/locale/zh-cn";

const App = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <ConfigProvider locale={zhCN}>
          <AntdApp>
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
