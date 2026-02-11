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
              <div>城市：{detail.row.city}</div>
              <div>地址：{detail.row.address}</div>
              <div>价格/晚：{detail.row.price}</div>
              <div>入住时间：{detail.row.checkinTime}</div>
              <div>退房时间：{detail.row.checkoutTime}</div>
              <div>联系电话：{detail.row.phone}</div>
              <div>设施与服务：{Array.isArray(detail.row.amenities) ? detail.row.amenities.join(", ") : ""}</div>
              <div>政策与说明：{detail.row.policies}</div>
              <div>坐标：{detail.row.location?.lat}, {detail.row.location?.lng}</div>
              <div>简介：{detail.row.desc}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
