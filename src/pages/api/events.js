/**
 * Server-side proxy for the DRDA admin API (Events).
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ status: false, message: "Unauthorized. Please log in." });
  }

  const { action } = req.query;

  // GET /api/events (Lists events)
  if (req.method === "GET") {
    try {
      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/events] GET error:", err);
      return res.status(502).json({ message: "Could not reach the server." });
    }
  }

  // POST /api/events (Create event)
  if (req.method === "POST" && action === "create") {
     try {
      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(req.body)
      });

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/events] POST error:", err);
      return res.status(502).json({ message: "Could not reach the server." });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
