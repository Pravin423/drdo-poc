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
  let token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if ((!token || token === "undefined" || token === "null") && req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  // ─── ADD USER ──────────────────────────────────────────────────────────────
  if (action === "add-user") {
    try {
      const form = new IncomingForm({ keepExtensions: true });
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const fullname = Array.isArray(fields.fullname) ? fields.fullname[0] : fields.fullname;
      const mobile = Array.isArray(fields.mobile) ? fields.mobile[0] : fields.mobile;
      const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

      if (!fullname || fullname.trim().length === 0 || !/^[a-zA-Z\s\-]+$/.test(fullname)) {
        return res.status(400).json({ status: false, message: "Invalid Full Name validation failed on API layer" });
      }
      if (!mobile || !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ status: false, message: "Invalid Mobile Number validation failed on API layer" });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ status: false, message: "Invalid Password validation failed on API layer" });
      }

      const formData = new FormData();
      const textFields = ["fullname", "mobile", "password", "email", "gender", "role_id", "date_of_birth"];
      textFields.forEach((f) => {
        if (fields[f]) formData.append(f, Array.isArray(fields[f]) ? fields[f][0] : fields[f]);
      });

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

  // ─── UPDATE USER ───────────────────────────────────────────────────────────
  if (action === "update-user") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Employee ID is required" });

    try {
      const form = new IncomingForm({ keepExtensions: true });
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const formData = new FormData();
      
      // Text fields
      const textFields = ["fullname", "mobile", "email", "gender", "role_id", "district_id"];
      textFields.forEach((f) => {
        const val = Array.isArray(fields[f]) ? fields[f][0] : fields[f];
        if (val !== undefined && val !== null) formData.append(f, val);
      });

      // Handle taluka_ids (Array)
      const talukaSource = fields.taluka_ids || fields.taluka_id;
      if (talukaSource) {
        const ids = Array.isArray(talukaSource) ? talukaSource : [talukaSource];
        ids.forEach((tid, index) => {
          formData.append(`taluka_id[${index}]`, tid);
        });
      }

      // Profile image
      if (files.profile) {
        const file = Array.isArray(files.profile) ? files.profile[0] : files.profile;
        formData.append("profile", fs.createReadStream(file.filepath), {
          filename: file.originalFilename || "profile.jpg",
          contentType: file.mimetype || "image/jpeg",
        });
      }

      console.log(`[Server/API] 📝 Updating employee ${id}: POST`, `${API_BASE}/update-employee/${id}`);
      const apiRes = await fetch(`${API_BASE}/update-employee/${id}`, {
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
      console.error("[proxy/update-user] error:", err);
      return res.status(502).json({ message: "Could not reach the server. Please try again." });
    }
  }

  return res.status(400).json({ message: "Unknown action" });
}
