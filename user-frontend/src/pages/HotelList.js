import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAllHotels } from "../services/storage";

export default function HotelListPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await listAllHotels();
      if (mounted) setHotels(list);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page">
      <h2>可订阅的酒店</h2>
      {hotels.length === 0 && (
        <p>暂时没有可订阅的酒店，请稍后再试。</p>
      )}
      <div className="hotelGrid">
        {hotels.map((h) => (
          <div
            key={h.id}
            className="card"
          >
            {Array.isArray(h.images) && h.images.length > 0 ? (
              <img
                src={h.images[0]?.startsWith("http") ? h.images[0] : `http://localhost:4000${h.images[0] || ""}`}
                alt=""
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #e6f4ff" }}
              />
            ) : null}
            <h3 className="hotelCardHeader">{h.name}</h3>
            <p className="muted">
              {h.city} · {h.address}
            </p>
            <p style={{ margin: "8px 0", fontSize: 14 }}>
              {h.desc || "这家酒店暂时没有详细描述。"}
            </p>
            <div className="hotelCardFooter">
              <span className="price">
                ￥{h.price} / 晚
              </span>
              <button
                onClick={() => navigate(`/hotels/${h.id}`)}
                className="btn btnPrimary"
              >
                查看 / 订阅
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
