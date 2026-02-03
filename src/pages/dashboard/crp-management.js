"use client";

import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { Download } from "lucide-react";

import { X } from "lucide-react";

import {
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  RefreshCw,
  UploadCloud,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- MOCK DATA ---------------- */
const CRP_DATA = [
  {
    id: 1,
    name: "Priya Desai",
    aadhaar: "1234-5678-9012",
    mobile: "9876543210",
    email: "priya.desai@goagov.in",
    district: "North Goa",
    taluka: "Bardez",
    block: "Block 1",
    villages: 5,
    status: "Active",
    lastActivity: "Task Submitted",
    vertical: "Health & Nutrition",
    time: "29 Jan 2026, 10:30 AM",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    aadhaar: "2345-6789-0123",
    mobile: "9876543211",
    email: "rajesh.kumar@goagov.in",
    district: "South Goa",
    taluka: "Salcete",
    block: "Block 2",
    villages: 7,
    status: "Active",
    lastActivity: "Attendance Marked",
    vertical: "Education & Literacy",
    time: "30 Jan 2026, 09:15 AM",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Anita Fernandes",
    aadhaar: "3456-7890-1234",
    mobile: "9876543212",
    email: "anita.fernandes@goagov.in",
    district: "North Goa",
    taluka: "Tiswadi",
    block: "Block 3",
    villages: 4,
    status: "Active",
    lastActivity: "Training Attended",
    vertical: "Livelihood & Skills",
    time: "28 Jan 2026, 02:45 PM",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Suresh Naik",
    aadhaar: "4567-8901-2345",
    mobile: "9876543213",
    email: "suresh.naik@goagov.in",
    district: "South Goa",
    taluka: "Quepem",
    block: "Block 1",
    villages: 6,
    status: "Inactive",
    lastActivity: "Leave Applied",
    vertical: "Agriculture & Allied",
    time: "25 Jan 2026, 11:20 AM",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Meera Patel",
    aadhaar: "5678-9012-3456",
    mobile: "9876543214",
    email: "meera.patel@goagov.in",
    district: "North Goa",
    taluka: "Pernem",
    block: "Block 2",
    villages: 8,
    status: "Active",
    lastActivity: "Report Verified",
    vertical: "Infrastructure Development",
    time: "30 Jan 2026, 08:00 AM",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Vikram Singh",
    aadhaar: "6789-0123-4567",
    mobile: "9876543215",
    email: "vikram.singh@goagov.in",
    district: "South Goa",
    taluka: "Canacona",
    block: "Block 3",
    villages: 3,
    status: "Blacklisted",
    lastActivity: "Disciplinary Action",
    vertical: "Social Welfare",
    time: "20 Jan 2026, 03:30 PM",
    image: "https://i.pravatar.cc/150?img=6",
  },
];


/* ---------------- BADGES ---------------- */
const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-100",
    Blacklisted: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* ---------------- PAGE ---------------- */
export default function CrpManagement() {
  const [selectedCRP, setSelectedCRP] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [taluka, setTaluka] = useState("All Talukas");
  const [vertical, setVertical] = useState("All Verticals");

  // Stats
  const totalCRPs = CRP_DATA.length;
  const activeCRPs = CRP_DATA.filter((c) => c.status === "Active").length;
  const inactiveCRPs = CRP_DATA.filter((c) => c.status === "Inactive").length;
  const villagesCovered = CRP_DATA.reduce((sum, c) => sum + c.villages, 0);


  const summaryCards = [
    { label: "Total CRPs", value: totalCRPs, icon: Users, accent: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Active CRPs", value: activeCRPs, icon: Users, accent: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Inactive CRPs", value: inactiveCRPs, icon: Users, accent: "bg-rose-50 text-rose-600 border-rose-200" },
    { label: "Villages Covered", value: villagesCovered, icon: MapPin, accent: "bg-purple-50 text-purple-600 border-purple-200" },
  ];
  const exportToCSV = () => {
    if (!filteredCRPs.length) return;

    const headers = [
      "Name",
      "Aadhaar",
      "Mobile",
      "Email",
      "District",
      "Taluka",
      "Block",
      "Villages",
      "Status",
      "Last Activity",
      "Time",
    ];

    const rows = filteredCRPs.map(crp => [
      crp.name,
      crp.aadhaar,
      crp.mobile,
      crp.email,
      crp.district,
      crp.taluka,
      crp.block,
      crp.villages,
      crp.status,
      crp.lastActivity,
      crp.time,
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(val => `"${val ?? ""}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `CRP_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const openModal = (crp) => {
    setSelectedCRP(crp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCRP(null);
  }
  

  // Filter CRPs
  const filteredCRPs = CRP_DATA.filter((crp) => {
    const matchSearch =
      crp.name.toLowerCase().includes(search.toLowerCase()) ||
      crp.aadhaar.includes(search) ||
      crp.mobile.includes(search);

    const matchStatus = status === "All" || crp.status === status;
    const matchDistrict = district === "All Districts" || crp.district === district;
    const matchTaluka = taluka === "All Talukas" || crp.taluka === taluka;
    const matchVertical = vertical === "All Verticals" || crp.vertical === vertical;

    return matchSearch && matchStatus && matchDistrict && matchTaluka && matchVertical;
  });

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="max-w-[1600px]  mx-auto space-y-8 p-6">
          {/* ---------- HEADER ---------- */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col  md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                CRP{" "}
                <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-slate-500 font-medium">
                Manage Community Resource Persons across Goa
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                <UploadCloud size={16} /> Bulk Import
              </button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">
                + Register New CRP
              </button>
            </div>
          </motion.header>

          {/* ---------- SUMMARY CARDS ---------- */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <motion.section
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-2xl border ${card.accent}`}>
                    <card.icon size={20} />
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                </div>

                <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
                  <card.icon size={80} />
                </div>
              </motion.section>
            ))}
          </div>

          {/* ---------- FILTERS ---------- */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Records</h3>
            </div>

            <div className="p-6">
              {/* Main Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">

                {/* Search Input - Spanned for importance */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Search</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      placeholder="Name, Aadhaar, mobile..."
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 focus:bg-white"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Select Groups */}
                {[
                  { label: "District", value: district, setter: setDistrict, options: ["All Districts", "North Goa", "South Goa"] },
                  { label: "Taluka", value: taluka, setter: setTaluka, options: ["All Talukas", "Bardez", "Tiswadi"] },
                  { label: "Status", value: status, setter: setStatus, options: ["All Statuses", "Active", "Inactive", "On Leave"] },
                  { label: "Vertical", value: vertical, setter: setVertical, options: ["All Verticals", "Health", "Education"] },
                ].map((filter, idx) => (
                  <div key={idx} className="relative">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">{filter.label}</label>
                    <div className="relative">
                      <select
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-slate-50/30 focus:bg-white cursor-pointer transition-all"
                        value={filter.value}
                        onChange={(e) => filter.setter(e.target.value)}
                      >
                        {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                      {/* Custom Arrow Icon */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row justify-end items-center mt-8 pt-6 border-t border-slate-100 gap-3">

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("All Statuses");
                    setDistrict("All Districts");
                    setTaluka("All Talukas");
                    setVertical("All Verticals");
                  }}
                  className="w-full sm:w-auto text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw size={16} />
                  Clear All
                </button>



                {/* Export CSV */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50"
                >
                  <UploadCloud size={16} />
                  Export CSV
                </button>


              </div>

            </div>
          </div>

          {/* ---------- TABLE ---------- */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50/60">
                <tr>
                  {["Image", "CRP Details", "Contact", "Assignment", "Status", "Last Activity", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase ${h === "Actions" ? "text-right" : "text-left"
                          }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCRPs.map((crp, idx) => (
                  <motion.tr
                    key={crp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <img src={crp.image} alt={crp.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{crp.name}</p>
                      <p className="text-xs text-slate-500">Aadhaar: {crp.aadhaar}</p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p>{crp.mobile}</p>
                      <p className="text-xs text-slate-500">{crp.email}</p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p className="font-medium">{crp.district}</p>
                      <p className="text-xs text-slate-500">
                        {crp.taluka} – {crp.block} • {crp.villages} villages
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={crp.status} />
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p>{crp.lastActivity}</p>
                      <p className="text-xs text-slate-500">{crp.time}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-3 text-slate-500">
                        <Eye size={18} onClick={() => openModal(crp)} className="cursor-pointer hover:text-blue-600" />
                        <Edit size={18} className="cursor-pointer hover:text-emerald-600" />
                        <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-700" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && selectedCRP && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
              >

                {/* ===== Header ===== */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-50 border-b">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      CRP Profile
                    </h2>
                    <p className="text-xs text-slate-500">
                      Community Resource Person details
                    </p>
                  </div>

                  <X
                    size={20}
                    onClick={closeModal}
                    className="cursor-pointer text-slate-400 hover:text-red-500 transition"
                  />
                </div>

                {/* ===== Body ===== */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">

                  {/* Profile Card */}
                  <div className="flex items-center gap-5 p-5 rounded-2xl border bg-slate-50">
                    <img
                      src={selectedCRP.image}
                      alt={selectedCRP.name}
                      className="w-24 h-24 rounded-full object-cover border"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {selectedCRP.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Aadhaar: {selectedCRP.aadhaar}
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={selectedCRP.status} />
                      </div>
                    </div>
                  </div>

                  {/* Info Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">

                    {[
                      { label: "Mobile Number", value: selectedCRP.mobile },
                      { label: "Email Address", value: selectedCRP.email },
                      { label: "District", value: selectedCRP.district },
                      { label: "Taluka", value: selectedCRP.taluka },
                      { label: "Block", value: selectedCRP.block },
                      { label: "Villages Covered", value: selectedCRP.villages },
                    
                     
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          {item.label}
                        </p>
                        <p className="text-slate-900 font-medium break-words">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== Footer ===== */}
                <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-xl border text-sm font-semibold hover:bg-slate-100"
                  >
                    Close
                  </button>


                </div>
              </motion.div>
            </div>
          )}



        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
