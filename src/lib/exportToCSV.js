/**
 * Shared CSV Export Utility
 * Generates a standard .csv file.
 *
 * @param {Object} options
 * @param {string[]} options.headers     - Column header labels
 * @param {string[][]} options.rows      - Data rows as arrays of strings
 * @param {string}   options.filename    - Output filename without extension
 */
export function exportToCSV({ headers, rows, filename }) {
    // Escape special characters in CSV fields (quotes, commas)
    const escapeCSV = (field) => {
        if (field === null || field === undefined) return "";
        const stringField = String(field);
        if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
