import React from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/storage";
import bgImg from "./登录背景.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const goByRole = (role) => {
    if (role === "admin") {
      navigate("/admin/review");
    } else {
      navigate("/merchant/hotels");
    }
  };

  const onLogin = (values) => {
    try {
      const session = login(values);
      message.success("登录成功");
      goByRole(session.role);
    } catch (e) {
      message.error(e.message || "登录失败");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: 420,
          padding: 24,
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 6px 24px rgba(22,119,255,0.08)",
          border: "1px solid #e6f4ff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>
          酒店管理系统 - 管理端
        </h2>
        <Form layout="vertical" onFinish={onLogin}>
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          暂无账号？{" "}
          <a href="/register" style={{ color: "#1677ff" }}>
            请注册
          </a>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          测试账号：管理员 admin/123456，商户 merchant/123456
        </div>
      </div>
    </div>
  );
}
