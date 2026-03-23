export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  // Get token from cookies, fallback to header
  const token = req.cookies?.auth_token || (req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  const { mapping_id, crpuser, shggroup, status } = req.body;
  try {
    require("fs").writeFileSync("edit-req-log.json", JSON.stringify(req.body, null, 2));
  } catch(e) {}


  if (!mapping_id) {
    return res.status(400).json({ status: false, message: "mapping_id is required" });
  }

  try {
    const backendResponse = await fetch(`https://goadrda.runtime-solutions.net/admin/api/crp-shg-mapping/update/${mapping_id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ crpuser, shggroup, status }),
    });

    const data = await backendResponse.json();
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("Edit CRP-SHG Mapping proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
