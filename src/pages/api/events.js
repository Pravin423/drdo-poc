/**
 * Server-side proxy for the DRDA admin API (Events).
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  // ── Unified Auth Resolution ──
  // Always resolve token from cookie first, then Authorization header
  const cookieToken = req.cookies?.auth_token;
  const headerToken = req.headers["authorization"]?.replace("Bearer ", "").trim();
  const resolvedToken = cookieToken || headerToken;

  if (!resolvedToken || resolvedToken === "undefined") {
    return res.status(401).json({ status: false, message: "Unauthorized. Please log in." });
  }

  const authHeader = `Bearer ${resolvedToken}`;
  const { action, id } = req.query;

  // ── GET ──
  if (req.method === "GET") {
    try {
      // GET /api/events?action=show&id=2
      if (action === "show" && id) {
        console.log(`[Proxy] Showing event: ${id}`);
        const apiRes = await fetch(`${API_BASE}/events/show/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
          },
        });
        const data = await apiRes.json();
        
        if (data.status === 1 && data.data) {
          console.log(`[Proxy] Participants Check (CRP):`, JSON.stringify(data.data.crpParticipants?.slice(0, 2)));
          console.log(`[Proxy] Participants Check (SHG):`, JSON.stringify(data.data.shgParticipants?.slice(0, 2)));
        }
        
        return res.status(apiRes.status).json(data);
      }

      // GET /api/events?action=create-options
      if (action === "create-options") {
        const apiRes = await fetch(`${API_BASE}/events/create`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
          },
        });
        const data = await apiRes.json();
        return res.status(apiRes.status).json(data);
      }

      // Default: GET /api/events (List)
      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
      });
      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);

    } catch (err) {
      console.error("[proxy/events] GET error:", err);
      return res.status(502).json({ message: "Could not reach the server." });
    }
  }

  // ── POST ──
  if (req.method === "POST") {
    try {
      // POST /api/events?action=save-attendance&id=2
      if (action === "save-attendance" && id) {
        console.log(`[Proxy] Saving attendance for event: ${id}`);

        // Parse body safely
        let bodyData = req.body;
        if (typeof bodyData === "string") {
          try {
            bodyData = JSON.parse(bodyData);
          } catch (e) {
            console.error("[Proxy] JSON Parse Error", e);
            return res.status(400).json({ status: false, message: "Invalid JSON body." });
          }
        }

        console.log(`[Proxy] Attendance Body:`, JSON.stringify(bodyData));

        const { crp, shg } = bodyData || {};

        // Validate — must have at least one participant
        if (!crp && !shg) {
          return res.status(400).json({ status: false, message: "No attendance data provided." });
        }

        // Build FormData exactly as the API expects: attendance_crp[ID] and attendance_shg[ID]
        const fd = new FormData();

        if (crp && typeof crp === "object") {
          Object.entries(crp).forEach(([partId, data]) => {
            const status = typeof data === 'object' ? data.status : data;
            const keyId = (typeof data === 'object' && data.userId) ? data.userId : partId;
            fd.append(`attendance_crp[${keyId}]`, status);
            console.log(`[Proxy] CRP → attendance_crp[${keyId}] = ${status}`);
          });
        }

        if (shg && typeof shg === "object") {
          Object.entries(shg).forEach(([partId, data]) => {
            const status = typeof data === 'object' ? data.status : data;
            const keyId = (typeof data === 'object' && data.userId) ? data.userId : partId;
            fd.append(`attendance_shg[${keyId}]`, status);
            console.log(`[Proxy] SHG → attendance_shg[${keyId}] = ${status}`);
          });
        }

        const apiUrl = `${API_BASE}/events/attendance/${id}`;
        console.log(`[Proxy] POST → ${apiUrl}`);

        const apiRes = await fetch(apiUrl, {
          method: "POST",
          headers: {
            // ⚠️ Do NOT set Content-Type manually when using FormData
            // fetch sets it automatically with the correct multipart boundary
            "Authorization": authHeader
          },
          body: fd
        });

        const rawRes = await apiRes.text();
        console.log(`[Proxy] Backend Response (${apiRes.status}):`, rawRes);

        let data;
        try {
          data = JSON.parse(rawRes);
        } catch {
          data = { message: rawRes };
        }

        return res.status(apiRes.status).json(data);
      }

      // Default: Create event
      // POST /api/events
      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(req.body)
      });

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);

    } catch (err) {
      console.error("[proxy/events] POST error:", err);
      return res.status(502).json({ message: "Could not reach the server." });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}