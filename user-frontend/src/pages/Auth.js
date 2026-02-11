import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert("请输入账号和密码");
      return;
    }

    const key = "hs_users_front";
    const raw = localStorage.getItem(key);
    const users = raw ? JSON.parse(raw) : [];

    if (isRegister) {
      if (users.some((u) => u.username === form.username)) {
        alert("该账号已存在");
        return;
      }
      users.push({ username: form.username, password: form.password });
      localStorage.setItem(key, JSON.stringify(users));
      alert("注册成功，请登录");
      setIsRegister(false);
    } else {
      const ok = users.find(
        (u) =>
          u.username === form.username && u.password === form.password
      );
      if (!ok) {
        alert("账号或密码错误");
        return;
      }
      localStorage.setItem(
        "hs_user_front_session",
        JSON.stringify({ username: ok.username })
      );
      alert("登录成功");
      navigate("/hotels");
    }
  };

  return (
    <div className="authShell">
      <div className="card authCard">
        <h2 style={{ textAlign: "center", margin: "4px 0 0" }}>
          酒店订阅系统 - 用户端
        </h2>
        <div className="authTabs">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={[
              "authTabBtn",
              !isRegister ? "authTabBtnActive" : "",
            ].join(" ")}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={[
              "authTabBtn",
              isRegister ? "authTabBtnActive" : "",
            ].join(" ")}
          >
            注册
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>账号</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete={isRegister ? "username" : "username"}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>密码</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>
          <button
            type="submit"
            className="btn btnPrimary"
            style={{ width: "100%" }}
          >
            {isRegister ? "注册" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}