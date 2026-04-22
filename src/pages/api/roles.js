export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";
  
  let token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if ((!token || token === "undefined" || token === "null") && req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  try {
    const apiRes = await fetch(`${API_BASE}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("[proxy/roles] error:", err);
    return res.status(502).json({ message: "Could not reach the server. Please try again." });
  }
}
