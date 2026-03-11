export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ status: false, message: "Method not allowed, must be POST or PUT" });
  }

  const { talukaName, censusCode } = req.body || {};
  if (talukaName && (talukaName.length < 3 || !/^[a-zA-Z\s\-]+$/.test(talukaName))) {
    return res.status(400).json({ status: false, message: "Invalid Taluka Name validation failed on API layer" });
  }
  if (censusCode) {
    const cc = censusCode.toString();
    if (cc.length > 6 || !/^\d+$/.test(cc)) {
      return res.status(400).json({ status: false, message: "Invalid Census Code validation failed on API layer" });
    }
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/talukas/update`,
      {
        method: "POST", // The backend expects a POST method to update
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return res.status(response.status).json({ status: response.ok, message: `Failed to update taluka (status: ${response.status})` });
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy update error (taluka):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
