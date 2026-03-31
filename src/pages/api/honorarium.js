export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  const { month, year } = req.query;

  // Get token primarily from cookies as requested, fallback to header
  const token = req.cookies?.auth_token || (req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  try {
    const backendResponse = await fetch(`https://goadrda.runtime-solutions.net/admin/api/honorarium?month=${month || 3}&year=${year || 2026}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await backendResponse.json();
    try {
      require("fs").writeFileSync("honorarium-log.json", JSON.stringify(data, null, 2));
    } catch(e) {}
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("Honorarium List proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
