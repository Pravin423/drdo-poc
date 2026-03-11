export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  const { id } = req.query;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ status: false, message: "Method not allowed, must be GET" });
  }

  if (!id) {
    return res.status(400).json({ status: false, message: "Taluka ID is required" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/talukas/details/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return res.status(response.status).json({ status: response.ok, message: `Failed to fetch taluka details (status: ${response.status})` });
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error (taluka details):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
