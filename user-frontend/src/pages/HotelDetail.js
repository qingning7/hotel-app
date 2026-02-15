import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSubscription, getHotelById } from "../services/storage";

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");

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
      if (!checkinDate || !checkoutDate) {
        alert("请选择入住与退房日期");
        return;
      }
      await createSubscription({ hotelId: hotel.id, username: session.username, checkinDate, checkoutDate });
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
      {Array.isArray(hotel.images) && hotel.images.length > 0 ? (
        <div className="gallery" style={{ marginTop: 8 }}>
          {hotel.images.map((url) => {
            const src = url?.startsWith("http") ? url : `http://localhost:4000${url || ""}`;
            return <img key={url} src={src} alt="" style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #e6f4ff" }} />;
          })}
        </div>
      ) : null}
      <p className="muted">
        {hotel.city} · {hotel.address}
      </p>
      <p style={{ margin: "12px 0" }}>{hotel.desc}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 8 }}>
        <div className="card">
          <div>星级：{hotel.star || 0}</div>
          <div>主力房型：{hotel.roomType || "—"}</div>
          <div>开业时间：{hotel.opened || "—"}</div>
          <div>入住时间：{hotel.checkinTime || "—"}</div>
          <div>退房时间：{hotel.checkoutTime || "—"}</div>
          <div>联系电话：{hotel.phone || "—"}</div>
        </div>
        {Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0 ? (
          <div className="card">
            <div style={{ marginBottom: 6 }}>房型与价格</div>
            <div style={{ display: "grid", gap: 8 }}>
              {hotel.roomTypes.map((r) => (
                <div key={r.id || r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{r.area} · {r.bed}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{Array.isArray(r.features) ? r.features.join("、") : ""}</div>
                  </div>
                  <div style={{ color: "#ff4d4f" }}>¥{r.price}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="card">
          <div style={{ marginBottom: 6 }}>设施与服务</div>
          <div>
            {(Array.isArray(hotel.amenities) ? hotel.amenities : []).map((a) => (
              <span key={a} className="badge">{a}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{ marginBottom: 6 }}>政策与说明</div>
          <div style={{ fontSize: 14, color: "#333" }}>{hotel.policies || "—"}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
            <div>早餐：{hotel?.policyDetail?.breakfast || "—"}</div>
            <div>儿童政策：{hotel?.policyDetail?.childrenPolicy || "—"}</div>
            <div>宠物政策：{hotel?.policyDetail?.petPolicy || "—"}</div>
            <div>押金政策：{hotel?.policyDetail?.depositPolicy || "—"}</div>
            <div>加床政策：{hotel?.policyDetail?.extraBedPolicy || "—"}</div>
          </div>
        </div>
        <div className="card">
          <div style={{ marginBottom: 6 }}>周边</div>
          <div style={{ fontSize: 14 }}>
            <div>景点：{Array.isArray(hotel.nearby?.attractions) && hotel.nearby.attractions.length > 0 ? hotel.nearby.attractions.join("、") : "—"}</div>
            <div>商场：{Array.isArray(hotel.nearby?.malls) && hotel.nearby.malls.length > 0 ? hotel.nearby.malls.join("、") : "—"}</div>
            <div>交通：{Array.isArray(hotel.nearby?.transport) && hotel.nearby.transport.length > 0 ? hotel.nearby.transport.join("、") : "—"}</div>
          </div>
        </div>
        <div className="card">
          <div style={{ marginBottom: 6 }}>优惠活动</div>
          <div>
            {Array.isArray(hotel.offers) && hotel.offers.length > 0
              ? hotel.offers.map((o) => <span key={o} className="badge">{o}</span>)
              : "—"}
          </div>
        </div>
      </div>
      <p className="price">
        ￥{hotel.price} / 晚
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, maxWidth: 420 }}>
        <div>
          <label>入住日期</label>
          <input
            type="date"
            className="input"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
          />
        </div>
        <div>
          <label>退房日期</label>
          <input
            type="date"
            className="input"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
          />
        </div>
      </div>
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
