const SESSION_KEY = "hs_session";
const API_BASE = "http://localhost:4000/api";

export function initSeed() {}

export function registerUser({ username, password, role }) {
  const raw = localStorage.getItem("hs_users");
  const users = raw ? JSON.parse(raw) : [];
  if (users.some((u) => u.username === username)) {
    throw new Error("该账号已存在");
  }
  users.push({ username, password, role });
  localStorage.setItem("hs_users", JSON.stringify(users));
}

export function login({ username, password }) {
  const raw = localStorage.getItem("hs_users");
  const users = raw ? JSON.parse(raw) : [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("账号或密码错误");
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, role: user.role }));
  return { username: user.username, role: user.role };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function listHotels() {
  const r = await fetch(`${API_BASE}/hotels`);
  if (!r.ok) throw new Error("获取酒店失败");
  return r.json();
}

export async function upsertHotel(hotel) {
  if (hotel.id) {
    const r = await fetch(`${API_BASE}/hotels/${hotel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotel),
    });
    if (!r.ok) throw new Error("更新失败");
    return r.json();
  } else {
    const r = await fetch(`${API_BASE}/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotel),
    });
    if (!r.ok) throw new Error("新增失败");
    return r.json();
  }
}

export async function setHotelAudit({ id, status, reason }) {
  const r = await fetch(`${API_BASE}/hotels/${id}/audit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reason }),
  });
  if (!r.ok) throw new Error("审核失败");
  return r.json();
}

export async function setHotelDeleted({ id, deleted }) {
  const r = await fetch(`${API_BASE}/hotels/${id}/online`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deleted }),
  });
  if (!r.ok) throw new Error("操作失败");
  return r.json();
}

export async function listSubscriptionsByMerchant(username) {
  const r = await fetch(`${API_BASE}/subscriptions?merchant=${encodeURIComponent(username)}`);
  if (!r.ok) throw new Error("获取订阅失败");
  return r.json();
}

export async function approveCancelSubscription({ id, reviewedBy }) {
  const r = await fetch(`${API_BASE}/subscriptions/${id}/approve-cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewedBy }),
  });
  if (!r.ok) throw new Error("操作失败");
  return r.json();
}
