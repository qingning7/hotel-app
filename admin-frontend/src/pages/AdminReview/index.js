import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag, message } from "antd";
import { listHotels, setHotelAudit, setHotelDeleted } from "../../services/storage";

function statusTag(status) {
  if (status === "approved") return <Tag color="green">通过</Tag>;
  if (status === "rejected") return <Tag color="red">不通过</Tag>;
  return <Tag color="gold">审核中</Tag>;
}

export default function AdminReview() {
  const [tick, setTick] = useState(0);
  const [reasonModal, setReasonModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState("");
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState({ open: false, row: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const all = await listHotels();
      if (mounted) setData(all);
    })();
    return () => {
      mounted = false;
    };
  }, [tick]);

  const approve = async (id) => {
    try {
      await setHotelAudit({ id, status: "approved" });
      message.success("已审核通过");
      setTick((x) => x + 1);
    } catch (e) {
      message.error(e.message || "操作失败");
    }
  };

  const openReject = (id) => {
    setReason("");
    setReasonModal({ open: true, id });
  };

  const reject = async () => {
    try {
      await setHotelAudit({ id: reasonModal.id, status: "rejected", reason });
      message.success("已设置为不通过");
      setReasonModal({ open: false, id: null });
      setTick((x) => x + 1);
    } catch (e) {
      message.error(e.message || "操作失败");
    }
  };

  const toggleOffline = async (row) => {
    try {
      await setHotelDeleted({ id: row.id, deleted: !row.deleted });
      message.success(row.deleted ? "已恢复上线" : "已下线（可恢复）");
      setTick((x) => x + 1);
    } catch (e) {
      message.error(e.message || "操作失败");
    }
  };

  const columns = [
    {
      title: "缩略图",
      dataIndex: "images",
      render: (images) =>
        Array.isArray(images) && images.length > 0 ? (
          <img src={(images[0]?.startsWith("http") ? images[0] : `http://localhost:4000${images[0] || ""}`)} alt="" style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e6f4ff" }} />
        ) : (
          <span>—</span>
        ),
    },
    { title: "酒店名", dataIndex: "name" },
    { title: "商户", dataIndex: "createdBy" },
    { title: "城市", dataIndex: "city" },
    { title: "地址", dataIndex: "address" },
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
      title: "上下线",
      dataIndex: "deleted",
      render: (_, row) =>
        row.deleted ? <Tag>已下线</Tag> : <Tag color="blue">上线中</Tag>,
    },
    {
      title: "操作",
      render: (_, row) => (
        <Space>
          <Button onClick={() => approve(row.id)} disabled={row.deleted}>
            通过
          </Button>
          <Button danger onClick={() => openReject(row.id)} disabled={row.deleted}>
            不通过
          </Button>
          <Button onClick={() => toggleOffline(row)}>
            {row.deleted ? "恢复" : "下线"}
          </Button>
          <Button
            type="link"
            onClick={() => setDetail({ open: true, row })}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>管理员：酒店信息审核/发布/下线</h2>
      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal
        title="请输入不通过原因"
        open={reasonModal.open}
        onCancel={() => setReasonModal({ open: false, id: null })}
        onOk={reject}
        okText="提交"
      >
        <Input.TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="例如：地址不完整/价格不合法/图片缺失等"
        />
      </Modal>
      <Modal
        title="酒店详情"
        open={detail.open}
        onCancel={() => setDetail({ open: false, row: null })}
        footer={null}
        width={800}
      >
        {detail.row ? (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {(detail.row.images || []).map((url) => {
                const src = url?.startsWith("http") ? url : `http://localhost:4000${url || ""}`;
                return <img key={url} src={src} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8, border: "1px solid #e6f4ff" }} />;
              })}
            </div>
            <div style={{ lineHeight: 1.9 }}>
              <div>酒店名：{detail.row.name}</div>
              <div>星级：{detail.row.star}</div>
              <div>主力房型：{detail.row.roomType || ""}</div>
              <div>开业时间：{detail.row.opened || ""}</div>
              <div>城市：{detail.row.city}</div>
              <div>地址：{detail.row.address}</div>
              <div>价格/晚：{detail.row.price}</div>
              <div>入住时间：{detail.row.checkinTime}</div>
              <div>退房时间：{detail.row.checkoutTime}</div>
              <div>联系电话：{detail.row.phone}</div>
              <div>设施与服务：{Array.isArray(detail.row.amenities) ? detail.row.amenities.join(", ") : ""}</div>
              <div>政策与说明：{detail.row.policies}</div>
              <div>早餐：{detail.row?.policyDetail?.breakfast || "-"}</div>
              <div>儿童政策：{detail.row?.policyDetail?.childrenPolicy || "-"}</div>
              <div>宠物政策：{detail.row?.policyDetail?.petPolicy || "-"}</div>
              <div>押金政策：{detail.row?.policyDetail?.depositPolicy || "-"}</div>
              <div>加床政策：{detail.row?.policyDetail?.extraBedPolicy || "-"}</div>
              <div>周边景点：{Array.isArray(detail.row.nearby?.attractions) ? detail.row.nearby.attractions.join("、") : "-"}</div>
              <div>周边商场：{Array.isArray(detail.row.nearby?.malls) ? detail.row.nearby.malls.join("、") : "-"}</div>
              <div>周边交通：{Array.isArray(detail.row.nearby?.transport) ? detail.row.nearby.transport.join("、") : "-"}</div>
              <div>优惠活动：{Array.isArray(detail.row.offers) && detail.row.offers.length > 0 ? detail.row.offers.join("、") : "-"}</div>
              <div>简介：{detail.row.desc}</div>
            </div>
            {Array.isArray(detail.row.roomTypes) && detail.row.roomTypes.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>房型列表</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {detail.row.roomTypes.map((r) => (
                    <div key={r.id || r.name} style={{ border: "1px solid #eaeaea", borderRadius: 8, padding: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div>{r.name}</div>
                          <div style={{ color: "#666", fontSize: 12 }}>{r.area} · {r.bed}</div>
                        </div>
                        <div style={{ color: "#ff4d4f" }}>¥{r.price}</div>
                      </div>
                      <div style={{ marginTop: 4, color: "#555", fontSize: 12 }}>
                        {(r.features || []).join("、")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
