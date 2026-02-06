import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Download,
  QrCode,
  Bell,
  RefreshCw,
  X,
  Search,
  Calendar,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function QuickActions({ onActionClick }) {
  const actions = [
    {
      id: "bulk-approve",
      title: "Bulk Approve",
      description: "Approve multiple attendance entries",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500",
      iconColor: "text-white",
      cardBg: "bg-white",
    },
    {
      id: "generate-report",
      title: "Generate Report",
      description: "Create attendance summary report",
      icon: FileText,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      cardBg: "bg-white",
    },
    {
      id: "export-register",
      title: "Export Register",
      description: "Download daily muster roll PDF",
      icon: Download,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      cardBg: "bg-white",
    },
    {
      id: "qr-attendance",
      title: "QR Attendance",
      description: "Generate QR code for attendance",
      icon: QrCode,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      cardBg: "bg-white",
    },
    {
      id: "exception-alerts",
      title: "Exception Alerts",
      description: "View urgent exception notifications",
      icon: Bell,
      iconBg: "bg-amber-500",
      iconColor: "text-white",
      cardBg: "bg-white",
    },
    {
      id: "sync-data",
      title: "Sync Data",
      description: "Sync offline attendance data",
      icon: RefreshCw,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      cardBg: "bg-white",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => onActionClick(action.id)}
              className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 text-left bg-white"
            >
              <div className={`${action.iconBg} ${action.iconColor} p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 mb-1 text-sm">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// Export modals component
export function QuickActionsModals({ activeModal, onClose }) {
  return (
    <>
      <BulkApproveModal
        isOpen={activeModal === "bulk-approve"}
        onClose={onClose}
      />
      <GenerateReportModal
        isOpen={activeModal === "generate-report"}
        onClose={onClose}
      />
      <ExportRegisterModal
        isOpen={activeModal === "export-register"}
        onClose={onClose}
      />
      <QRAttendanceModal
        isOpen={activeModal === "qr-attendance"}
        onClose={onClose}
      />
      <ExceptionAlertsModal
        isOpen={activeModal === "exception-alerts"}
        onClose={onClose}
      />
      <SyncDataModal
        isOpen={activeModal === "sync-data"}
        onClose={onClose}
      />
    </>
  );
}

// Modal Wrapper Component
function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) {
  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow;
      // Disable scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore original overflow when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden pointer-events-auto my-8`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// 1. Bulk Approve Modal
function BulkApproveModal({ isOpen, onClose }) {
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pendingEntries = [
    { id: 1, name: "Rajesh Kumar", district: "North Goa", date: "2026-02-06", status: "Late Entry" },
    { id: 2, name: "Priya Sharma", district: "South Goa", date: "2026-02-06", status: "Early Exit" },
    { id: 3, name: "Amit Patel", district: "North Goa", date: "2026-02-05", status: "Geo-fence Issue" },
    { id: 4, name: "Sneha Desai", district: "South Goa", date: "2026-02-05", status: "Late Entry" },
    { id: 5, name: "Vikram Singh", district: "North Goa", date: "2026-02-04", status: "Manual Entry" },
  ];

  const filteredEntries = pendingEntries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(e => e.id));
    }
  };

  const handleToggleEntry = (id) => {
    setSelectedEntries(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleApprove = async () => {
    setIsApproving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApproving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedEntries([]);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Approve Attendance" maxWidth="max-w-4xl">
      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="text-sm text-slate-600">Selected Entries</p>
            <p className="text-2xl font-bold text-slate-900">{selectedEntries.length}</p>
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            {selectedEntries.length === filteredEntries.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEntries.map((entry) => (
            <label
              key={entry.id}
              className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedEntries.includes(entry.id)}
                onChange={() => handleToggleEntry(entry.id)}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{entry.name}</p>
                    <p className="text-sm text-slate-500">{entry.district} • {entry.date}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full">
                    {entry.status}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={selectedEntries.length === 0 || isApproving}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
          >
            {isApproving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Approving...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Approved!
              </>
            ) : (
              <>Approve {selectedEntries.length} Entries</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 2. Generate Report Modal
function GenerateReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState("daily");
  const [district, setDistrict] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "2026-02-01", end: "2026-02-06" });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // Simulate download
    alert("Report generated successfully! Download started.");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Attendance Report">
      <div className="p-6 space-y-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Report Type</label>
          <div className="grid grid-cols-3 gap-3">
            {["daily", "weekly", "monthly"].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors ${
                  reportType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">District</label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">All Districts</option>
              <option value="north">North Goa</option>
              <option value="south">South Goa</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Report Summary:</span> Generate {reportType} attendance report for {district === "all" ? "all districts" : district === "north" ? "North Goa" : "South Goa"} from {dateRange.start} to {dateRange.end}.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 3. Export Register Modal
function ExportRegisterModal({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState("2026-02-06");
  const [format, setFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    alert(`Muster roll exported as ${format.toUpperCase()}! Download started.`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Daily Muster Roll">
      <div className="p-6 space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {["pdf", "excel", "csv"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors ${
                  format === fmt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Info */}
        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total CRPs:</span>
            <span className="font-semibold text-slate-900">248</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Present:</span>
            <span className="font-semibold text-emerald-600">232</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Absent:</span>
            <span className="font-semibold text-rose-600">16</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Date:</span>
            <span className="font-semibold text-slate-900">{selectedDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 4. QR Attendance Modal
function QRAttendanceModal({ isOpen, onClose }) {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [expiryTime, setExpiryTime] = useState(30);

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code Attendance">
      <div className="p-6 space-y-6">
        {!qrGenerated ? (
          <>
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="w-12 h-12 text-slate-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Generate QR Code for Attendance
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                CRPs can scan this QR code to mark their attendance. The code will be valid for the selected duration.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                QR Code Validity (minutes)
              </label>
              <select
                value={expiryTime}
                onChange={(e) => setExpiryTime(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQR}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Generate QR Code
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-8">
              <div className="w-64 h-64 mx-auto bg-white border-4 border-slate-200 rounded-2xl flex items-center justify-center mb-4">
                {/* QR Code Placeholder */}
                <div className="w-56 h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-400" />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Active for {expiryTime} minutes</span>
              </div>
              <p className="text-sm text-slate-500">
                Scan this code to mark attendance
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setQrGenerated(false)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Generate New
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// 5. Exception Alerts Modal
function ExceptionAlertsModal({ isOpen, onClose }) {
  const exceptions = [
    {
      id: 1,
      type: "Geo-fence Violation",
      crp: "Rajesh Kumar",
      district: "North Goa",
      time: "2 hours ago",
      severity: "high",
      description: "Attendance marked outside designated geo-fence boundary",
    },
    {
      id: 2,
      type: "Late Entry",
      crp: "Priya Sharma",
      district: "South Goa",
      time: "3 hours ago",
      severity: "medium",
      description: "Check-in recorded 45 minutes after scheduled time",
    },
    {
      id: 3,
      type: "Missing Check-out",
      crp: "Amit Patel",
      district: "North Goa",
      time: "5 hours ago",
      severity: "medium",
      description: "No check-out recorded for yesterday's shift",
    },
    {
      id: 4,
      type: "Duplicate Entry",
      crp: "Sneha Desai",
      district: "South Goa",
      time: "1 day ago",
      severity: "low",
      description: "Multiple check-in entries detected for the same day",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exception Alerts" maxWidth="max-w-3xl">
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <p className="text-sm text-rose-600 font-semibold mb-1">High Priority</p>
            <p className="text-2xl font-bold text-rose-700">1</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-600 font-semibold mb-1">Medium Priority</p>
            <p className="text-2xl font-bold text-amber-700">2</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold mb-1">Low Priority</p>
            <p className="text-2xl font-bold text-blue-700">1</p>
          </div>
        </div>

        {/* Exceptions List */}
        <div className="space-y-3">
          {exceptions.map((exception) => (
            <div
              key={exception.id}
              className={`p-4 rounded-xl border ${getSeverityColor(exception.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <h4 className="font-semibold">{exception.type}</h4>
                </div>
                <span className="text-xs opacity-75">{exception.time}</span>
              </div>
              <div className="pl-7">
                <p className="text-sm font-semibold mb-1">
                  {exception.crp} • {exception.district}
                </p>
                <p className="text-sm opacity-90">{exception.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 6. Sync Data Modal
function SyncDataModal({ isOpen, onClose }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setSyncComplete(true);
          setTimeout(() => {
            setSyncComplete(false);
            onClose();
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync Offline Data">
      <div className="p-6 space-y-6">
        {!isSyncing && !syncComplete && (
          <>
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <RefreshCw className="w-12 h-12 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Sync Offline Attendance Data
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Synchronize offline attendance records with the central server. This will upload pending entries and download latest updates.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Pending Uploads:</span>
                <span className="font-semibold text-slate-900">12 entries</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Last Sync:</span>
                <span className="font-semibold text-slate-900">2 hours ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Connection:</span>
                <span className="font-semibold text-emerald-600">Online</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSync}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start Sync
              </button>
            </div>
          </>
        )}

        {isSyncing && (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Syncing Data...</h4>
            <p className="text-sm text-slate-500 mb-6">Please wait while we sync your data</p>
            
            <div className="max-w-md mx-auto">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-2">{syncProgress}%</p>
            </div>
          </div>
        )}

        {syncComplete && (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Sync Complete!</h4>
            <p className="text-sm text-slate-500">All data has been synchronized successfully</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
