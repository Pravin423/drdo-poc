import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Helper to load an image from a URL and return a base64 string
 */
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
  });
};

/**
 * Shared PDF Export Utility
 * Generates a high-end, professional PDF report.
 */
export async function exportToPDF({ title, subtitle, sections, filename }) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let currentY = 0;

  // --- Header Section (Modern Blue) ---
  const headerHeight = 45;
  doc.setFillColor(10, 61, 98); // Deep Navy (#0a3d62)
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // White Logo Container (Rounded)
  const logoBoxSize = 24;
  const logoBoxX = margin;
  const logoBoxY = 10;
  doc.setDrawColor(255, 255, 255, 0.2);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 4, 4, "F");

  // Load and Add Logo
  try {
    const logoBase64 = await loadImage("/Seal_of_Goa.webp");
    // Center logo in the white box
    const logoSize = 18;
    const logoX = logoBoxX + (logoBoxSize - logoSize) / 2;
    const logoY = logoBoxY + (logoBoxSize - logoSize) / 2;
    doc.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
  } catch (err) {
    console.warn("Logo could not be loaded for PDF:", err);
  }

  // Text Positions
  const textX = logoBoxX + logoBoxSize + 10;
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, textX, 22);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(180, 210, 230);
  doc.text(subtitle || "Management Report", textX, 30);

  // Decorative Line
  doc.setDrawColor(255, 255, 255, 0.3);
  doc.setLineWidth(0.5);
  doc.line(textX, 34, textX + 60, 34);

  // Timestamp
  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${now}`, pageWidth - margin, 30, { align: "right" });

  currentY = headerHeight + 15;

  // --- Sections ---
  sections.forEach((section, index) => {
    // Section Title with Accent
    doc.setFillColor(10, 61, 98);
    doc.rect(margin, currentY - 1, 2, 6, "F"); // Small blue bar accent
    
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(section.title, margin + 5, currentY + 4);
    currentY += 12;

    autoTable(doc, {
      startY: currentY,
      head: [section.headers],
      body: section.rows,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [10, 61, 98],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        0: { fontStyle: "bold" },
      },
      didDrawPage: (data) => {
        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "Directorate of Goa — Confidential System Report",
          margin,
          pageHeight - 10
        );
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
        // Subtle line above footer
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      },
    });

    currentY = doc.lastAutoTable.finalY + 15;

    if (currentY > 260 && index < sections.length - 1) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.save(`${filename || "report"}.pdf`);
}
