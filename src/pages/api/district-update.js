// src/pages/api/district-update.js
export default async function handler(req, res) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method null allowed, must be POST!"});
  }

  try {
    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body)
    };

    const response = await fetch(`https://goadrda.runtime-solutions.net/admin/api/districts/update`, fetchOptions);
    const data = await response.json();
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
