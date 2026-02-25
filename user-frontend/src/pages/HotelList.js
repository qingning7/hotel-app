import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Card, Typography, Rate, Tag, Button, Select, Space, message, Input, Form, Row, Col } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { listAllHotels, getUserLocation } from "../services/storage";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// 常用城市列表
const PRESET_CITIES = [
  "合肥", "北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "武汉", "西安", "重庆", "长沙", "苏州", "天津", "郑州", "东莞", "青岛", "沈阳", "宁波", "昆明"
];

export default function HotelListPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [locating, setLocating] = useState(false);

  // Filters
  const [selectedCity, setSelectedCity] = useState("合肥");
  const [selectedStar, setSelectedStar] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await listAllHotels();
        if (mounted) {
          setHotels(list);
          const uniqueCities = [...new Set(list.map(h => h.city).filter(Boolean))];
          // 合并常用城市和已有酒店城市，并去重
          const allCities = [...new Set([...PRESET_CITIES, ...uniqueCities])];
          setCities(allCities);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLocate = async () => {
    setLocating(true);
    try {
      const city = await getUserLocation();
      setSelectedCity(city);
      message.success(`已定位到：${city}`);
    } catch (e) {
      console.error(e);
      message.error("定位失败，请手动选择");
    } finally {
      setLocating(false);
    }
  };

  const filteredHotels = hotels.filter(h => {
    const matchCity = selectedCity === "全部" || h.city === selectedCity;
    const matchStar = selectedStar === "all" || Number(h.star) >= Number(selectedStar);
    const matchKeyword = !keyword || h.name.includes(keyword) || (h.desc && h.desc.includes(keyword));
    return matchCity && matchStar && matchKeyword;
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <Title level={4} style={{ marginTop: 0 }}>酒店筛选</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>城市：</div>
            <div style={{ display: "flex", width: "100%", gap: 8 }}>
               <Select 
                 showSearch
                 value={selectedCity} 
                 onChange={setSelectedCity} 
                 style={{ flex: 1 }}
                 placeholder="选择城市"
               >
                 <Option value="全部">全部城市</Option>
                 {cities.map(c => <Option key={c} value={c}>{c}</Option>)}
               </Select>
               <Button 
                 icon={<EnvironmentOutlined />} 
                 onClick={handleLocate}
                 loading={locating}
               >
                 定位
               </Button>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>星级：</div>
            <Select 
              value={selectedStar} 
              onChange={setSelectedStar} 
              style={{ width: "100%" }}
            >
              <Option value="all">不限</Option>
              <Option value="5">五星级</Option>
              <Option value="4">四星级及以上</Option>
              <Option value="3">三星级及以上</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={{ marginBottom: 8 }}>关键词：</div>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="搜索酒店名称/描述" 
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>共找到 {filteredHotels.length} 家符合条件的酒店</Text>
      </div>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={filteredHotels}
        loading={loading}
        renderItem={(h) => (
          <List.Item key={h.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={h.name}
                  src={
                    h.images && h.images[0]
                      ? h.images[0].startsWith("http")
                        ? h.images[0]
                        : `http://localhost:4000${h.images[0]}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              actions={[
                <Button type="primary" onClick={() => navigate(`/hotels/${h.id}`)}>
                  查看详情
                </Button>
              ]}
            >
              <Meta
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</span>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Rate disabled defaultValue={Number(h.star)} style={{ fontSize: 14 }} />
                      <Text type="secondary" style={{ marginLeft: 8 }}>{h.score || 4.8}分</Text>
                    </div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ height: 44, marginBottom: 8 }}>
                      {h.desc || "暂无描述"}
                    </Paragraph>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Text type="secondary">{h.city}</Text>
                      <Text type="danger" strong style={{ fontSize: 18 }}>
                        ¥{h.price} <span style={{ fontSize: 12, color: "#999", fontWeight: "normal" }}>起</span>
                      </Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
