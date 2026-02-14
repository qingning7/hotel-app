import React from "react";
import { Button, Form, Input, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/storage";

export default function RegisterPage() {
  const navigate = useNavigate();

  const onRegister = async (values) => {
    try {
      await registerUser(values);
      message.success("注册成功，请登录");
      navigate("/");
    } catch (e) {
      message.error(e.message || "注册失败");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #f0f6ff 0%, #ffffff 60%)",
        padding: 16,
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
          新用户注册
        </h2>
        <Form layout="vertical" onFinish={onRegister}>
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
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select
              options={[
                { value: "merchant", label: "商户（录入/编辑酒店）" },
                { value: "admin", label: "管理员（审核/上下线）" },
              ]}
              placeholder="请选择角色"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            注册
          </Button>
        </Form>
        <div style={{ marginTop: 12, fontSize: 12 }}>
          已有账号？{" "}
          <a href="/" style={{ color: "#1677ff" }}>
            返回登录
          </a>
        </div>
      </div>
    </div>
  );
}
