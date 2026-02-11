import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSubscription, getHotelById } from "../services/storage";

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const h = await getHotelById(id);
      if (mounted) setHotel(h || null);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!hotel) {
    return (
      <div className="page">
        <p>未找到该酒店信息，可能已下线。</p>
        <button onClick={() => navigate("/hotels")} className="btn btnGhost">
          返回列表
        </button>
      </div>
    );
  }

  const handleSubscribe = async () => {
    try {
      const raw = localStorage.getItem("hs_user_front_session");
      const session = raw ? JSON.parse(raw) : null;
      if (!session?.username) {
        alert("请先登录");
        navigate("/");
        return;
      }
      await createSubscription({ hotelId: hotel.id, username: session.username });
      alert("订阅成功");
    } catch {
      alert("订阅失败，请稍后再试");
    }
  };

  return (
    <div className="page">
      <button onClick={() => navigate("/hotels")} className="btn btnGhost">
        返回列表
      </button>
      <h2 className="pageTitle">{hotel.name}</h2>
      <p className="muted">
        {hotel.city} · {hotel.address}
      </p>
      <p style={{ margin: "12px 0" }}>{hotel.desc}</p>
      <p className="price">
        ￥{hotel.price} / 晚
      </p>
      <button
        onClick={handleSubscribe}
        className="btn btnPrimary"
        style={{ marginTop: 16, width: "min(420px, 100%)" }}
      >
        订阅 / 预约
      </button>
    </div>
  );
}
