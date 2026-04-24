import formidable from "formidable";
import fs from "fs";

/**
 * Server-side proxy for the DRDA admin API (Events).
 */

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

// Disable Next.js body parsing to handle multipart/form-data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ── Unified Auth Resolution ──
  const cookieToken = req.cookies?.auth_token;
  const headerToken = req.headers["authorization"]?.replace("Bearer ", "").trim();
  const resolvedToken = cookieToken || headerToken;

  if (!resolvedToken || resolvedToken === "undefined") {
    return res.status(401).json({ status: false, message: "Unauthorized. Please log in." });
  }

  const authHeader = `Bearer ${resolvedToken}`;
  const { action, id } = req.query;

  // ── GET ── (No body needed)
  if (req.method === "GET") {
    try {
      if (action === "show" && id) {
        const apiRes = await fetch(`${API_BASE}/events/show/${id}`, {
          method: "GET",
          headers: { "Authorization": authHeader },
        });
        const data = await apiRes.json();
        console.log(`[Proxy] Event Data Details (Full):`, JSON.stringify(data));
        return res.status(apiRes.status).json(data);
      }

      if (action === "create-options") {
        const apiRes = await fetch(`${API_BASE}/events/create`, {
          method: "GET",
          headers: { "Authorization": authHeader },
        });
        const data = await apiRes.json();
        return res.status(apiRes.status).json(data);
      }

      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "GET",
        headers: { "Authorization": authHeader },
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
      // 1. Handle File Uploads (Multipart)
      if (action === "upload-photos" && id) {
        console.log(`[Proxy] Uploading photos for event: ${id}`);
        const form = formidable({ multiples: true });
        
        return new Promise((resolve, reject) => {
          form.parse(req, async (err, fields, files) => {
            if (err) {
              res.status(500).json({ status: false, message: "File parse error" });
              return resolve();
            }

            const fd = new FormData();
            
            // Handle multiple files under 'photos[]'
            const photos = files["photos[]"];
            if (photos) {
              const photoArray = Array.isArray(photos) ? photos : [photos];
              for (const photo of photoArray) {
                const blob = new Blob([fs.readFileSync(photo.filepath)], { type: photo.mimetype });
                fd.append("photos[]", blob, photo.originalFilename);
              }
            }

            try {
              const apiRes = await fetch(`${API_BASE}/events/upload-photos/${id}`, {
                method: "POST",
                headers: { "Authorization": authHeader },
                body: fd
              });
              const data = await apiRes.json();
              res.status(apiRes.status).json(data);
              resolve();
            } catch (err) {
              console.error("[Proxy] Upload Fetch Error:", err);
              res.status(502).json({ message: "Backend unreachable" });
              resolve();
            }
          });
        });
      }

      // 2. Handle JSON actions (Attendance, Create)
      // Manually parse the body since bodyParser is disabled
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const rawBody = Buffer.concat(chunks).toString();
      const bodyData = rawBody ? JSON.parse(rawBody) : {};

      if (action === "save-attendance" && id) {
        console.log(`[Proxy] Saving attendance for event: ${id}`);
        const { crp, shg } = bodyData || {};
        const fd = new FormData();

        if (crp && typeof crp === "object") {
          Object.entries(crp).forEach(([partId, data]) => {
            const status = typeof data === 'object' ? data.status : data;
            const keyId = (typeof data === 'object' && data.userId) ? data.userId : partId;
            fd.append(`attendance_crp[${keyId}]`, status);
          });
        }

        if (shg && typeof shg === "object") {
          Object.entries(shg).forEach(([partId, data]) => {
            const status = typeof data === 'object' ? data.status : data;
            const keyId = (typeof data === 'object' && data.userId) ? data.userId : partId;
            fd.append(`attendance_shg[${keyId}]`, status);
          });
        }

        const apiRes = await fetch(`${API_BASE}/events/attendance/${id}`, {
          method: "POST",
          headers: { "Authorization": authHeader },
          body: fd
        });
        const data = await apiRes.json();
        return res.status(apiRes.status).json(data);
      }

      // Default: Create event
      const apiRes = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(bodyData)
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