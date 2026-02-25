import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, DatePicker, message, Typography } from "antd";
import { listSubscriptions, updateSubscription, cancelSubscription, getHotelById } from "../services/storage";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [hotelsMap, setHotelsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newDates, setNewDates] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("hs_user_front_session");
      const session = raw ? JSON.parse(raw) : null;
      if (!session?.username) {
        message.warning("请先登录");
        return;
      }
      const list = await listSubscriptions(session.username);
      
      // Fetch hotel details for each unique hotelId
      const uniqueHotelIds = [...new Set(list.map(o => o.hotelId))];
      const hotelData = {};
      await Promise.all(uniqueHotelIds.map(async (hid) => {
        try {
          const h = await getHotelById(hid);
          if (h) hotelData[hid] = h;
        } catch (e) {
          console.error(e);
        }
      }));
      setHotelsMap(hotelData);
      setOrders(list);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    Modal.confirm({
      title: "确认取消订单？",
      content: "取消后将无法恢复。",
      onOk: async () => {
        try {
          await cancelSubscription(id, "用户主动取消");
          message.success("取消申请已提交");
          fetchOrders();
        } catch (err) {
          message.error("取消失败：" + err.message);
        }
      },
    });
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    setNewDates([dayjs(record.checkinDate), dayjs(record.checkoutDate)]);
    setIsModalOpen(true);
  };

  const submitEdit = async () => {
    if (!newDates || newDates.length !== 2) return;
    try {
      await updateSubscription(editingOrder.id, {
        checkinDate: newDates[0].format("YYYY-MM-DD"),
        checkoutDate: newDates[1].format("YYYY-MM-DD"),
      });
      message.success("修改成功");
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      message.error("修改失败：" + err.message);
    }
  };

  const columns = [
    {
      title: "订单号",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (id) => <Text copyable>{id}</Text>,
    },
    {
      title: "酒店名称",
      key: "hotelName",
      render: (_, record) => hotelsMap[record.hotelId]?.name || record.hotelId, 
    },
    {
      title: "房型",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "入住日期",
      dataIndex: "checkinDate",
      key: "checkinDate",
    },
    {
      title: "退房日期",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
    },
    {
      title: "总价",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v) => <Text type="danger">¥{v}</Text>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const map = {
          active: <Tag color="green">已预订</Tag>,
          cancel_pending: <Tag color="orange">取消审核中</Tag>,
          cancelled: <Tag color="red">已取消</Tag>,
        };
        return map[status] || status;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <>
          {record.status === "active" && (
            <>
              <Button type="link" onClick={() => handleEdit(record)}>
                修改日期
              </Button>
              <Button type="link" danger onClick={() => handleCancel(record.id)}>
                取消订单
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Typography.Title level={2}>我的订单</Typography.Title>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="修改入住日期"
        open={isModalOpen}
        onOk={submitEdit}
        onCancel={() => setIsModalOpen(false)}
      >
        <div style={{ marginBottom: 16 }}>
          请选择新的入住和退房日期：
        </div>
        <RangePicker
          value={newDates}
          onChange={(dates) => setNewDates(dates)}
          style={{ width: "100%" }}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
      </Modal>
    </div>
  );
}
