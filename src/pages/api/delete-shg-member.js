export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ status: false, message: "Member ID is required" });
  }

  // Read auth token from cookie first, fallback to Authorization header
  const token =
    req.cookies?.auth_token ||
    (req.headers["authorization"]
      ? req.headers["authorization"].replace("Bearer ", "")
      : null);

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: false, message: "No API token found in cookies or headers" });
  }

  try {
    const backendResponse = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/shg/member/delete/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await backendResponse.json();
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("Delete SHG Member proxy error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
