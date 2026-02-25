const SESSION_KEY = "hs_session";
const API_BASE = "http://localhost:4000/api";

export function initSeed() {}

export async function registerUser({ username, password, role }) {
  const r = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || "注册失败");
  }
  return r.json();
}

export async function login({ username, password }) {
  const r = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || "账号或密码错误");
  }
  const user = await r.json();
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
