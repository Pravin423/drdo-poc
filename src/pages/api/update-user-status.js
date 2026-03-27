export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  // auth — prefer cookie, fall back to Authorization header
  let authHeader = req.headers["authorization"];
  if (
    (!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) &&
    req.cookies?.auth_token
  ) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  try {
    const { id, status } = req.body;

    if (!id) {
      return res.status(400).json({ status: false, message: "ID is required" });
    }

    const response = await fetch(
      "https://goadrda.runtime-solutions.net/admin/api/update-user-status",
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[update-user-status] Proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
