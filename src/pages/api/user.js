/**
 * Server-side proxy for user management API actions.
 * Uses Node 18+ native FormData + Blob (same pattern as add-crp.js).
 * The npm `form-data` package does NOT work with native fetch — use globals only.
 */

import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // formidable handles parsing
  },
};

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

// Helper: formidable v3 wraps values in arrays
const get = (fields, key) =>
  (Array.isArray(fields[key]) ? fields[key][0] : fields[key]) ?? "";

// Helper: read formidable temp file → Blob → append to native FormData
const MIME_MAP = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };
const appendFile = (fd, fdKey, files, fileKey) => {
  const f = Array.isArray(files[fileKey]) ? files[fileKey][0] : files[fileKey];
  if (f?.filepath) {
    const ext      = (f.originalFilename || "").split(".").pop().toLowerCase();
    const mimeType = (f.mimetype && f.mimetype !== "application/octet-stream")
      ? f.mimetype
      : (MIME_MAP[ext] || "image/jpeg");
    const buf  = fs.readFileSync(f.filepath);
    const blob = new Blob([buf], { type: mimeType });
    fd.append(fdKey, blob, f.originalFilename ?? f.newFilename ?? fdKey);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action, id } = req.query;

  // ── Auth: prefer cookie, fall back to Authorization header ──
  let authHeader = req.headers["authorization"];
  if (
    (!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) &&
    req.cookies?.auth_token
  ) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  if (!authHeader) {
    return res.status(401).json({ status: false, message: "Unauthorized: no auth token" });
  }

  // ── Parse multipart with formidable (promise-wrapped) ──
  const form = new IncomingForm({ keepExtensions: true, multiples: true });
  let fields, files;
  try {
    ({ fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err); else resolve({ fields, files });
      });
    }));
  } catch (err) {
    return res.status(500).json({ status: false, message: "Failed to parse form data" });
  }

  try {
    // ─── ADD USER ─────────────────────────────────────────────────────────────
    if (action === "add-user") {
      const fullname = get(fields, "fullname");
      const mobile   = get(fields, "mobile");
      const password = get(fields, "password");
      const email    = get(fields, "email");
      const gender   = get(fields, "gender");
      const roleId   = get(fields, "role_id");
      const dob      = get(fields, "dob");

      // Server-side strict validation
      if (!fullname || !/^[a-zA-Z\s\-]+$/.test(fullname.trim())) {
        return res.status(400).json({ status: false, message: "Invalid Full Name: only letters, spaces, hyphens allowed" });
      }
      if (!mobile || !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ status: false, message: "Invalid Mobile Number: must be exactly 10 digits" });
      }
      if (!password || password.length < 8) {
        return res.status(400).json({ status: false, message: "Invalid Password: minimum 8 characters required" });
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: false, message: "Invalid Email Address" });
      }
      if (!gender) return res.status(400).json({ status: false, message: "Gender is required" });
      if (!roleId) return res.status(400).json({ status: false, message: "Role is required" });
      if (!dob)    return res.status(400).json({ status: false, message: "Date of Birth is required" });
      if (!files.profile) return res.status(400).json({ status: false, message: "Profile photo is required" });

      // Build outgoing FormData using Node 18+ native global
      const fd = new FormData();
      fd.append("fullname", fullname);
      fd.append("mobile",   mobile);
      fd.append("password", password);
      fd.append("email",    email);
      fd.append("gender",   gender);
      fd.append("role_id",  roleId);
      fd.append("dob",      dob);

      const districtId = get(fields, "district_id");
      if (districtId) fd.append("district_id", districtId);

      // Taluka IDs (taluka_id[0], taluka_id[1], ...)
      Object.keys(fields)
        .filter(k => k.startsWith("taluka_id"))
        .forEach(k => {
          const val = Array.isArray(fields[k]) ? fields[k][0] : fields[k];
          fd.append(k, val);
        });

      // Profile image as Blob
      appendFile(fd, "profile", files, "profile");

      const apiRes = await fetch(`${API_BASE}/add-employee`, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: fd,
      });

      const rawText = await apiRes.text();
      let data;
      try { data = JSON.parse(rawText); } catch { data = { message: rawText }; }
      return res.status(apiRes.status).json(data);
    }

    // ─── UPDATE USER ──────────────────────────────────────────────────────────
    if (action === "update-user") {
      if (!id) return res.status(400).json({ message: "Employee ID is required" });

      const fullname = get(fields, "fullname");
      const mobile   = get(fields, "mobile");
      const email    = get(fields, "email");

      if (fullname && !/^[a-zA-Z\s\-]+$/.test(fullname.trim())) {
        return res.status(400).json({ status: false, message: "Invalid Full Name: only letters, spaces, hyphens allowed" });
      }
      if (mobile && !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ status: false, message: "Invalid Mobile Number: must be exactly 10 digits" });
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: false, message: "Invalid Email Address" });
      }

      const fd = new FormData();
      ["fullname", "mobile", "email", "gender", "role_id", "district_id"].forEach(f => {
        const val = get(fields, f);
        if (val) fd.append(f, val);
      });

      // Taluka IDs
      const talukaSource = fields.taluka_ids || fields.taluka_id;
      if (talukaSource) {
        const ids = Array.isArray(talukaSource) ? talukaSource : [talukaSource];
        ids.forEach((tid, index) => fd.append(`taluka_id[${index}]`, tid));
      } else {
        Object.keys(fields)
          .filter(k => k.startsWith("taluka_id"))
          .forEach(k => {
            const val = Array.isArray(fields[k]) ? fields[k][0] : fields[k];
            fd.append(k, val);
          });
      }

      // Profile image as Blob (optional for update)
      appendFile(fd, "profile", files, "profile");

      const apiRes = await fetch(`${API_BASE}/update-employee/${id}`, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: fd,
      });

      const rawText = await apiRes.text();
      let data;
      try { data = JSON.parse(rawText); } catch { data = { message: rawText }; }
      return res.status(apiRes.status).json(data);
    }

    return res.status(400).json({ message: "Unknown action" });

  } catch (err) {
    console.error("[user.js] ❌ CRASH:", err.message);
    return res.status(502).json({ status: false, message: "Proxy error: " + err.message });
  }
}
