import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_BASE = "https://goadrda.runtime-solutions.net/admin/api";

const get = (fields, key) =>
  (Array.isArray(fields[key]) ? fields[key][0] : fields[key]) ?? "";

const appendFile = (fd, fdKey, files, fileKey) => {
  const f = Array.isArray(files[fileKey]) ? files[fileKey][0] : files[fileKey];
  if (f?.filepath) {
    const mimeType = "text/csv";
    const buf = fs.readFileSync(f.filepath);
    const blob = new Blob([buf], { type: mimeType });
    fd.append(fdKey, blob, f.originalFilename ?? f.newFilename ?? fdKey);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let authHeader = req.headers["authorization"];
  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.auth_token) {
    authHeader = `Bearer ${req.cookies.auth_token}`;
  }
  
  if (!authHeader) {
    return res.status(401).json({ status: false, message: "Unauthorized: no auth token" });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });
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
    const districtId = get(fields, "district_id");
    const talukaId = get(fields, "taluka_id");
    const villageId = get(fields, "village_id");

    if (!districtId) return res.status(400).json({ status: false, message: "District is required" });
    if (!talukaId) return res.status(400).json({ status: false, message: "Taluka is required" });
    if (!villageId) return res.status(400).json({ status: false, message: "Village is required" });
    if (!files.file) return res.status(400).json({ status: false, message: "CSV file is required" });

    const fd = new FormData();
    fd.append("district_id", districtId);
    fd.append("taluka_id", talukaId);
    fd.append("village_id", villageId);
    appendFile(fd, "file", files, "file");

    const apiRes = await fetch(`${API_BASE}/shgs/bulk-upload`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: fd,
    });

    const rawText = await apiRes.text();
    console.log("SHG Bulk Upload Backend Raw Response:", rawText);

    let data;
    try { 
        data = JSON.parse(rawText); 
    } catch { 
        data = { message: rawText }; 
    }
    
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("[shg-bulk-upload.js] Proxy error:", err.message);
    return res.status(502).json({ status: false, message: "Proxy error: " + err.message });
  }
}
