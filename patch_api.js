const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Pravin/Desktop/topsecret(kiran)/dgoa/src/pages/api';

const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file === 'auth.js') return; // handled separately
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace authHeader
  content = content.replace(
    /const authHeader = req\.headers\[[\"']authorization[\"']\];/,
    `let authHeader = req.headers["authorization"];\n  if ((!authHeader || authHeader.includes("undefined") || authHeader.includes("null")) && req.cookies?.authToken) {\n    authHeader = \`Bearer \${req.cookies.authToken}\`;\n  }`
  );

  // Replace token
  content = content.replace(
    /const token = \(req\.headers\[[\"']authorization[\"']\] \|\| \"\"\)\.replace\(\"Bearer \", \"\"\);/,
    `let token = (req.headers["authorization"] || "").replace("Bearer ", "");\n    if ((!token || token === "undefined" || token === "null") && req.cookies?.authToken) {\n      token = req.cookies.authToken;\n    }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Update Complete!');
