import React, { useState } from "react";
import { Button, Form, Input, message, Select, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { login, registerUser } from "../../services/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

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

  const onRegister = (values) => {
    try {
      registerUser(values);
      message.success("注册成功，请登录");
      setTab("login");
    } catch (e) {
      message.error(e.message || "注册失败");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 420,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>
          酒店管理系统 - 管理端
        </h2>

        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            {
              key: "login",
              label: "登录",
              children: (
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
              ),
            },
            {
              key: "register",
              label: "注册",
              children: (
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
                        {
                          value: "merchant",
                          label: "商户（可上传/编辑酒店信息）",
                        },
                        {
                          value: "admin",
                          label: "管理员（可审核/发布/下线）",
                        },
                      ]}
                      placeholder="请选择角色"
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    注册
                  </Button>
                </Form>
              ),
            },
          ]}
        />

        <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          测试账号：管理员 admin/123456，商户 merchant/123456
        </div>
      </div>
    </div>
  );
}