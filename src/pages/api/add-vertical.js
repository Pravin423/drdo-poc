export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  try {
    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    };

    const response = await fetch("https://goadrda.runtime-solutions.net/admin/api/vertical", fetchOptions);
    const data = await response.json();

    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(process.cwd(), 'add-vertical-log.json'), JSON.stringify({
      requestBody: req.body,
      responseStatus: response.status,
      responseData: data
    }, null, 2));

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
