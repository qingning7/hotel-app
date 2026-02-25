const API_BASE = "http://localhost:4000/api";

export async function getUserLocation() {
  try {
    const r = await fetch(`${API_BASE}/location`);
    if (!r.ok) throw new Error("定位失败");
    const d = await r.json();
    return d.city || "合肥";
  } catch (err) {
    console.warn("Location API failed, falling back to Hefei", err);
    return "合肥";
  }
}

export async function listAllHotels() {
  const r = await fetch(`${API_BASE}/hotels/visible`);
  if (!r.ok) throw new Error("获取酒店失败");
  return r.json();
}

export async function getHotelById(id) {
  const r = await fetch(`${API_BASE}/hotels/${id}`);
  if (!r.ok) return null;
  return r.json();
}

export async function createSubscription(data) {
  const r = await fetch(`${API_BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("订阅失败");
  return r.json();
}

export async function listSubscriptions(username) {
  const r = await fetch(`${API_BASE}/subscriptions?username=${username}`);
  if (!r.ok) throw new Error("获取订单失败");
  return r.json();
}

export async function updateSubscription(id, data) {
  const r = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("更新订单失败");
  return r.json();
}

export async function cancelSubscription(id, reason) {
  const r = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cancelRequestReason: reason || "User requested cancellation" }),
  });
  if (!r.ok) throw new Error("取消订单失败");
  return r.json();
}

export async function login(username, password) {
  const r = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (r.status === 401) throw new Error("账号或密码错误");
  if (!r.ok) throw new Error("登录失败");
  return r.json();
}

export async function register(username, password) {
  const r = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (r.status === 400) {
    const d = await r.json();
    if (d.error === "Username taken") throw new Error("账号已存在");
  }
  if (!r.ok) throw new Error("注册失败");
  return r.json();
}
