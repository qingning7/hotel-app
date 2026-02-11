import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Tag, message } from "antd";
import { getSession, listHotels, upsertHotel, listSubscriptionsByMerchant } from "../../services/storage";

function statusTag(status) {
  if (status === "approved") return <Tag color="green">通过</Tag>;
  if (status === "rejected") return <Tag color="red">不通过</Tag>;
  return <Tag color="gold">审核中</Tag>;
}

export default function MerchantHotels() {
  const session = getSession();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tick, setTick] = useState(0);
  const [data, setData] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!session) {
        if (mounted) {
          setData([]);
          setSubs([]);
        }
        return;
      }
      const all = await listHotels();
      const my = all.filter((h) => h.createdBy === session.username).filter((h) => !h.deleted);
      const s = await listSubscriptionsByMerchant(session.username);
      if (mounted) {
        setData(my);
        setSubs(s);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [session, tick]);

  const columns = [
    { title: "酒店名", dataIndex: "name" },
    { title: "城市", dataIndex: "city" },
    { title: "地址", dataIndex: "address" },
    { title: "价格/晚", dataIndex: "price" },
    {
      title: "审核状态",
      dataIndex: "status",
      render: (_, row) => (
        <div>
          {statusTag(row.status)}
          {row.status === "rejected" && row.reason ? (
            <div style={{ color: "#999", fontSize: 12 }}>原因：{row.reason}</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "操作",
      render: (_, row) => (
        <Button
          onClick={() => {
            setEditing(row);
            form.setFieldsValue(row);
            setImages(row.images || []);
            setOpen(true);
          }}
        >
          编辑
        </Button>
      ),
    },
  ];

  const openNew = () => {
    setEditing(null);
    form.resetFields();
    setImages([]);
    setOpen(true);
  };

  const onSave = async (values) => {
    if (!session) {
      message.error("未登录，无法保存");
      return;
    }
    try {
      const payload = { ...values };
      if (typeof payload.star === "string" && payload.star.trim() !== "") {
        payload.star = Number(payload.star);
      }
      if (typeof payload.amenities === "string") {
        payload.amenities = payload.amenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (payload.location) {
        const lat = payload.location.lat;
        const lng = payload.location.lng;
        payload.location = {
          lat: lat ? Number(lat) : 0,
          lng: lng ? Number(lng) : 0,
          address: values.address || ""
        };
      }
      payload.images = images;
      await upsertHotel({
        ...payload,
        id: editing?.id,
        createdBy: session.username,
      });
      message.success("保存成功（已提交审核）");
      setOpen(false);
      setTick((x) => x + 1);
    } catch (e) {
      message.error(e.message || "保存失败");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>商户：酒店信息录入/编辑</h2>
      {!session && (
        <p style={{ color: "red" }}>未找到登录信息，请返回登录页重新登录。</p>
      )}

      <div style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={openNew} disabled={!session}>
          新增酒店
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={data} />

      <h3 style={{ marginTop: 24 }}>我的酒店订阅</h3>
      <Table
        rowKey="id"
        dataSource={subs}
        columns={[
          { title: "订阅用户", dataIndex: "username" },
          { title: "酒店ID", dataIndex: "hotelId" },
          { title: "入住日期", dataIndex: "checkinDate" },
          { title: "退房日期", dataIndex: "checkoutDate" },
          { title: "订阅时间", dataIndex: "createdAt", render: (v) => new Date(v).toLocaleString() },
          {
            title: "操作",
            render: (_, row) => (
              <Button
                onClick={() => {
                  Modal.info({
                    title: "订阅详情",
                    content: (
                      <div style={{ lineHeight: 1.8 }}>
                        <div>订阅用户：{row.username}</div>
                        <div>酒店ID：{row.hotelId}</div>
                        <div>入住日期：{row.checkinDate}</div>
                        <div>退房日期：{row.checkoutDate}</div>
                        <div>订阅时间：{new Date(row.createdAt).toLocaleString()}</div>
                      </div>
                    ),
                  });
                }}
              >
                查看详情
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "编辑酒店" : "新增酒店"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="保存"
      >
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item
            label="酒店名称"
            name="name"
            rules={[{ required: true, message: "请输入酒店名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="城市"
            name="city"
            rules={[{ required: true, message: "请输入城市" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="酒店星级（0-5）" name="star">
            <Input placeholder="例如：4" />
          </Form.Item>
          <Form.Item label="入住时间" name="checkinTime">
            <Input placeholder="例如：14:00" />
          </Form.Item>
          <Form.Item label="退房时间" name="checkoutTime">
            <Input placeholder="例如：12:00" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="例如：021-12345678" />
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="设施与服务（用逗号分隔）" name="amenities">
            <Input.TextArea rows={2} placeholder="例如：wifi, 停车, 早餐, 健身房" />
          </Form.Item>
          <Form.Item label="政策与说明" name="policies">
            <Input.TextArea rows={3} placeholder="例如：不可携带宠物；需提供身份证办理入住" />
          </Form.Item>
          <Form.Item
            label="价格/晚"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input placeholder="例如：399" />
          </Form.Item>
          <Form.Item label="酒店位置（纬度）" name={["location", "lat"]}>
            <Input placeholder="例如：31.2304" />
          </Form.Item>
          <Form.Item label="酒店位置（经度）" name={["location", "lng"]}>
            <Input placeholder="例如：121.4737" />
          </Form.Item>
          <Form.Item label="上传图片">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                try {
                  setUploading(true);
                  const fd = new FormData();
                  files.forEach((f) => fd.append("images", f));
                  const r = await fetch("http://localhost:4000/api/upload-images", {
                    method: "POST",
                    body: fd,
                  });
                  if (!r.ok) throw new Error("上传失败");
                  const data = await r.json();
                  const urls = data.urls || [];
                  setImages((cur) => [...cur, ...urls]);
                  message.success("上传成功");
                } catch (err) {
                  message.error("上传失败");
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {images.map((url) => {
                const src = url?.startsWith("http") ? url : `http://localhost:4000${url || ""}`;
                return <img key={url} src={src} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e6f4ff" }} />;
              })}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              {uploading ? "正在上传..." : "支持多图上传，建议大小不超过 2MB"}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
