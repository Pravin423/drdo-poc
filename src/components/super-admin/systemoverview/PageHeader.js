import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { exportToPDF } from "@/lib/exportToPDF";
import { ACTIVITIES } from "./utils/data";

/**
 * PageHeader
 * Renders the top title + "Download Report" button row.
 */
export default function PageHeader({ roleName }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // 1. Fetch Summary Data (Same as SummaryCards)
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      const data = json.data || {};

      // 2. Prepare Sections for PDF
      const sections = [
        {
          title: "Dashboard Summary Metrics",
          headers: ["Metric", "Value"],
          rows: [
            ["Total CRPs", String(data.totalCrps || 0)],
            ["Total Attendance", String(data.totalAttendance || 0)],
            ["Regular Tasks", String(data.regularTaskCount || 0)],
            ["Special Tasks", String(data.specialTaskCount || 0)],
            ["Total Users", String(data.totalUsers || 0)],
          ],
        },
        {
          title: "Recent System Activities",
          headers: ["Activity", "Status", "Priority", "Timestamp"],
          rows: ACTIVITIES.map((a) => [a.title, a.status, a.priority, a.time]),
        },
      ];

      // 3. Trigger PDF Generation
      await exportToPDF({
        title: "Goa System Overview Report",
        subtitle: `${roleName} Dashboard Analytics`,
        sections,
        filename: `system_overview_${new Date().toISOString().split("T")[0]}`,
      });
    } catch (error) {
      console.error("Failed to download report:", error);
      // Fallback if API fails - still generate with what we have or static data
      await exportToPDF({
        title: "Goa System Overview Report",
        subtitle: `${roleName} Dashboard Analytics`,
        sections: [
          {
            title: "Recent System Activities",
            headers: ["Activity", "Status", "Priority", "Timestamp"],
            rows: ACTIVITIES.map((a) => [a.title, a.status, a.priority, a.time]),
          },
        ],
        filename: "system_overview_partial",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {roleName}{" "}
          <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
            Overview
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          System-wide analytics and multi-state configuration oversight.
        </p>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-fit px-6 py-2.5 bg-gradient-to-r from-[#3b52ab] to-[#1a2e7a] text-white rounded-xl text-sm font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg shadow-blue-200"
      >
        {isDownloading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Download size={16} />
        )}
        {isDownloading ? "Generating..." : "Download Report"}
      </button>
    </motion.header>
  );
}
