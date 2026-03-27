// src/pages/api/update-holiday.js
export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ status: false, message: "Method not allowed, must be PUT!" });
  }

  const { holiday_name, start_date, end_date, status, id } = req.body || {};

  if (!id) {
    return res.status(400).json({ status: false, message: "Holiday ID is required." });
  }

  if (!holiday_name || holiday_name.trim().length < 2) {
    return res.status(400).json({ status: false, message: "Invalid holiday name." });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({ status: false, message: "Start date and end date are required." });
  }

  if (end_date < start_date) {
    return res.status(400).json({ status: false, message: "End date cannot be before start date." });
  }

  const targetUrl = `https://goadrda.runtime-solutions.net/admin/api/holidays/${id}`;
  console.log("[update-holiday] PUT →", targetUrl);
  console.log("[update-holiday] Body →", { holiday_name, start_date, end_date, status });

  try {
    const response = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ holiday_name, start_date, end_date, status }),
    });

    const contentType = response.headers.get("content-type") || "";
    console.log("[update-holiday] Response status:", response.status, "| Content-Type:", contentType);

    // Guard: upstream returned HTML — wrong URL or auth redirect
    if (!contentType.includes("application/json")) {
      const rawText = await response.text();
      console.error("[update-holiday] Non-JSON body (first 300 chars):", rawText.slice(0, 300));
      return res.status(502).json({
        status: false,
        message: `Upstream returned non-JSON (HTTP ${response.status}). Check the API URL or authentication.`,
      });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[update-holiday] Proxy fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}