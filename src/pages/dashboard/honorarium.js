"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import DataTable from "../../components/common/DataTable";

// Components
import HonSummaryCards from "../../components/super-admin/hon-calc/HonSummaryCards";
import HonFilterPanel from "../../components/super-admin/hon-calc/HonFilterPanel";
import HonBreakdownModal, { StatusBadge } from "../../components/super-admin/hon-calc/HonBreakdownModal";

/* ── helpers ── */
const fmtRs = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function HonorariumCalculation() {
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalCalc, setModalCalc] = useState(null);   // open modal for this calc
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setModalCalc(null);
      try {
        const [mn, yr] = selectedMonth.split(" ");
        const m = new Date(`${mn} 1, ${yr}`).getMonth() + 1;
        const res = await fetch(`/api/honorarium?month=${m}&year=${yr}`);
        const json = await res.json();
        if (json.status === 1 && json.data) {
          setData(json.data.map((item, idx) => ({
            id: item.crp_id ?? idx,
            name: item.crp_name ?? "N/A",
            crpCode: item.crp_code ?? `CRP-${idx}`,
            totalWorkingHours: Number(item.total_working_hours) || 0,
            totalWorkingDays: Number(item.total_working_days) || 0,
            daysPayable: Number(item.days_payable) || 0,
            regularAmount: Number(item.regular_amount) || 0,
            approvedRegularCount: Number(item.approved_regular_count) || 0,
            approvedSpecialCount: Number(item.approved_special_count) || 0,
            specialAmount: Number(item.special_amount) || 0,
            totalHonorarium: Number(item.total_honorarium) || 0,
            paymentStatus: item.payment_status ?? "Pending",
          })));
        } else setData([]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    run();
  }, [selectedMonth]);

  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.crpCode.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All Status" || c.paymentStatus?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  }), [data, search, statusFilter]);

  const totalAmt = filtered.reduce((s, c) => s + c.totalHonorarium, 0);
  const paidCnt = filtered.filter(c => c.paymentStatus?.toLowerCase() === "paid").length;

  const exportCSV = () => {
    const h = ["CRP Code", "CRP Name", "Working Hrs", "Working Days", "Days Payable", "Regular Amt", "Special Amt", "Total Honorarium", "Payment Status"];
    const r = filtered.map(c => [c.crpCode, c.name, c.totalWorkingHours, c.totalWorkingDays, c.daysPayable, c.regularAmount, c.specialAmount, c.totalHonorarium, c.paymentStatus]);
    const csv = [h, ...r].map(row => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `Honorarium_${selectedMonth.replace(/ /g, "_")}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { 
      header: "CRP Code", 
      key: "crpCode",
      render: (val) => <span className="text-xs font-mono text-slate-500">{val}</span>
    },
    { 
      header: "Name", 
      key: "name",
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
            {val.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{val}</span>
        </div>
      )
    },
    { 
      header: "Working Hrs", 
      key: "totalWorkingHours",
      render: (val) => <span className="text-sm text-slate-600 tabular-nums">{val} hrs</span>
    },
    { 
      header: "Working Days", 
      key: "totalWorkingDays",
      render: (val) => <span className="text-sm text-slate-600 tabular-nums">{val} days</span>
    },
    { 
      header: "Days Payable", 
      key: "daysPayable",
      render: (val) => <span className="text-sm text-slate-600 tabular-nums">{val} days</span>
    },
    { 
      header: "Regular Amt", 
      key: "regularAmount",
      render: (val) => <span className="text-sm text-slate-700 font-medium tabular-nums">{fmtRs(val)}</span>
    },
    { 
      header: "Special Amt", 
      key: "specialAmount",
      render: (val) => <span className="text-sm text-slate-700 font-medium tabular-nums">{fmtRs(val)}</span>
    },
    { 
      header: "Total Honorarium", 
      key: "totalHonorarium",
      render: (val) => <span className="text-sm font-bold text-slate-900 tabular-nums">{fmtRs(val)}</span>
    },
    { 
      header: "Status", 
      key: "paymentStatus",
      render: (val) => <StatusBadge status={val} />
    },
  ];

  const actions = [
    {
      icon: Eye,
      onClick: (row) => setModalCalc(row),
      title: "View Details",
      className: "bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
    }
  ];

  return (
    <ProtectedRoute allowedRole="super-admin">
      {modalCalc && (
        <HonBreakdownModal
          calc={modalCalc}
          month={selectedMonth}
          onClose={() => setModalCalc(null)}
        />
      )}

      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Honorarium{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Calculation
                </span>
              </h1>
              <p className="text-slate-500 font-medium mt-0.5">
                Automated honorarium processing for Community Resource Persons
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Download size={15} /> Export CSV
            </button>
          </motion.header>

          {/* Summary Cards */}
          <HonSummaryCards 
            filteredLength={filtered.length}
            totalAmt={totalAmt}
            paidCnt={paidCnt}
            dataLength={data.length}
          />

          {/* Filter Panel */}
          <HonFilterPanel 
            search={search}
            setSearch={setSearch}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Table */}
          <DataTable 
            columns={columns}
            data={filtered}
            isLoading={loading}
            actions={actions}
            footerProps={{
              totalRecords: filtered.length,
              showPagination: false // The original didn't have pagination logic beyond just slicing if I recall, but the server side didn't seem to support it here.
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
