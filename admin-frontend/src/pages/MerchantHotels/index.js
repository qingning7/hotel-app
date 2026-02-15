import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Tag, Tabs, Checkbox, Popconfirm, message } from "antd";
import { getSession, listHotels, upsertHotel, listSubscriptionsByMerchant, setHotelDeleted } from "../../services/storage";

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
  const amenityGroups = {
    transport: ["接送机", "租车服务", "停车场", "叫车服务"],
    kids: ["儿童乐园", "儿童餐", "婴儿床"],
    dining: ["自助早餐", "咖啡厅", "餐厅"],
    frontdesk: ["行李寄存", "贵重物品寄存", "叫醒服务"],
    wellness: ["健身房", "游泳池", "Spa"]
  };
  const roomFeatureOptions = ["含早", "可退", "免费取消", "WiFi", "空调", "窗", "浴缸"];
  const roomTemplates = [
    { name: "豪华单人间", area: "30㎡", bed: "1张1.2米单人床", price: 188, features: ["WiFi", "窗"] },
    { name: "商务大床房", area: "35㎡", bed: "1张1.8米大床", price: 228, features: ["WiFi", "空调", "窗"] },
    { name: "标准双床房", area: "32㎡", bed: "2张1.2米床", price: 238, features: ["WiFi", "窗"] }
  ];

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
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            onClick={() => {
              setEditing(row);
              const n = row.nearby || {};
              const base = new Set(Array.isArray(row.amenities) ? row.amenities : []);
              form.setFieldsValue({
                ...row,
                roomType: row.roomType || "",
                opened: row.opened || "",
                policyDetail: {
                  breakfast: row?.policyDetail?.breakfast || "",
                  childrenPolicy: row?.policyDetail?.childrenPolicy || "",
                  petPolicy: row?.policyDetail?.petPolicy || "",
                  depositPolicy: row?.policyDetail?.depositPolicy || "",
                  extraBedPolicy: row?.policyDetail?.extraBedPolicy || ""
                },
                amenityPick: {
                  transport: amenityGroups.transport.filter((x) => base.has(x)),
                  kids: amenityGroups.kids.filter((x) => base.has(x)),
                  dining: amenityGroups.dining.filter((x) => base.has(x)),
                  frontdesk: amenityGroups.frontdesk.filter((x) => base.has(x)),
                  wellness: amenityGroups.wellness.filter((x) => base.has(x))
                },
                nearby: {
                  attractions: Array.isArray(n.attractions) ? n.attractions.join(", ") : (n.attractions || ""),
                  malls: Array.isArray(n.malls) ? n.malls.join(", ") : (n.malls || ""),
                  transport: Array.isArray(n.transport) ? n.transport.join(", ") : (n.transport || "")
                }
              });
              setImages(row.images || []);
              setOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="删除酒店"
            description="删除后将从列表隐藏，可在需要时联系管理员恢复"
            okText="删除"
            cancelText="取消"
            onConfirm={async () => {
              try {
                await setHotelDeleted({ id: row.id, deleted: true });
                message.success("已删除");
                setTick((x) => x + 1);
              } catch (e) {
                message.error("删除失败");
              }
            }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </div>
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
      const pick = values?.amenityPick || {};
      const mergeArr = (arr) => (Array.isArray(arr) ? arr : []);
      const selected = [
        ...mergeArr(pick.transport),
        ...mergeArr(pick.kids),
        ...mergeArr(pick.dining),
        ...mergeArr(pick.frontdesk),
        ...mergeArr(pick.wellness),
      ];
      const custom = typeof values?.amenitiesCustom === "string"
        ? values.amenitiesCustom.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      payload.amenities = Array.from(new Set([...(payload.amenities || []), ...selected, ...custom]));
      delete payload.amenityPick;
      delete payload.amenitiesCustom;
      if (payload.nearby) {
        const toArr = (v) =>
          Array.isArray(v)
            ? v
            : String(v || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        payload.nearby = {
          attractions: toArr(payload.nearby.attractions),
          malls: toArr(payload.nearby.malls),
          transport: toArr(payload.nearby.transport),
        };
      }
      if (!Array.isArray(payload.offers) && payload.offers) {
        payload.offers = String(payload.offers)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (Array.isArray(payload.roomTypes)) {
        payload.roomTypes = payload.roomTypes.map((r) => ({
          id: r.id,
          name: r.name || "",
          price: r.price ? Number(r.price) : 0,
          area: r.area || "",
          bed: r.bed || "",
          features: Array.isArray(r.features) ? r.features : [],
          img: r.img || ""
        }));
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
      <h2>商户：酒店管理</h2>
      {!session && (
        <p style={{ color: "red" }}>未找到登录信息，请返回登录页重新登录。</p>
      )}

      <Tabs
        defaultActiveKey="hotels"
        items={[
          {
            key: "hotels",
            label: "上传酒店信息",
            children: (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <Button type="primary" onClick={openNew} disabled={!session}>
                    新增酒店
                  </Button>
                </div>
                <Table rowKey="id" columns={columns} dataSource={data} />
              </div>
            )
          },
          {
            key: "subs",
            label: "客户预订",
            children: (
              <Table
                rowKey="id"
                dataSource={subs}
                columns={[
                  { title: "订阅用户", dataIndex: "username" },
                  { title: "酒店ID", dataIndex: "hotelId" },
                  { title: "入住日期", dataIndex: "checkinDate" },
                  { title: "退房日期", dataIndex: "checkoutDate" },
                  { title: "状态", dataIndex: "status", render: (v) => {
                    if (v === "cancel_pending") return <Tag color="gold">退订待处理</Tag>;
                    if (v === "cancelled") return <Tag color="green">已退订</Tag>;
                    return <Tag color="blue">进行中</Tag>;
                  }},
                  { title: "退订原因", dataIndex: "cancelReason" },
                  { title: "订阅时间", dataIndex: "createdAt", render: (v) => new Date(v).toLocaleString() },
                  {
                    title: "操作",
                    render: (_, row) => (
                      <div style={{ display: "flex", gap: 8 }}>
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
                                  <div>状态：{row.status || "active"}</div>
                                  {row.cancelReason ? <div>退订原因：{row.cancelReason}</div> : null}
                                </div>
                              ),
                            });
                          }}
                        >
                          查看详情
                        </Button>
                        {row.status === "cancel_pending" ? (
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const { approveCancelSubscription, getSession } = await import("../../services/storage");
                                const s = getSession();
                                await approveCancelSubscription({ id: row.id, reviewedBy: s?.username || "" });
                                message.success("已同意退订");
                                setTick((x) => x + 1);
                              } catch (e) {
                                message.error(e.message || "操作失败");
                              }
                            }}
                          >
                            同意退订
                          </Button>
                        ) : null}
                      </div>
                    ),
                  },
                ]}
              />
            )
          }
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
          <Form.Item label="主力房型" name="roomType">
            <Input placeholder="例如：大床房 / 标准间 / 套房" />
          </Form.Item>
          <Form.Item label="开业时间" name="opened">
            <Input placeholder="例如：2019-07" />
          </Form.Item>
          <div style={{ fontWeight: 600, marginTop: 8, marginBottom: 6 }}>设施与服务（可多选+自定义）</div>
          <Form.Item label="交通服务" name={["amenityPick", "transport"]}>
            <Checkbox.Group options={amenityGroups.transport.map((x) => ({ label: x, value: x }))} />
          </Form.Item>
          <Form.Item label="亲子设施" name={["amenityPick", "kids"]}>
            <Checkbox.Group options={amenityGroups.kids.map((x) => ({ label: x, value: x }))} />
          </Form.Item>
          <Form.Item label="餐饮服务" name={["amenityPick", "dining"]}>
            <Checkbox.Group options={amenityGroups.dining.map((x) => ({ label: x, value: x }))} />
          </Form.Item>
          <Form.Item label="前台服务" name={["amenityPick", "frontdesk"]}>
            <Checkbox.Group options={amenityGroups.frontdesk.map((x) => ({ label: x, value: x }))} />
          </Form.Item>
          <Form.Item label="康体设施" name={["amenityPick", "wellness"]}>
            <Checkbox.Group options={amenityGroups.wellness.map((x) => ({ label: x, value: x }))} />
          </Form.Item>
          <Form.Item label="自定义设施（逗号分隔）" name="amenitiesCustom">
            <Input.TextArea rows={2} placeholder="例如：洗衣房, 吸烟区" />
          </Form.Item>
          <div style={{ fontWeight: 600, marginTop: 16, marginBottom: 6 }}>房型配置</div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ marginRight: 8, color: "#666" }}>快速添加：</span>
            {roomTemplates.map((tpl) => (
              <Button
                key={tpl.name}
                size="small"
                style={{ marginRight: 6 }}
                onClick={() => {
                  const cur = form.getFieldValue("roomTypes") || [];
                  form.setFieldsValue({ roomTypes: [...cur, { ...tpl }] });
                }}
              >
                {tpl.name}
              </Button>
            ))}
          </div>
          <Form.List name="roomTypes">
            {(fields, { add, remove }) => (
              <div style={{ display: "grid", gap: 12 }}>
                {fields.map((field) => (
                  <div key={field.key} style={{ border: "1px solid #e6f4ff", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Form.Item label="房型名称" name={[field.name, "name"]} rules={[{ required: true, message: "请输入房型名称" }]}>
                        <Input placeholder="例如：豪华单人间" />
                      </Form.Item>
                      <Form.Item label="价格/晚" name={[field.name, "price"]} rules={[{ required: true, message: "请输入价格" }]}>
                        <Input placeholder="例如：199" />
                      </Form.Item>
                      <Form.Item label="面积" name={[field.name, "area"]}>
                        <Input placeholder="例如：30㎡" />
                      </Form.Item>
                      <Form.Item label="床型" name={[field.name, "bed"]}>
                        <Input placeholder="例如：1张1.8米大床 / 2张1.2米床" />
                      </Form.Item>
                      <Form.Item label="特色标签" name={[field.name, "features"]}>
                        <Checkbox.Group options={roomFeatureOptions.map((x) => ({ label: x, value: x }))} />
                      </Form.Item>
                      <Form.Item label="图片URL" name={[field.name, "img"]}>
                        <Input placeholder="可选，房型图片URL" />
                      </Form.Item>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Button danger onClick={() => remove(field.name)}>删除该房型</Button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => add()} type="dashed">新增房型</Button>
              </div>
            )}
          </Form.List>
          <Form.Item label="政策与说明" name="policies">
            <Input.TextArea rows={3} placeholder="例如：不可携带宠物；需提供身份证办理入住" />
          </Form.Item>
          <Form.Item label="早餐" name={["policyDetail", "breakfast"]}>
            <Input placeholder="例如：自助早餐 07:00-10:00" />
          </Form.Item>
          <Form.Item label="儿童政策" name={["policyDetail", "childrenPolicy"]}>
            <Input placeholder="例如：1.2米以下儿童免费" />
          </Form.Item>
          <Form.Item label="宠物政策" name={["policyDetail", "petPolicy"]}>
            <Input placeholder="例如：不可携带宠物" />
          </Form.Item>
          <Form.Item label="押金政策" name={["policyDetail", "depositPolicy"]}>
            <Input placeholder="例如：入住需支付押金" />
          </Form.Item>
          <Form.Item label="加床政策" name={["policyDetail", "extraBedPolicy"]}>
            <Input placeholder="例如：可加床，需另付费" />
          </Form.Item>
          <Form.Item
            label="价格/晚"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input placeholder="例如：399" />
          </Form.Item>
          <Form.Item label="附近热门景点（逗号分隔）" name={["nearby", "attractions"]}>
            <Input.TextArea rows={2} placeholder="例如：地标塔, 博物馆, 城市广场" />
          </Form.Item>
          <Form.Item label="附近热门商场（逗号分隔）" name={["nearby", "malls"]}>
            <Input.TextArea rows={2} placeholder="例如：万象城, 来福士, 环球港" />
          </Form.Item>
          <Form.Item label="附近交通（逗号分隔）" name={["nearby", "transport"]}>
            <Input.TextArea rows={2} placeholder="例如：地铁2号线XX站, 机场大巴站, 高铁站" />
          </Form.Item>
          <Form.Item label="优惠/折扣场景" name="offers" tooltip="可多选">
            <Checkbox.Group
              options={[
                { label: "早鸟9折", value: "early_bird" },
                { label: "连住优惠", value: "multiple_nights" },
                { label: "周末特惠", value: "weekend" },
                { label: "会员折扣", value: "member" },
                { label: "工作日特价", value: "weekday" }
              ]}
            />
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
