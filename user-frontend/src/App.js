import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Auth";
import HotelListPage from "./pages/HotelList";
import HotelDetailPage from "./pages/HotelDetail";

function App() {
  return (
    <BrowserRouter>
      <div style={{ height: 56, background: "#1677ff", color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ fontWeight: 700 }}>酒店订阅系统 · 用户端</div>
      </div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/hotels" element={<HotelListPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
