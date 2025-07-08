import { App, Button, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ClearOutlined } from "@ant-design/icons";
import stl from "./index.module.less";

const { Title } = Typography;

const Logs = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 获取初始日志
    window.electronAPI?.getLogs?.().then(setLogs);

    // 监听日志变更
    const unsubscribe = window.electronAPI?.onLogsChange?.((newLog) => {
      setLogs((prev) => [...prev, newLog]);
    });

    return unsubscribe;
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleClear = () => {
    Modal.confirm({
      title: "清理日志",
      content: "确定要清理所有日志吗？",
      okText: "清理",
      cancelText: "取消",
      onOk: async () => {
        try {
          await window.electronAPI?.clearLogs?.();
          setLogs([]);
        } catch (error: any) {
          message.error(`清理失败: ${error?.message}`);
        }
      },
    });
  };

  return (
    <div className={stl.container}>
      <div className={stl.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/control")}
        >
          返回
        </Button>
        <Title level={3} className={stl.title}>
          日志
        </Title>
        <Button type="text" icon={<ClearOutlined />} onClick={handleClear}>
          清理
        </Button>
      </div>
      <div className={stl.content}>
        <div className={stl.logsContainer}>
          {logs.length === 0 ? (
            <div className={stl.emptyLogs}>暂无日志</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={stl.logLine}>
                {log}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Logs;
