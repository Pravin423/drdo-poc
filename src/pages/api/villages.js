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
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const { villageName, censusCode } = req.body || {};
      if (villageName && (villageName.length < 3 || !/^[a-zA-Z\s\-]+$/.test(villageName))) {
        return res.status(400).json({ status: false, message: "Invalid Village Name validation failed on API layer" });
      }
      if (censusCode) {
        const cc = censusCode.toString();
        if (cc.length > 6 || !/^\d+$/.test(cc)) {
          return res.status(400).json({ status: false, message: "Invalid Census Code validation failed on API layer" });
        }
      }
      fetchOptions.body = JSON.stringify(req.body);
    }

    const queryString = new URLSearchParams(req.query).toString();
    const url = `https://goadrda.runtime-solutions.net/admin/api/villages${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error (villages):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
