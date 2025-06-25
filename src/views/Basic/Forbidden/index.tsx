import { Result } from "antd";
import cls from "classnames";
import stl from "./index.module.less";

const Forbidden = () => {
  return (
    <div className={cls(stl.forbidden)}>
      <Result status="403" title="抱歉，您没有该权限" />
    </div>
  );
};

export default Forbidden;
