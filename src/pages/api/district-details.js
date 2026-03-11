// src/pages/api/district-details.js
export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.authToken) {
    authHeader = `Bearer ${req.cookies.authToken}`;
  }
  const { id } = req.query;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (!id) {
    return res.status(400).json({ status: false, message: "District ID is required" });
  }

  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`https://goadrda.runtime-solutions.net/admin/api/districts/details/${id}`, fetchOptions);
    const data = await response.json();
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
