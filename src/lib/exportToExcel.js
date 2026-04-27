/**
 * Shared Excel Export Utility
 * Generates a styled .xls file with consistent formatting across all pages.
 *
 * @param {Object} options
 * @param {string}   options.title       - Report title shown at the top (e.g. "Goa Districts Report")
 * @param {string[]} options.headers     - Column header labels (e.g. ["ID", "District Name", "Census Code"])
 * @param {string[][]} options.rows      - Data rows as arrays of strings (same order as headers)
 * @param {string}   options.filename    - Output filename without extension (e.g. "goa_districts")
 */
export function exportToExcel({ title, headers, rows, filename }) {
    const accentColor = "#1E40AF";       // Deep blue header bg
    const headerTextColor = "#FFFFFF";   // White header text
    const altRowColor = "#EFF6FF";       // Light blue for alternate rows
    const borderColor = "#BFDBFE";       // Soft blue border

    const styledRows = rows.map((row, idx) => {
        const bg = idx % 2 === 0 ? "#FFFFFF" : altRowColor;
        
        // Handle both simple arrays and object-based rows for custom styling
        const isObjectRow = !Array.isArray(row) && typeof row === "object";
        const rowData = isObjectRow ? row.data : row;
        const rowColor = isObjectRow && row.isDummy ? "#94A3B8" : "#1E293B"; // Gray for dummy data

        const cells = rowData.map((cell, colIdx) => {
            const bold = colIdx === 1 ? "font-weight: bold;" : ""; 
            return `<td style="
                background-color: ${bg};
                border: 1px solid ${borderColor};
                padding: 8px 12px;
                font-size: 12px;
                font-family: Calibri, sans-serif;
                color: ${rowColor};
                vertical-align: middle;
                ${bold}
            ">${cell}</td>`;
        }).join("");
        return `<tr>${cells}</tr>`;
    }).join("");

    const headerCells = headers.map(h => `
        <th style="
            background-color: ${accentColor};
            color: ${headerTextColor};
            font-weight: bold;
            font-size: 13px;
            font-family: Calibri, sans-serif;
            padding: 10px 14px;
            border: 1px solid #1D4ED8;
            text-align: center;
            vertical-align: middle;
            letter-spacing: 0.5px;
        ">${h}</th>
    `).join("");

    const generatedAt = new Date().toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
    });

    const tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8" />
        </head>
        <body>
            <table>
                <tr>
                    <td colspan="${headers.length}" style="
                        font-size: 20px;
                        font-weight: bold;
                        font-family: Calibri, sans-serif;
                        color: ${accentColor};
                        text-align: center;
                        padding: 20px 14px 6px;
                        vertical-align: middle;
                        border: none;
                    ">${title}</td>
                </tr>
                <tr>
                    <td colspan="${headers.length}" style="
                        font-size: 11px;
                        font-family: Calibri, sans-serif;
                        color: #64748B;
                        text-align: center;
                        padding: 4px 14px 16px;
                        border: none;
                    ">Generated on: ${generatedAt} &nbsp;&nbsp;|&nbsp;&nbsp; Total Records: ${rows.length}</td>
                </tr>
                <tr>${headerCells}</tr>
                ${styledRows}
                <tr>
                    <td colspan="${headers.length}" style="
                        font-size: 10px;
                        font-family: Calibri, sans-serif;
                        color: #94A3B8;
                        text-align: right;
                        padding: 10px 14px;
                        border-top: 2px solid ${borderColor};
                        border-left: none;
                        border-right: none;
                        border-bottom: none;
                    ">Directorate of Goa — Confidential Data Export</td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.xls`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
