import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Tabs, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login, register } from "../services/storage";

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (activeTab === "login") {
        await login(values.username, values.password);
        localStorage.setItem("hs_user_front_session", JSON.stringify({ username: values.username }));
        message.success("登录成功");
        navigate("/hotels");
      } else {
        await register(values.username, values.password);
        message.success("注册成功，请登录");
        setActiveTab("login");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#f0f2f5" }}>
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2>酒店订阅系统</h2>
          <div style={{ color: "#666" }}>用户端</div>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            { key: "login", label: "登录" },
            { key: "register", label: "注册" },
          ]}
        />
        <Form
          name="auth"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              {activeTab === "login" ? "登录" : "注册"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
