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
      <div style={{ background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 60%)", minHeight: "100vh" }}>
        <div style={{ height: 56, background: "#1677ff", color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ fontWeight: 700 }}>酒店订阅系统 · 管理端</div>
        </div>
        <RouterConfig />
      </div>
    </ConfigProvider>
  );
}

export default App;
