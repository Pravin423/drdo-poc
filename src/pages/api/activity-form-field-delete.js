export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ status: false, message: "Field ID is required" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  try {
    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    };

    const url = `https://goadrda.runtime-solutions.net/admin/api/activity-forms/fields/${id}`;

    const response = await fetch(url, fetchOptions);

    if (response.status === 204) {
       return res.status(204).end();
    }

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy fetch error (activity-form-field-delete):", error);
    return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
  }
}
