/**
 * Server-side proxy for the DRDA admin API.
 * Avoids CORS issues by making requests server-to-server.
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.query; // e.g. /api/auth?action=login

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if (action === "login") {
    try {
      const { mobile, password } = req.body;
      console.log("[Server/API] 🔐 Calling real API: POST", `${API_BASE}/login`, "| mobile:", mobile);
      const apiRes = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/login] error:", err);
      return res
        .status(502)
        .json({ message: "Could not reach the authentication server." });
    }
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  if (action === "logout") {
    try {
      const token = (req.headers["authorization"] || "").replace("Bearer ", "");
      console.log("[Server/API] 🚪 Calling real API: POST", `${API_BASE}/logout`);
      const apiRes = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Treat any response (even errors) as a successful local logout
      const data = await apiRes.json().catch(() => ({}));
      return res.status(200).json({ status: true, ...data });
    } catch (err) {
      console.error("[proxy/logout] error:", err);
      // Even if the API call fails, we still allow local logout
      return res.status(200).json({ status: true, message: "Logged out locally." });
    }
  }

  return res.status(400).json({ message: "Unknown action" });
}
