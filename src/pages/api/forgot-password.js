/**
 * Server-side proxy for the forgot-password / OTP / reset-password flow.
 * Avoids CORS issues by making requests server-to-server.
 *
 * Routes (action query param):
 *   POST /api/forgot-password?action=send-otp    → sends OTP to registered email
 *   POST /api/forgot-password?action=verify-otp  → verifies OTP; stores reset_token in cookie
 *   POST /api/forgot-password?action=reset        → resets password (reads reset_token from cookie)
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.query;

  // ─── STEP 1: SEND OTP ─────────────────────────────────────────────────────
  if (action === "send-otp") {
    try {
      const { mobile } = req.body;

      if (!mobile || !/^\d{10}$/.test(mobile.toString())) {
        return res
          .status(400)
          .json({ status: 0, message: "Valid 10-digit mobile number is required." });
      }

      console.log("[proxy/forgot-password] Sending OTP for mobile:", mobile);

      const apiRes = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await apiRes.json();
      return res.status(apiRes.ok ? 200 : apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/forgot-password/send-otp] error:", err);
      return res
        .status(502)
        .json({ status: 0, message: "Could not reach the server. Please try again." });
    }
  }

  // ─── STEP 2: VERIFY OTP ───────────────────────────────────────────────────
  if (action === "verify-otp") {
    try {
      const { mobile, otp } = req.body;

      if (!mobile || !otp) {
        return res
          .status(400)
          .json({ status: 0, message: "Mobile and OTP are required." });
      }

      console.log("[proxy/forgot-password] Verifying OTP for mobile:", mobile);

      const apiRes = await fetch(`${API_BASE}/otp-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: Number(otp) }),
      });

      const data = await apiRes.json();

      // Store the reset token from OTP verify response as a short-lived HttpOnly cookie
      if (apiRes.ok && data.token) {
        const isProd = process.env.NODE_ENV === "production";
        res.setHeader(
          "Set-Cookie",
          `reset_token=${data.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${isProd ? "; Secure" : ""}`
          // Max-Age=600 → expires in 10 minutes, enough time to submit new password
        );
      }

      return res.status(apiRes.ok ? 200 : apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/forgot-password/verify-otp] error:", err);
      return res
        .status(502)
        .json({ status: 0, message: "Could not reach the server. Please try again." });
    }
  }

  // ─── STEP 3: RESET PASSWORD ───────────────────────────────────────────────
  if (action === "reset") {
    try {
      const { mobile, password, password_confirmation } = req.body;

      if (!password || password.length < 8) {
        return res
          .status(400)
          .json({ status: 0, message: "Password must be at least 8 characters." });
      }

      // Read reset_token stored in cookie during OTP verification step
      const token = req.cookies?.reset_token;

      if (!token) {
        return res
          .status(401)
          .json({ status: 0, message: "Session expired. Please restart the process." });
      }

      console.log("[proxy/forgot-password] Resetting password with reset_token from cookie");

      // API expects: mobile + token (in body) + password + password_confirmation
      const apiRes = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, token, password, password_confirmation }),
      });

      const data = await apiRes.json();

      // Clear the reset_token cookie after use
      if (apiRes.ok) {
        const isProd = process.env.NODE_ENV === "production";
        res.setHeader(
          "Set-Cookie",
          `reset_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`
        );
      }

      return res.status(apiRes.ok ? 200 : apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/forgot-password/reset] error:", err);
      return res
        .status(502)
        .json({ status: 0, message: "Could not reach the server. Please try again." });
    }
  }

  return res.status(400).json({ message: "Unknown action. Use send-otp, verify-otp, or reset." });
}
