import { Result } from "antd";
import cls from "classnames";
import stl from "./index.module.less";

const NotFound = () => {
  return (
    <div className={cls(stl.notFound)}>
      <Result status="404" title="抱歉，页面不存在" />
    </div>
  );
};

export default NotFound;
