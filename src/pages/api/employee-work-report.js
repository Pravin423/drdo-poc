export default async function handler(req, res) {
  let authHeader = req.headers["authorization"];

  // Fallback: get token from cookies
  if (
    (!authHeader ||
      authHeader.includes("undefined") ||
      authHeader.includes("null")) &&
    req.cookies?.auth_token
  ) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: false, message: "No authorization header" });
  }

  const { user_id, month, year } = req.query;

  if (!user_id || !month || !year) {
    return res
      .status(400)
      .json({ status: false, message: "user_id, month, and year are required" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/employee-work-report?user_id=${user_id}&month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Employee work report proxy error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}
