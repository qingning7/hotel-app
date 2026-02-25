const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const https = require("https");
const geoip = require('geoip-lite');
const connectDB = require('./db');
const Hotel = require('./models/Hotel');
const Subscription = require('./models/Subscription');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const uploadDir = path.join(__dirname, "uploads");
const fs = require('fs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

// --- API Endpoints ---

app.get("/api/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/hotels/visible", async (req, res) => {
  try {
    const hotels = await Hotel.find({ status: "approved", deleted: false });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.id });
    if (!hotel) return res.status(404).json({ error: "not_found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/hotels", async (req, res) => {
  try {
    const body = req.body || {};
    const id = String(Date.now());
    const hotelData = {
      id,
      name: body.name || "",
      city: body.city || "",
      address: body.address || "",
      desc: body.desc || "",
      roomType: body.roomType || "",
      opened: body.opened || "",
      price: body.price || "",
      images: Array.isArray(body.images) ? body.images : [],
      roomTypes: Array.isArray(body.roomTypes)
        ? body.roomTypes.map(rt => ({
            id: String(rt.id || `${Date.now()}_${Math.random().toString(16).slice(2)}`),
            name: rt.name || "",
            price: Number(rt.price || 0),
            area: rt.area || "",
            bed: rt.bed || "",
            features: Array.isArray(rt.features) ? rt.features : [],
            img: rt.img || ""
          }))
        : [],
      location: body.location && typeof body.location === "object" ? {
        lat: Number(body.location.lat || 0),
        lng: Number(body.location.lng || 0),
        address: body.location.address || body.address || ""
      } : { lat: 0, lng: 0, address: body.address || "" },
      star: Number(body.star || 0),
      checkinTime: body.checkinTime || "",
      checkoutTime: body.checkoutTime || "",
      phone: body.phone || "",
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      policies: body.policies || "",
      policyDetail: {
        breakfast: body?.policyDetail?.breakfast || "",
        childrenPolicy: body?.policyDetail?.childrenPolicy || "",
        petPolicy: body?.policyDetail?.petPolicy || "",
        depositPolicy: body?.policyDetail?.depositPolicy || "",
        extraBedPolicy: body?.policyDetail?.extraBedPolicy || ""
      },
      nearby: {
        attractions: Array.isArray(body?.nearby?.attractions) ? body.nearby.attractions : [],
        malls: Array.isArray(body?.nearby?.malls) ? body.nearby.malls : [],
        transport: Array.isArray(body?.nearby?.transport) ? body.nearby.transport : []
      },
      offers: Array.isArray(body.offers) ? body.offers : [],
      status: "pending",
      reason: "",
      createdBy: body.createdBy || "",
      deleted: false,
      createdAt: Date.now()
    };
    const hotel = await Hotel.create(hotelData);
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.id });
    if (!hotel) return res.status(404).json({ error: "not_found" });

    const body = req.body || {};
    const updatedData = {
      name: body.name ?? hotel.name,
      city: body.city ?? hotel.city,
      address: body.address ?? hotel.address,
      desc: body.desc ?? hotel.desc,
      roomType: body.roomType ?? hotel.roomType,
      opened: body.opened ?? hotel.opened,
      price: body.price ?? hotel.price,
      images: Array.isArray(body.images) ? body.images : hotel.images,
      roomTypes: Array.isArray(body.roomTypes)
        ? body.roomTypes.map(rt => ({
            id: String(rt.id || `${Date.now()}_${Math.random().toString(16).slice(2)}`),
            name: rt.name || "",
            price: Number(rt.price || 0),
            area: rt.area || "",
            bed: rt.bed || "",
            features: Array.isArray(rt.features) ? rt.features : [],
            img: rt.img || ""
          }))
        : hotel.roomTypes,
      location: body.location && typeof body.location === "object"
        ? {
            lat: Number(body.location.lat || 0),
            lng: Number(body.location.lng || 0),
            address: body.location.address || hotel.location?.address || ""
          }
        : hotel.location,
      star: body.star !== undefined ? Number(body.star) : hotel.star,
      checkinTime: body.checkinTime ?? hotel.checkinTime,
      checkoutTime: body.checkoutTime ?? hotel.checkoutTime,
      phone: body.phone ?? hotel.phone,
      amenities: Array.isArray(body.amenities) ? body.amenities : hotel.amenities,
      policies: body.policies ?? hotel.policies,
      policyDetail: {
        breakfast: (body?.policyDetail?.breakfast ?? hotel.policyDetail?.breakfast) || "",
        childrenPolicy: (body?.policyDetail?.childrenPolicy ?? hotel.policyDetail?.childrenPolicy) || "",
        petPolicy: (body?.policyDetail?.petPolicy ?? hotel.policyDetail?.petPolicy) || "",
        depositPolicy: (body?.policyDetail?.depositPolicy ?? hotel.policyDetail?.depositPolicy) || "",
        extraBedPolicy: (body?.policyDetail?.extraBedPolicy ?? hotel.policyDetail?.extraBedPolicy) || ""
      },
      nearby: {
        attractions: Array.isArray(body?.nearby?.attractions) ? body.nearby.attractions : (hotel.nearby?.attractions || []),
        malls: Array.isArray(body?.nearby?.malls) ? body.nearby.malls : (hotel.nearby?.malls || []),
        transport: Array.isArray(body?.nearby?.transport) ? body.nearby.transport : (hotel.nearby?.transport || [])
      },
      offers: Array.isArray(body.offers) ? body.offers : (hotel.offers || [])
    };

    const updatedHotel = await Hotel.findOneAndUpdate({ id: req.params.id }, updatedData, { new: true });
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/hotels/:id/audit", async (req, res) => {
  try {
    const body = req.body || {};
    const status = body.status || "pending";
    const reason = status === "rejected" ? (body.reason || "") : "";
    const updatedHotel = await Hotel.findOneAndUpdate(
      { id: req.params.id },
      { status, reason },
      { new: true }
    );
    if (!updatedHotel) return res.status(404).json({ error: "not_found" });
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/hotels/:id/online", async (req, res) => {
  try {
    const body = req.body || {};
    const updatedHotel = await Hotel.findOneAndUpdate(
      { id: req.params.id },
      { deleted: !!body.deleted },
      { new: true }
    );
    if (!updatedHotel) return res.status(404).json({ error: "not_found" });
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload-images", upload.array("images", 10), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const urls = (req.files || []).map(f => `${base}/uploads/${path.basename(f.path)}`);
  res.json({ urls });
});

app.get("/api/subscriptions", async (req, res) => {
  try {
    const merchant = req.query.merchant;
    const username = req.query.username;
    if (username) {
      const list = await Subscription.find({ username });
      return res.json(list);
    }
    if (merchant) {
      const hotels = await Hotel.find({ createdBy: merchant });
      const hotelIds = hotels.map(h => h.id);
      const list = await Subscription.find({ hotelId: { $in: hotelIds } });
      return res.json(list);
    }
    const list = await Subscription.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 基于 IP 的城市识别（多级回退策略）
app.get("/api/ip-city", (req, res) => {
  const https = require('https');
  const http = require('http'); // 引入 http 模块用于 ip-api.com

  // 1. 优先尝试腾讯地图 API
  // 使用环境变量中的 KEY，如果不存在则使用默认 KEY
  const key = process.env.TENCENT_MAP_KEY || "HIDBZ-QEFEI-PX7GM-UIAJX-35WEO-U4FLU"; 
  const tencentUrl = `https://apis.map.qq.com/ws/location/v1/ip?key=${key}`;

  console.log(`[Location] Requesting Tencent Map API: ${tencentUrl}`);

  https.get(tencentUrl, (r) => {
    let data = "";
    r.on("data", (chunk) => (data += chunk));
    r.on("end", () => {
      try {
        const result = JSON.parse(data || "{}");
        if (result && result.status === 0 && result.result && result.result.ad_info) {
          const city = result.result.ad_info.city || "上海";
          console.log(`[Location] Tencent Map found: ${city}`);
          return res.json({ city: city });
        } else {
          console.error(`[Location] Tencent Map API error:`, result);
          // 腾讯 API 失败（如超限），降级尝试 ip-api.com
          fallbackToIpApi(res);
        }
      } catch (e) {
        console.error(`[Location] Tencent Parse error: ${e.message}`);
        fallbackToIpApi(res);
      }
    });
  }).on("error", (err) => {
    console.error(`[Location] Tencent Network error: ${err.message}`);
    fallbackToIpApi(res);
  });
});

// 2. 备用方案：使用 ip-api.com (免费，无 Key)
function fallbackToIpApi(res) {
  const http = require('http');
  // lang=zh-CN 返回中文城市名
  const url = "http://ip-api.com/json/?lang=zh-CN";
  
  console.log(`[Location] Fallback to ip-api.com: ${url}`);
  
  http.get(url, (r) => {
    let data = "";
    r.on("data", (chunk) => (data += chunk));
    r.on("end", () => {
      try {
        const result = JSON.parse(data || "{}");
        // ip-api.com 返回结构: { status: "success", city: "Tongling", ... }
        if (result && result.status === "success" && result.city) {
          const city = result.city || "上海";
          console.log(`[Location] ip-api.com found: ${city}`);
          return res.json({ city: city });
        } else {
          console.error(`[Location] ip-api.com error:`, result);
          return res.json({ city: "上海" });
        }
      } catch (e) {
        console.error(`[Location] ip-api.com Parse error: ${e.message}`);
        res.json({ city: "上海" });
      }
    });
  }).on("error", (err) => {
    console.error(`[Location] ip-api.com Network error: ${err.message}`);
    res.json({ city: "上海" });
  });
}

// 旧的 fallback 函数已不再需要
/*
function fallbackToIpapi(res) {
  // ...
}
*/

app.post("/api/subscriptions", async (req, res) => {
  try {
    const body = req.body || {};
    const hotel = await Hotel.findOne({ id: body.hotelId });
    if (!hotel) return res.status(400).json({ error: "invalid_hotel" });
    
    const nights = (() => {
      const start = new Date(body.checkinDate || "");
      const end = new Date(body.checkoutDate || "");
      const d = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return Number.isFinite(d) && d > 0 ? d : 1;
    })();
    const roomCount = Number(body.roomCount || 1);
    const unitPrice = Number(body.unitPrice || 0);
    const totalAmount = Number(body.totalAmount || (unitPrice * roomCount * nights));
    
    const subData = {
      id: String(Date.now()),
      hotelId: body.hotelId,
      username: body.username || "",
      checkinDate: body.checkinDate || "",
      checkoutDate: body.checkoutDate || "",
      roomId: body.roomId ? String(body.roomId) : "",
      roomName: body.roomName || "",
      roomCount,
      unitPrice,
      nights,
      totalAmount,
      createdAt: Date.now(),
      status: "active",
      cancelReason: "",
      cancelRequestedAt: null,
      cancelApprovedAt: null,
      cancelReviewedBy: ""
    };
    
    const sub = await Subscription.create(subData);
    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/subscriptions/:id", async (req, res) => {
  try {
    const body = req.body || {};
    const sub = await Subscription.findOne({ id: req.params.id });
    if (!sub) return res.status(404).json({ error: "not_found" });

    if (typeof body.cancelRequestReason === "string" && body.cancelRequestReason.trim() !== "") {
      sub.status = "cancel_pending";
      sub.cancelReason = body.cancelRequestReason;
      sub.cancelRequestedAt = Date.now();
    } else {
      if (body.checkinDate) sub.checkinDate = body.checkinDate;
      if (body.checkoutDate) sub.checkoutDate = body.checkoutDate;
      
      // Recalculate nights and totalAmount if dates changed
      if (body.checkinDate || body.checkoutDate) {
        const start = new Date(sub.checkinDate);
        const end = new Date(sub.checkoutDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        sub.nights = Number.isFinite(diff) && diff > 0 ? diff : 1;
        sub.totalAmount = (sub.unitPrice || 0) * (sub.roomCount || 1) * sub.nights;
      }
    }
    
    await sub.save();
    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/subscriptions/:id/approve-cancel", async (req, res) => {
  try {
    const body = req.body || {};
    const updatedSub = await Subscription.findOneAndUpdate(
      { id: req.params.id },
      {
        status: "cancelled",
        cancelApprovedAt: Date.now(),
        cancelReviewedBy: body.reviewedBy || ""
      },
      { new: true }
    );
    if (!updatedSub) return res.status(404).json({ error: "not_found" });
    res.json(updatedSub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/subscriptions/:id", async (req, res) => {
  try {
    const removed = await Subscription.findOneAndDelete({ id: req.params.id });
    if (!removed) return res.status(404).json({ error: "not_found" });
    res.json({ ok: true, id: removed.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: "Username taken" });
    
    const user = await User.create({
      id: String(Date.now()),
      username,
      password, // In production, hash this!
      role: role || "user",
      createdAt: Date.now()
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  process.stdout.write(`server:${port}\n`);
});
