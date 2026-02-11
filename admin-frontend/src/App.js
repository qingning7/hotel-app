import RouterConfig from "./router";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          colorBgBase: "#f0f6ff",
          borderRadius: 8
        }
      }}
    >
      <RouterConfig />
    </ConfigProvider>
  );
}

export default App;
