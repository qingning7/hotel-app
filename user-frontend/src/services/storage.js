const API_BASE = "http://localhost:4000/api";

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

export async function createSubscription({ hotelId, username }) {
  const r = await fetch(`${API_BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hotelId, username }),
  });
  if (!r.ok) throw new Error("订阅失败");
  return r.json();
}
