import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/Auth";
import HotelListPage from "./pages/HotelList";
import HotelDetailPage from "./pages/HotelDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/hotels" element={<HotelListPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;