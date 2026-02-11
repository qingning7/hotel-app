const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");
const uploadDir = path.join(__dirname, "uploads");
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

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    const obj = JSON.parse(raw);
    if (!obj.users || !obj.hotels || !obj.subscriptions) throw new Error();
    return obj;
  } catch {
    const seed = {
      users: [
        { username: "admin", password: "123456", role: "admin" },
        { username: "merchant", password: "123456", role: "merchant" }
      ],
      hotels: [],
      subscriptions: []
    };
    fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2));
    return seed;
  }
}

function writeData(obj) {
  fs.writeFileSync(dataFile, JSON.stringify(obj, null, 2));
}

app.get("/api/hotels", (req, res) => {
  const db = readData();
  res.json(db.hotels);
});

app.get("/api/hotels/visible", (req, res) => {
  const db = readData();
  const list = db.hotels.filter(h => h.status === "approved" && !h.deleted);
  res.json(list);
});

app.get("/api/hotels/:id", (req, res) => {
  const db = readData();
  const h = db.hotels.find(x => x.id === req.params.id);
  if (!h) return res.status(404).json({ error: "not_found" });
  res.json(h);
});

app.post("/api/hotels", (req, res) => {
  const db = readData();
  const body = req.body || {};
  const id = String(Date.now());
  const hotel = {
    id,
    name: body.name || "",
    city: body.city || "",
    address: body.address || "",
    desc: body.desc || "",
    price: body.price || "",
    images: Array.isArray(body.images) ? body.images : [],
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
    status: "pending",
    reason: "",
    createdBy: body.createdBy || "",
    deleted: false,
    createdAt: Date.now()
  };
  db.hotels.push(hotel);
  writeData(db);
  res.json(hotel);
});

app.put("/api/hotels/:id", (req, res) => {
  const db = readData();
  const idx = db.hotels.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });
  const body = req.body || {};
  db.hotels[idx] = {
    ...db.hotels[idx],
    name: body.name ?? db.hotels[idx].name,
    city: body.city ?? db.hotels[idx].city,
    address: body.address ?? db.hotels[idx].address,
    desc: body.desc ?? db.hotels[idx].desc,
    price: body.price ?? db.hotels[idx].price,
    images: Array.isArray(body.images) ? body.images : db.hotels[idx].images,
    location: body.location && typeof body.location === "object"
      ? {
          lat: Number(body.location.lat || 0),
          lng: Number(body.location.lng || 0),
          address: body.location.address || db.hotels[idx].location?.address || ""
        }
      : db.hotels[idx].location,
    star: body.star !== undefined ? Number(body.star) : db.hotels[idx].star,
    checkinTime: body.checkinTime ?? db.hotels[idx].checkinTime,
    checkoutTime: body.checkoutTime ?? db.hotels[idx].checkoutTime,
    phone: body.phone ?? db.hotels[idx].phone,
    amenities: Array.isArray(body.amenities) ? body.amenities : db.hotels[idx].amenities,
    policies: body.policies ?? db.hotels[idx].policies
  };
  writeData(db);
  res.json(db.hotels[idx]);
});

app.patch("/api/hotels/:id/audit", (req, res) => {
  const db = readData();
  const idx = db.hotels.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });
  const body = req.body || {};
  db.hotels[idx].status = body.status || "pending";
  db.hotels[idx].reason = db.hotels[idx].status === "rejected" ? (body.reason || "") : "";
  writeData(db);
  res.json(db.hotels[idx]);
});

app.patch("/api/hotels/:id/online", (req, res) => {
  const db = readData();
  const idx = db.hotels.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });
  const body = req.body || {};
  db.hotels[idx].deleted = !!body.deleted;
  writeData(db);
  res.json(db.hotels[idx]);
});

app.post("/api/upload-images", upload.array("images", 10), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const urls = (req.files || []).map(f => `${base}/uploads/${path.basename(f.path)}`);
  res.json({ urls });
});

app.get("/api/subscriptions", (req, res) => {
  const db = readData();
  const merchant = req.query.merchant;
  if (!merchant) return res.json(db.subscriptions);
  const hotelIds = db.hotels.filter(h => h.createdBy === merchant).map(h => h.id);
  const list = db.subscriptions.filter(s => hotelIds.includes(s.hotelId));
  res.json(list);
});

app.post("/api/subscriptions", (req, res) => {
  const db = readData();
  const body = req.body || {};
  const hotel = db.hotels.find(h => h.id === body.hotelId);
  if (!hotel) return res.status(400).json({ error: "invalid_hotel" });
  const sub = {
    id: String(Date.now()),
    hotelId: body.hotelId,
    username: body.username || "",
    checkinDate: body.checkinDate || "",
    checkoutDate: body.checkoutDate || "",
    createdAt: Date.now()
  };
  db.subscriptions.push(sub);
  writeData(db);
  res.json(sub);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  process.stdout.write(`server:${port}\n`);
});
