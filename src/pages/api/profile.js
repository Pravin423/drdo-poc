/**
 * Server-side proxy for the DRDA profile API.
 * GET /api/profile — forwards Authorization header server-to-server to avoid CORS.
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = (req.headers["authorization"] || "").replace("Bearer ", "");
    console.log("[Server/API] 👤 Calling real API: GET", `${API_BASE}/profile`);
    const apiRes = await fetch(`${API_BASE}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("[proxy/profile] error:", err);
    return res.status(502).json({ message: "Could not reach the profile server." });
  }
}
