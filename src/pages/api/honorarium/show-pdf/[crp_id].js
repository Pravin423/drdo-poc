export default async function handler(req, res) {
  const { crp_id, month, year } = req.query;

  if (!crp_id || !month || !year) {
    return res.status(400).json({ status: false, message: "CRP ID, month, and year are required" });
  }

  const token =
    req.cookies?.auth_token ||
    (req.headers["authorization"]
      ? req.headers["authorization"].replace("Bearer ", "")
      : null);

  if (!token || token === "undefined") {
    return res.status(401).json({ status: false, message: "No API token found" });
  }

  try {
    const url = `https://goadrda.runtime-solutions.net/admin/api/honorarium/show-pdf/${crp_id}?month=${month}&year=${year}`;
    console.log("[honorarium/show-pdf] Proxying to:", url);

    const backendRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      const errTxt = await backendRes.text();
      console.error("[honorarium/show-pdf] Backend error:", errTxt);
      return res.status(backendRes.status).send(errTxt);
    }

    // Proxy the PDF stream
    const contentType = backendRes.headers.get("content-type") || "application/pdf";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=Honorarium_Report_${crp_id}_${month}_${year}.pdf`);

    const nodeBuffer = Buffer.from(await backendRes.arrayBuffer());
    return res.send(nodeBuffer);
  } catch (error) {
    console.error("[honorarium/show-pdf] Proxy error:", error);
    return res.status(500).json({ status: false, message: "Proxy failed to fetch PDF" });
  }
}
