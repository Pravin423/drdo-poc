import { createPortal } from "react-dom";
import { 
  Calendar, CheckCircle2, XCircle, Eye, X, AlertCircle, MessageSquare, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../common/DataTable";
import { memo, useState, useEffect } from "react";  
import ConfirmationModal from "../../common/ConfirmationModal";

const LeaveListTab = memo(function LeaveListTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
      const res = await fetch(`/api/leave-list${searchQuery ? `?search=${searchQuery}` : ''}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();
      
      if (result.status === 1 && Array.isArray(result.data)) {
        const mappedData = result.data.map(item => ({
          id: item.id,
          employeeName: item.name || "Unknown",
          employeeId: `CRP${item.user_id}`,
          leaveType: item.leave_type || "General Leave",
          startDate: item.start_date,
          endDate: item.end_date,
          days: item.leave_count || 1,
          status: item.status === "1" ? "Approved" : item.status === "2" ? "Rejected" : "Pending",
          reason: item.reason || "No reason provided",
          appliedOn: item.created_at,
          profile: item.profile
        }));
        setLeaves(mappedData);
      } else {
        setLeaves([]);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setError("Failed to load leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [searchQuery]);

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = statusFilter === "all" || leave.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === "Pending").length,
    approved: leaves.filter(l => l.status === "Approved").length,
    rejected: leaves.filter(l => l.status === "Rejected").length,
  };

  const handleStatusChange = async (row, newStatus) => {
    if (newStatus === "Approved") {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
        const res = await fetch(`/api/leave-approve/${row.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.status === 1) {
          fetchLeaves();
        } else {
          alert(result.message || "Failed to approve leave.");
        }
      } catch (err) {
        console.error("Error approving leave:", err);
        alert("An error occurred during approval.");
      }
    } else if (newStatus === "Rejected") {
      setSelectedLeave(row);
      setRejectionComment("");
      setIsRejectModalOpen(true);
    }
  };

  const handleRejectSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
      const res = await fetch(`/api/leave-reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leave_id: selectedLeave.id,
          comment: "Administratively rejected."
        })
      });
      const result = await res.json();
      
      if (result.status === 1 || result.message?.includes("Successfully")) {
        setIsRejectModalOpen(false);
        fetchLeaves();
      } else {
        alert(result.message || "Failed to reject leave.");
      }
    } catch (err) {
      console.error("Error rejecting leave:", err);
      alert("An error occurred during rejection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Employee Identification",
      key: "employeeName",  
      render: (val, row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-[100%] bg-gradient-to-br from-[#3b52ab] to-[#1a2e7a] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[0_8px_20px_-8px_rgba(59,82,171,0.2)] group-hover:scale-110 transition-transform">
              {row.profile ? <img src={row.profile} className="w-full h-full object-cover rounded-[100%]" /> : val.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 group-hover:text-[#3b52ab] transition-colors">{val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reference: {row.employeeId}</p>
          </div>
        </div>
      )
    },
    {
      header: "Leave Categorization",
      key: "leaveType",
      render: (val) => (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/50">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span className="text-xs font-bold text-slate-700">{val}</span>
        </div>
      )
    },
    {
      header: "Temporal Range",
      key: "startDate",
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-slate-800 tabular-nums">
            {new Date(row.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(row.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-[#3b52ab] uppercase">
             <Calendar size={10} />
             {row.days} Business Day(s)
          </div>
        </div>
      )
    },
    {
      header: "Context / Justification",
      key: "reason",
      render: (val) => (
        <p className="text-sm text-slate-500 font-semibold max-w-[240px] line-clamp-2 leading-relaxed" title={val}>{val}</p>
      )
    },
    {
      header: "Approval State",
      key: "status",
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
          val === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          val === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
          'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            val === 'Approved' ? 'bg-emerald-500' :
            val === 'Rejected' ? 'bg-rose-500' :
            'bg-amber-500'
          }`} />
          {val}
        </span>
      )
    }
  ];
  const actions = [
    {
      icon: CheckCircle2,
      title: "Approve Request",
      onClick: (row) => handleStatusChange(row, 'Approved'),
      className: "hover:text-emerald-600 hover:bg-emerald-50",
      show: (row) => row.status === 'Pending'
    },
    {
      icon: XCircle,
      title: "Reject Request",
      onClick: (row) => handleStatusChange(row, 'Rejected'),
      className: "hover:text-rose-600 hover:bg-rose-50",
      show: (row) => row.status === 'Pending'
    },
    {
      icon: Eye,
      title: "View Details",
      onClick: (row) => {},
      className: "hover:text-[#3b52ab] hover:bg-[#eff2ff]"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Leave <span className="text-[#3b52ab]">Requests</span>
            </h2>
            {stats.pending > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {stats.pending} Pending
              </div>
            )}
          </div>
          <p className="text-[13px] font-bold text-slate-500">Review and manage employee leave applications</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeaves}
        isLoading={loading}
        searchProps={{
          placeholder: "Filter by name, ID or role...",
          value: searchQuery,
          onChange: setSearchQuery
        }}
        headerActions={
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/50 rounded-[1.75rem] border border-slate-200/40">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? "bg-white text-[#3b52ab] shadow-lg shadow-indigo-50 scale-105" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        }
        actions={actions}
        footerProps={{
          totalRecords: filteredLeaves.length,
          showPagination: false
        }}
      />

      {/* Rejection Modal (Styled Exactly as Requested) */}
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectSubmit}
        title="Delete Record?"
        message="This action cannot be undone. Are you sure you want to permanently delete this record?"
        type="delete"
        confirmText="Yes, Delete"
        cancelText="Keep It"
        isLoading={isSubmitting}
      />

    </div>
  );
});

export default LeaveListTab;
