import { App } from "antd";
import { useEffect } from "react";
import { Outlet } from "react-router";

const AppLayout = () => {
  const { message } = App.useApp();

  useEffect(() => {
    // 监听应用消息
    const offAppMessage = window.electronAPI?.onAppMessage?.((msg) => {
      const { level, duration, content } = msg;
      const typeOpen = (message as any)[level] || message.info;
      typeOpen(content, duration);
    });

    return () => {
      offAppMessage?.();
    };
  }, [message]);

  return <Outlet />;
};

export default AppLayout;
