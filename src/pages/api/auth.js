/**
 * Server-side proxy for the DRDA admin login API.
 * Avoids CORS issues by making the request server-to-server.
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.query; // e.g. /api/auth?action=login

  if (action === "login") {
    try {
      const { mobile, password } = req.body;

      const apiRes = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await apiRes.json();

      // Forward the exact status code and body from the upstream API
      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/login] error:", err);
      return res
        .status(502)
        .json({ message: "Could not reach the authentication server." });
    }
  }

  return res.status(400).json({ message: "Unknown action" });
}
