export default async function handler(req, res) {
  const { id, status } = req.query;

  if (!id) {
    return res.status(400).json({ status: false, message: "ID is required" });
  }

  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/shg-status-change/${id}?status=${status}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader || "",
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { status: false, message: "Invalid JSON response from server", raw: text };
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("SHG Status Change Proxy Error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
