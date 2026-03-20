export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method Not Allowed" });
  }

  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  try {
    const backendResponse = await fetch("https://goadrda.runtime-solutions.net/admin/api/add-shg", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.json();
    return res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error("Add SHG proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
