// src/pages/api/district-delete.js
export default async function handler(req, res) {
  const authHeader = req.headers["authorization"];
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

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy delete error:", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
