// src/pages/api/delete-holiday.js
export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ status: false, message: "Method not allowed, must be DELETE!" });
  }

  const { id } = req.body || {};

  if (!id) {
    return res.status(400).json({ status: false, message: "Holiday ID is required." });
  }

  const targetUrl = `https://goadrda.runtime-solutions.net/admin/api/holidays/${id}`;
  console.log("[delete-holiday] DELETE →", targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    console.log("[delete-holiday] Response status:", response.status, "| Content-Type:", contentType);

    if (!contentType.includes("application/json")) {
      const rawText = await response.text();
      console.error("[delete-holiday] Non-JSON body (first 300 chars):", rawText.slice(0, 300));
      return res.status(502).json({
        status: false,
        message: `Upstream returned non-JSON (HTTP ${response.status}). Check the API URL or authentication.`,
      });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[delete-holiday] Proxy fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}