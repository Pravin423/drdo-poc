export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  // Get token primarily from cookies as requested, fallback to header
  const token = req.cookies?.auth_token || (req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  try {
    const response = await fetch("https://goadrda.runtime-solutions.net/admin/api/available-village", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Debug logging
    try {
      require("fs").writeFileSync("available-village-log.json", JSON.stringify({ body: req.body, response: data }, null, 2));
    } catch(e) {}

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Available Village proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
