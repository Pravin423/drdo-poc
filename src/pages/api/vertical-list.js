import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("https://goadrda.runtime-solutions.net/admin/api/vertical", fetchOptions);
    const data = await response.json();

    // Log the response payload structurally so we can inspect it and correctly map our frontend list
    if (process.env.NODE_ENV !== "production") {
      try {
        fs.writeFileSync(path.join(process.cwd(), "vertical-list-log.json"), JSON.stringify(data, null, 2));
      } catch (logErr) {
        console.error("Could not write vertical log: ", logErr);
      }
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
