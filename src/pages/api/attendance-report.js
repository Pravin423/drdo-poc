export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];

  // Try to find token in cookies (check multiple common names)
  const token = req.cookies?.auth_token || req.cookies?.authToken || req.cookies?.token;

  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && token) {
    authHeader = `Bearer ${token}`;
  }

  if (!authHeader) {
    console.error("[attendance-report] No authorization token found in headers or cookies");
    return res.status(401).json({ status: false, message: "No authorization header or cookie found" });
  }

  const { date, search, district, taluka } = req.query;

  try {
    let url = "https://goadrda.runtime-solutions.net/admin/api/attendance-report";
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (search) params.append("search", search);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(`[attendance-report] Proxy received from backend (status ${response.status}):`, JSON.stringify(data).slice(0, 100) + "...");
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[attendance-report] Proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
