export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  const token = req.cookies?.auth_token || (req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  const { mapping_id, crp_user_id, vertical_id, status } = req.body;

  if (!mapping_id) {
    return res.status(400).json({ status: false, message: "mapping_id is required" });
  }

  // Strip mapping_id from the body — the ID is already in the URL path.
  const updatePayload = {
    crpuser: crp_user_id,
    crp_user_id: crp_user_id,
    vertical_id: vertical_id,
    status: status,
  };

  try {
    const backendUrl = `https://goadrda.runtime-solutions.net/admin/api/vertical-mapping/update/${mapping_id}`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const data = await backendResponse.json();
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("CRP Vertical Mapping Edit proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
