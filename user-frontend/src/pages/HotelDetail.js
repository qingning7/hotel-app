import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, Typography, Tag, Rate, Card, DatePicker, Button, List, message, Divider, Row, Col, Statistic } from "antd";
import { createSubscription, getHotelById } from "../services/storage";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const OFFER_MAP = {
  early_bird: "早鸟优惠",
  multiple_nights: "连住优惠",
  weekend: "周末特惠",
  member: "会员专享"
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const h = await getHotelById(id);
      setHotel(h || null);
    })();
  }, [id]);

  if (!hotel) {
    return <div style={{ padding: 40, textAlign: "center" }}>加载中或未找到酒店...</div>;
  }

  const handleSubscribe = async () => {
    const raw = localStorage.getItem("hs_user_front_session");
    const session = raw ? JSON.parse(raw) : null;
    if (!session?.username) {
      message.warning("请先登录");
      navigate("/");
      return;
    }
    if (!dates || dates.length !== 2) {
      message.warning("请选择入住与退房日期");
      return;
    }
    if (!selectedRoom) {
      message.warning("请选择房型");
      return;
    }

    setLoading(true);
    try {
      const checkinDate = dates[0].format("YYYY-MM-DD");
      const checkoutDate = dates[1].format("YYYY-MM-DD");
      const nights = dates[1].diff(dates[0], "day") || 1;
      const totalPrice = selectedRoom.price * nights;

      await createSubscription({
        hotelId: hotel.id,
        username: session.username,
        checkinDate,
        checkoutDate,
        roomId: selectedRoom.id || selectedRoom.name, // Fallback if no ID
        roomName: selectedRoom.name,
        roomCount: 1,
        unitPrice: selectedRoom.price,
        totalAmount: totalPrice,
        nights,
      });
      message.success("预订成功！");
      navigate("/orders");
    } catch (err) {
      message.error("预订失败：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nights = dates && dates.length === 2 ? dates[1].diff(dates[0], "day") : 0;
  const totalPrice = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Button onClick={() => navigate("/hotels")} style={{ marginBottom: 16 }}>
        &lt; 返回列表
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Carousel autoplay style={{ borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
            {hotel.images && hotel.images.length > 0 ? (
              hotel.images.map((url, i) => (
                <div key={i}>
                  <img
                    src={url.startsWith("http") ? url : `http://localhost:4000${url}`}
                    alt={hotel.name}
                    style={{ width: "100%", height: 400, objectFit: "cover" }}
                  />
                </div>
              ))
            ) : (
              <div>
                <div style={{ height: 400, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  暂无图片
                </div>
              </div>
            )}
          </Carousel>

          <Card>
            <Title level={2}>{hotel.name}</Title>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{hotel.city}</Tag>
              <Rate disabled defaultValue={Number(hotel.star)} />
              <Text type="secondary" style={{ marginLeft: 8 }}>{hotel.score || 4.8}分</Text>
            </div>
            <Paragraph>
              <Text strong>地址：</Text>{hotel.address}
            </Paragraph>
            <Paragraph>
              <Text strong>简介：</Text>{hotel.desc}
            </Paragraph>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>入住时间：</Text>{hotel.checkinTime || "14:00后"}
              </Col>
              <Col span={12}>
                <Text strong>退房时间：</Text>{hotel.checkoutTime || "12:00前"}
              </Col>
              <Col span={12}>
                 <Text strong>开业时间：</Text>{hotel.opened || "未知"}
              </Col>
              <Col span={12}>
                 <Text strong>联系电话：</Text>{hotel.phone || "暂无"}
              </Col>
            </Row>
            <Divider />
            <Title level={4}>设施与服务</Title>
            <div style={{ marginBottom: 16 }}>
              {hotel.amenities && hotel.amenities.map(f => <Tag key={f} color="blue">{f}</Tag>)}
            </div>
            
            {(hotel.policies || hotel.policyDetail) && (
              <>
                <Title level={5}>酒店政策</Title>
                {hotel.policies && <Paragraph>{hotel.policies}</Paragraph>}
                {hotel.policyDetail && (
                  <div style={{ background: "#fafafa", padding: 12, borderRadius: 4 }}>
                    {hotel.policyDetail.breakfast && <div><Text strong>早餐：</Text>{hotel.policyDetail.breakfast}</div>}
                    {hotel.policyDetail.childrenPolicy && <div><Text strong>儿童：</Text>{hotel.policyDetail.childrenPolicy}</div>}
                    {hotel.policyDetail.petPolicy && <div><Text strong>宠物：</Text>{hotel.policyDetail.petPolicy}</div>}
                  </div>
                )}
              </>
            )}

            {hotel.offers && hotel.offers.length > 0 && (
               <>
                 <Divider />
                 <Title level={4}>优惠信息</Title>
                 {hotel.offers.map((o, i) => (
                   <Tag color="red" key={i} style={{ marginBottom: 8 }}>
                     {OFFER_MAP[o] || o}
                   </Tag>
                 ))}
               </>
            )}

            {hotel.nearby && (
              <>
                 <Divider />
                 <Title level={4}>周边信息</Title>
                 {hotel.nearby.attractions && hotel.nearby.attractions.length > 0 && (
                   <div style={{ marginBottom: 8 }}>
                     <Text strong>景点：</Text>
                     {hotel.nearby.attractions.join("、")}
                   </div>
                 )}
                 {hotel.nearby.transport && hotel.nearby.transport.length > 0 && (
                   <div style={{ marginBottom: 8 }}>
                     <Text strong>交通：</Text>
                     {hotel.nearby.transport.join("、")}
                   </div>
                 )}
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="预订客房" bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ marginBottom: 24 }}>
              <Text strong>1. 选择日期</Text>
              <RangePicker
                style={{ width: "100%", marginTop: 8 }}
                onChange={(vals) => setDates(vals)}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>2. 选择房型</Text>
              <List
                style={{ marginTop: 8 }}
                itemLayout="horizontal"
                dataSource={hotel.roomTypes || []}
                renderItem={(room) => (
                  <List.Item
                    onClick={() => setSelectedRoom(room)}
                    style={{
                      cursor: "pointer",
                      background: selectedRoom === room ? "#e6f7ff" : "transparent",
                      border: selectedRoom === room ? "1px solid #1890ff" : "1px solid #f0f0f0",
                      borderRadius: 4,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{room.name}</span>
                          <span style={{ color: "#ff4d4f" }}>¥{room.price}</span>
                        </div>
                      }
                      description={
                        <div style={{ fontSize: 12 }}>
                          {room.area} | {room.bed} | {Array.isArray(room.features) ? room.features.join(" ") : ""}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <Statistic title="总价" value={totalPrice} prefix="¥" precision={2} />
              <Text type="secondary">{nights} 晚</Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleSubscribe}
              loading={loading}
              disabled={!selectedRoom || !dates || dates.length !== 2}
            >
              立即预订
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
