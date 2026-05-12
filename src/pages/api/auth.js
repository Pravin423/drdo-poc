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
      if (!mobile || !/^\d{10}$/.test(mobile.toString())) {
        return res.status(400).json({ status: false, message: "Valid 10-digit mobile number is required" });
      }
      if (!password || password.length < 8) {
        return res.status(400).json({ status: false, message: "Password must be at least 8 characters" });
      }
      
      const apiRes = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await apiRes.json();
      
      if (apiRes.ok && data.token) {
        // HttpOnly cookie: Secure only in production, Lax for cross-page navigation
        const isProd = process.env.NODE_ENV === "production";
        res.setHeader(
          "Set-Cookie",
          `auth_token=${data.token}; Path=/; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`
        );
      }

      // 404 = user not found in backend
      if (apiRes.status === 404) {
        return res.status(404).json({ status: false, message: "No account found with this mobile number." });
      }

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
      let token = (req.headers["authorization"] || "").replace("Bearer ", "");
      if (!token && req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
      }
      console.log("[Server/API] 🚪 Calling real API: POST", `${API_BASE}/logout`);
      const apiRes = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the auth_token cookie
      const isProd = process.env.NODE_ENV === "production";
      res.setHeader(
        "Set-Cookie",
        `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`
      );

      // Treat any response (even errors) as a successful local logout
      const data = await apiRes.json().catch(() => ({}));
      return res.status(200).json({ status: true, ...data });
    } catch (err) {
      console.error("[proxy/logout] error:", err);
      // Clear cookie even if proxy API fetch fails
      const isProd = process.env.NODE_ENV === "production";
      res.setHeader(
        "Set-Cookie",
        `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`
      );
      // Even if the API call fails, we still allow local logout
      return res.status(200).json({ status: true, message: "Logged out locally." });
    }
  }

  return res.status(400).json({ message: "Unknown action" });
}
