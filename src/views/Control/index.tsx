import { Button, message, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileTextOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { AppStatus } from "../../types";
import stl from "./index.module.less";

const { Title, Text } = Typography;

const Control = () => {
  const navigate = useNavigate();
  const [appStatus, setAppStatus] = useState<AppStatus>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取初始应用状态
    window.electronAPI?.getAppStatus?.().then(setAppStatus);

    // 监听浏览器状态变更
    const unsubscribe = window.electronAPI?.onBrowserChange?.((running) => {
      setAppStatus((prev) => ({ ...(prev || {}), running }));
    });

    return unsubscribe;
  }, []);

  const handleStart = async () => {
    if (!appStatus?.config?.apiBase || !appStatus?.config?.connectCode) {
      message.warning("请先设置应用参数", undefined, () => {
        navigate("/settings");
      });
      return;
    }

    setLoading(true);
    try {
      const result = await window.electronAPI?.startBrowser?.();

      if (result.success) {
        message.success("启动成功");
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(`启动失败: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI?.stopBrowser?.();
      if (result.success) {
        message.success("停止成功");
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(`停止失败: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={stl.container}>
      <div className={stl.header}>
        <Title level={3} className={stl.title}>
          ThinkMoss Launcher
        </Title>
        <Space>
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/logs")}
          >
            日志
          </Button>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => navigate("/settings")}
          >
            设置
          </Button>
        </Space>
      </div>
      <div className={stl.content}>
        <div className={stl.status}>
          <div className={stl.statusIndicator}>
            <div
              className={`${stl.statusDot} ${appStatus?.running ? stl.running : stl.stopped}`}
            />
            <Text strong style={{ fontSize: 18 }}>
              {appStatus?.running ? "运行中" : "已停止"}
            </Text>
          </div>

          <div className={stl.actions}>
            {appStatus?.running ? (
              <Button
                type="primary"
                size="large"
                danger
                icon={<PauseCircleOutlined />}
                loading={loading}
                onClick={handleStop}
              >
                停止应用
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                loading={loading}
                onClick={handleStart}
              >
                启动应用
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={stl.footer}>
        <Text type="secondary">版本 {appStatus?.version || "-"}</Text>
      </div>
    </div>
  );
};

export default Control;
