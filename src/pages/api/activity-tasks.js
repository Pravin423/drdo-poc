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
      method: req.method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.body && req.body.start_date && req.body.end_date) {
        if (new Date(req.body.end_date) < new Date(req.body.start_date)) {
          return res.status(400).json({ status: false, message: "End date cannot be earlier than start date." });
        }
      }
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch("https://goadrda.runtime-solutions.net/admin/api/activity-tasks", fetchOptions);

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Activity tasks proxy fetch error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
