export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  // Get token primarily from cookies as requested, fallback to header
  const token = req.cookies?.auth_token || (req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (req.method === "POST") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const backendResponse = await fetch("https://goadrda.runtime-solutions.net/admin/api/crp-village-mapping", fetchOptions);

    const data = await backendResponse.json();
    
    // Debug logging
    try {
      if (req.method === "GET") {
        require("fs").writeFileSync("crp-village-mapping-log.json", JSON.stringify(data, null, 2));
      } else {
        require("fs").writeFileSync("crp-village-mapping-post-log.json", JSON.stringify({ body: req.body, response: data }, null, 2));
      }
    } catch(e) {}
    
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error(`CRP Village Mapping proxy (${req.method}) error:`, error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
