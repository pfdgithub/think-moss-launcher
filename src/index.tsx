import "@ant-design/v5-patch-for-react-19";
import ReactDOM from "react-dom/client";
import App from "./App";

const app = document.querySelector("#app");
if (app) {
  ReactDOM.createRoot(app).render(<App />);
} else {
  console.error("Mount point not found.");
}
