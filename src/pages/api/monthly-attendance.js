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

  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ status: false, message: "Month and Year are required" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/attendance-month-report?month=${month}&year=${year}`,
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
    console.error("Attendance proxy error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}