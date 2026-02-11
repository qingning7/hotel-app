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
    </div>
  );
}
