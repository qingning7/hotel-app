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
    setOpen(true);
  };

  const onSave = async (values) => {
    if (!session) {
      message.error("未登录，无法保存");
      return;
    }
    try {
      await upsertHotel({
        ...values,
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
          { title: "订阅时间", dataIndex: "createdAt", render: (v) => new Date(v).toLocaleString() },
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
          <Form.Item label="简介" name="desc">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="价格/晚"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input placeholder="例如：399" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
