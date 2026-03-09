// src/pages/api/districts.js
// Server-side proxy — avoids CORS when the browser fetches the external API.

export default async function handler(req, res) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    // If it's a POST/PUT, pass along the payload body 
    if (req.method !== "GET" && req.method !== "HEAD") {
        fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch("https://goadrda.runtime-solutions.net/admin/api/districts", fetchOptions);

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
