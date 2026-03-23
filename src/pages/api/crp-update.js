// src/pages/api/crp-update.js
// Proxy — parses multipart form with formidable,
// then forwards to update-crp-employee/{id} on the remote API.
//
// Two-pass strategy for aadharnumber:
//   Pass 1 → send aadharnumber (satisfies backend "required" check)
//   Pass 2 → if backend returns "already exists" (backend bug: doesn't exclude
//             the current CRP from uniqueness check), retry without the field.

import { IncomingForm } from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

// ── helpers ────────────────────────────────────────────────────────────────────
function buildFormData(fields, files, includeAadhaar = true) {
  const get = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) ?? "";

  const fd = new FormData();
  fd.append("fullname",       get("fullname"));
  if (includeAadhaar) {
    fd.append("aadharnumber", get("aadharnumber"));
  }
  fd.append("mobile",         get("mobile"));
  fd.append("email",          get("email"));
  fd.append("gender",         get("gender"));
  fd.append("dob",            get("dob"));
  fd.append("pan_number",     get("pan_number"));
  fd.append("bank_name",      get("bank_name"));
  fd.append("branch_name",    get("branch_name"));
  fd.append("account_number", get("account_number"));
  fd.append("ifsc_code",      get("ifsc_code"));

  // optional file attachments
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

  return fd;
}

function isAadhaarAlreadyExistsError(data) {
  const msg = data?.aadharnumber ?? data?.message ?? "";
  const str = typeof msg === "string" ? msg : JSON.stringify(msg);
  return str.toLowerCase().includes("already exists");
}

async function callRemote(remoteUrl, authHeader, fd) {
  const response = await fetch(remoteUrl, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: fd,
  });
  const rawText = await response.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { status: false, message: "Remote API returned non-JSON", raw: rawText.slice(0, 300) };
  }
  return { response, data };
}

// ── handler ────────────────────────────────────────────────────────────────────
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  const crpId = req.query?.id;
  if (!crpId) {
    return res.status(400).json({ status: false, message: "CRP id is required (?id=...)" });
  }

  // auth — prefer cookie, fall back to Authorization header
  let authHeader = req.headers["authorization"];
  if (
    (!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) &&
    req.cookies?.auth_token
  ) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  if (!authHeader || authHeader.includes("undefined")) {
    return res.status(401).json({ status: false, message: "No authorization token found" });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("[crp-update] parse error:", err);
      return res.status(500).json({ status: false, message: "Failed to parse form data" });
    }

    try {
      const remoteUrl = `https://goadrda.runtime-solutions.net/admin/api/update-crp-employee/${crpId}`;

      // ── Pass 1: include aadharnumber ─────────────────────────────────────
      console.log("[crp-update] Pass 1 → POST", remoteUrl, "(with aadharnumber)");
      const { response: r1, data: d1 } = await callRemote(
        remoteUrl, authHeader, buildFormData(fields, files, true)
      );

      const pass1Failed = d1?.status === false || !r1.ok;
      if (!pass1Failed) {
        console.log("[crp-update] Pass 1 succeeded:", JSON.stringify(d1));
        return res.status(r1.status).json(d1);
      }

      // ── Pass 2: backend returned "already exists" — retry without it ─────
      if (isAadhaarAlreadyExistsError(d1)) {
        console.log("[crp-update] Pass 2 → retrying without aadharnumber (backend bug workaround)");
        const { response: r2, data: d2 } = await callRemote(
          remoteUrl, authHeader, buildFormData(fields, files, false)
        );

        console.log("[crp-update] Pass 2 response:", JSON.stringify(d2));
        return res.status(r2.status).json(d2);
      }

      // other error from pass 1 — return as-is
      console.error("[crp-update] Pass 1 error (non-aadhaar):", JSON.stringify(d1));
      return res.status(r1.status).json(d1);

    } catch (error) {
      console.error("[crp-update] Proxy error:", error);
      return res.status(500).json({ status: false, message: "Proxy request failed", error: error.message });
    }
  });
}

