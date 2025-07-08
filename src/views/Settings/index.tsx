import { App, Button, Form, Input, Modal, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { MossConfig } from "@/types";
import stl from "./index.module.less";

const { Title } = Typography;

const Settings = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<MossConfig>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取初始配置
    window.electronAPI?.getAppStatus?.().then((status) => {
      const config = status.config || {};
      form.setFieldsValue(config);
    });

    // 监听配置变更
    const unsubscribe = window.electronAPI?.onSettingsChange?.((config) => {
      if (config) {
        form.setFieldsValue(config);
      }
    });

    return unsubscribe;
  }, [form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setLoading(true);

    try {
      const result = await window.electronAPI?.updateSettings?.(values);
      if (result.success) {
        message.success("保存成功");

        // 询问是否重启应用
        Modal.confirm({
          title: "重启应用",
          content: "是否立即重启应用以使配置生效？",
          okText: "重启",
          cancelText: "稍后",
          onOk: async () => {
            try {
              const ret = await window.electronAPI?.restartApp?.();
              if (!ret.success) {
                message.error(ret.message);
              }
            } catch (error: any) {
              message.error(`重启失败: ${error?.message}`);
            }
          },
        });
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(`保存失败: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const handleSelectDirectory = async () => {
  //   const directory = await window.electronAPI?.selectDirectory?.();
  //   if (directory) {
  //     form.setFieldValue("logDir", directory);
  //   }
  // };

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
          设置
        </Title>
        <Button
          type="text"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
        >
          保存
        </Button>
      </div>
      <div className={stl.content}>
        <div className={stl.formWrapper}>
          <Form form={form} layout="vertical" size="large" autoComplete="off">
            <Form.Item
              name="apiBase"
              label="接口路径"
              rules={[
                { required: true, whitespace: true, message: "请输入接口路径" },
              ]}
            >
              <Input allowClear placeholder="请输入接口路径" />
            </Form.Item>
            <Form.Item
              name="connectCode"
              label="连接码"
              rules={[
                { required: true, whitespace: true, message: "请输入连接码" },
              ]}
            >
              <Input allowClear placeholder="请输入连接码" />
            </Form.Item>
            {/* <Form.Item name="logDir" label="日志目录">
              <Input
                allowClear
                placeholder="请选择日志目录"
                suffix={<FolderOpenOutlined onClick={handleSelectDirectory} />}
              />
            </Form.Item> */}
            {/* <Form.Item name="logLevel" label="日志级别">
              <Select
                allowClear
                placeholder="请选择日志级别"
                options={[
                  { label: "Debug", value: "debug" },
                  { label: "Info", value: "info" },
                  { label: "Warn", value: "warn" },
                  { label: "Error", value: "error" },
                ]}
              />
            </Form.Item> */}
            <Form.Item
              name="browserHeaded"
              valuePropName="checked"
              label="浏览器模式"
            >
              <Switch checkedChildren="有头模式" unCheckedChildren="无头模式" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
