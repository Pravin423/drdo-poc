export default async function handler(req, res) {
  const { crp_id } = req.query;

  // Accept both GET and POST from the frontend
  const { month, year } =
    req.method === "POST" ? req.body : req.query;

  if (!crp_id) {
    return res.status(400).json({ status: false, message: "CRP ID is required" });
  }

  // Get auth token from cookie (same pattern as other proxies)
  const token =
    req.cookies?.auth_token ||
    (req.headers["authorization"]
      ? req.headers["authorization"].replace("Bearer ", "")
      : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found" });
  }

  try {
    // The backend API uses GET with query params
    const url = `https://goadrda.runtime-solutions.net/admin/api/honorarium/show/${crp_id}?month=${month}&year=${year}`;

    console.log("[honorarium/show] Calling:", url);

    const backendResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const text = await backendResponse.text();
    console.log("[honorarium/show] Raw response:", text.slice(0, 500));

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("[honorarium/show] JSON parse error:", parseErr.message, "| Raw:", text.slice(0, 300));
      return res.status(500).json({
        status: false,
        message: "Backend returned non-JSON response",
        raw: text.slice(0, 300),
      });
    }

    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("[honorarium/show] Proxy error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}
