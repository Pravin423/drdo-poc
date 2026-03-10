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
    return res.status(400).json({ status: false, message: "Taluka ID is required" });
  }

  // Basic validation that ID is a string of digits possibly
  // If the API supports string IDs or just numeric, we can be safe
  if (!/^[a-zA-Z0-9_-]+$/.test(id.toString())) {
    return res.status(400).json({ status: false, message: "Invalid Taluka ID format" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/talukas/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return res.status(response.status).json({ status: response.ok, message: `Failed to delete taluka (status: ${response.status})` });
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy delete error (taluka):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
