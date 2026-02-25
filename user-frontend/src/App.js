import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import AuthPage from "./pages/Auth";
import HotelListPage from "./pages/HotelList";
import HotelDetailPage from "./pages/HotelDetail";
import MyOrdersPage from "./pages/MyOrders";

const { Header, Content } = Layout;

function AppContent() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    if (location.pathname.startsWith("/hotels")) {
      setSelectedKey("1");
    } else if (location.pathname.startsWith("/orders")) {
      setSelectedKey("2");
    } else if (location.pathname === "/") {
      setSelectedKey("3");
    }
  }, [location]);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginRight: 40 }}>
          酒店订阅系统
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: "1", label: <Link to="/hotels">酒店列表</Link> },
            { key: "2", label: <Link to="/orders">我的订单</Link> },
            { key: "3", label: <Link to="/">退出登录</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content" style={{ padding: 24, minHeight: 380, background: "#fff", marginTop: 24, borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/hotels" element={<HotelListPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
