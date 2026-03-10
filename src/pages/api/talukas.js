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

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.method === "POST" || req.method === "PUT") {
        const { name, censusCode } = req.body || {};
        if (name && (name.length < 3 || !/^[a-zA-Z\s\-]+$/.test(name))) {
          return res.status(400).json({ status: false, message: "Invalid Taluka Name validation failed on API layer" });
        }
        if (censusCode) {
          const cc = censusCode.toString();
          if (cc.length > 5 || !/^\d+$/.test(cc)) {
            return res.status(400).json({ status: false, message: "Invalid Census Code validation failed on API layer" });
          }
        }
      }
      fetchOptions.body = JSON.stringify(req.body);
    }

    const queryString = new URLSearchParams(req.query).toString();
    const url = `https://goadrda.runtime-solutions.net/admin/api/talukas${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error (talukas):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
