/**
 * Server-side proxy for user management API actions.
 * Handles multipart/form-data for file uploads (profile photo).
 */

import { IncomingForm } from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Required for file upload — formidable handles it
  },
};

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.query;
  const token = (req.headers["authorization"] || "").replace("Bearer ", "");

  // ─── ADD USER ──────────────────────────────────────────────────────────────
  if (action === "add-user") {
    try {
      // Parse incoming multipart form (supports file + text fields)
      const form = new IncomingForm({ keepExtensions: true });

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      // Build FormData to forward to the real API
      const formData = new FormData();

      // Text fields
      const textFields = ["fullname", "mobile", "password", "email", "gender", "role_id", "date_of_birth"];
      textFields.forEach((f) => {
        if (fields[f]) formData.append(f, Array.isArray(fields[f]) ? fields[f][0] : fields[f]);
      });

      // Profile image (if provided)
      if (files.profile) {
        const file = Array.isArray(files.profile) ? files.profile[0] : files.profile;
        formData.append("profile", fs.createReadStream(file.filepath), {
          filename: file.originalFilename || "profile.jpg",
          contentType: file.mimetype || "image/jpeg",
        });
      }

      console.log("[Server/API] 👥 Calling real API: POST", `${API_BASE}/user/store`);
      const apiRes = await fetch(`${API_BASE}/user/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      const data = await apiRes.json().catch(() => ({}));
      return res.status(apiRes.status).json(data);
    } catch (err) {
      console.error("[proxy/add-user] error:", err);
      return res.status(502).json({ message: "Could not reach the server. Please try again." });
    }
  }

  return res.status(400).json({ message: "Unknown action" });
}
