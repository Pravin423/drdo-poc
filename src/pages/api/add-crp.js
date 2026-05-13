// src/pages/api/add-crp.js
// Proxy — parses the browser's multipart form with formidable,
// then re-sends it using Node's native FormData + fetch (Node 18+).

import { IncomingForm } from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  // ── Auth ────────────────────────────────────────────────────────────────
  let authHeader = req.headers["authorization"];
  if (
    (!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) &&
    req.cookies?.auth_token
  ) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No authorization header" });
  }

  // Return a Promise so Next.js knows to wait for the asynchronous formidable parser
  return new Promise((resolve) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("[add-crp] formidable parse error:", err);
        res.status(500).json({ status: false, message: "Failed to parse form data" });
        return resolve();
      }

      try {
        const get = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) ?? "";

        const fd = new FormData();
        fd.append("fullname",       get("fullname"));
        fd.append("aadharnumber",   get("aadharnumber"));
        fd.append("mobile",         get("mobile"));
        fd.append("email",          get("email"));
        fd.append("gender",         get("gender"));
        fd.append("dob",            get("dob"));
        fd.append("pan_number",     get("pan_number"));
        fd.append("bank_name",      get("bank_name"));
        fd.append("branch_name",    get("branch_name"));
        fd.append("account_number", get("account_number"));
        fd.append("ifsc",           get("ifsc"));

        const appendFile = (fdKey, fileKey) => {
          const f = Array.isArray(files[fileKey]) ? files[fileKey][0] : files[fileKey];
          if (f?.filepath) {
            const buf  = fs.readFileSync(f.filepath);
            const blob = new Blob([buf], { type: f.mimetype ?? "application/octet-stream" });
            fd.append(fdKey, blob, f.originalFilename ?? f.newFilename ?? fdKey);
          }
        };

        appendFile("profile_img",      "profile_img");
        appendFile("aadhaar_img",      "aadhaar_img");
        appendFile("pan_img",          "pan_img");
        appendFile("edu_certificates", "edu_certificates");
        appendFile("passbook_img",     "passbook_img");

        // Forward request
        const response = await fetch(
          "https://goadrda.runtime-solutions.net/admin/api/add-crp",
          { method: "POST", headers: { Authorization: authHeader }, body: fd }
        );

        // Safely intercept HTML errors if server fails to return JSON
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error("[add-crp] Remote responded with non-JSON HTML. Snapshot:", text.substring(0, 500));
          res.status(response.status || 500).json({
            status: false,
            message: `Remote server error (${response.status}). The server responded with an invalid page.`,
            htmlSnapshot: text.substring(0, 300),
          });
          return resolve();
        }

        console.log("[add-crp] Remote response:", JSON.stringify(data));
        res.status(response.status).json(data);
        return resolve();
      } catch (error) {
        console.error("[add-crp] Proxy error:", error);
        res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
        return resolve();
      }
    });
  });
}
