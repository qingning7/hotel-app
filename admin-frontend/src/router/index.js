import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MerchantHotels from "../pages/MerchantHotels";
import AdminReview from "../pages/AdminReview";

export default function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 */}
        <Route path="/" element={<Login />} />

        {/* 可选：后台欢迎页 */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 注册页 */}
        <Route path="/register" element={<Register />} />

        {/* 商户：酒店录入/编辑 */}
        <Route path="/merchant/hotels" element={<MerchantHotels />} />

        {/* 管理员：酒店审核/发布/下线 */}
        <Route path="/admin/review" element={<AdminReview />} />
      </Routes>
    </BrowserRouter>
  );
}
