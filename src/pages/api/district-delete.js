// src/pages/api/district-delete.js
export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  const { id } = req.query;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ status: false, message: "Method not allowed, must be DELETE" });
  }

  if (!id) {
    return res.status(400).json({ status: false, message: "District ID is required" });
  }

  // Basic validation that ID is a string of digits/alphanumerics
  if (!/^[a-zA-Z0-9_-]+$/.test(id.toString())) {
    return res.status(400).json({ status: false, message: "Invalid District ID format" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/districts/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    // The DRDA API might return 204 No Content for a successful deletion
    if (response.status === 204 || response.status === 200 || response.status === 201) {
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        // Ignore parse errors if response is not JSON
      }
      return res.status(200).json({ status: 1, message: 'Deleted successfully', ...data });
    }

    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore parse errors if response is not JSON
    }

    return res.status(response.status).json({
      status: 0,
      message: errorData.message || errorData.error || `Failed to delete district (HTTP ${response.status})`,
      details: errorData
    });

  } catch (error) {
    console.error("Proxy delete error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
