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

  const { month, year, type = 'excel' } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ status: false, message: "Month and Year are required" });
  }

  try {
    const response = await fetch(
      `https://goadrda.runtime-solutions.net/admin/api/attendance-month-export?month=${month}&year=${year}&type=${type}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json(errorData || { status: false, message: "Export failed" });
    }

    if (req.query.format === 'raw') {
        const text = await response.text();
        return res.status(200).send(text);
    }

    // Get the content type from the backend response
    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    // Set the headers for file download
    res.setHeader("Content-Type", contentType || "application/vnd.ms-excel");
    res.setHeader("Content-Disposition", `attachment; filename=attendance_report_${month}_${year}.${type === 'excel' ? 'xls' : 'csv'}`);
    
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Attendance export proxy error:", error);
    return res.status(500).json({
      status: false,
      message: "Proxy request failed",
      error: error.message,
    });
  }
}
