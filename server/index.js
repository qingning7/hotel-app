const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");

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
    price: body.price ?? db.hotels[idx].price
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
