import React, { useState, useMemo, useCallback } from "react";
import { Users, CheckCircle2, XCircle, Clock, TrendingUp, Search, Download, QrCode } from "lucide-react";
import { exportToExcel } from "../../../lib/exportToExcel";

export default function EventAttendanceTab({ events, participants }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || null);

  // Mock attendance data (in a real app this would be fetched based on selectedEvent)
  const [mockAttendance] = useState([
    { id: 1, name: "Sunita Naik",    crpId: "CRP-NG-001", district: "North Goa", status: "present", time: "09:45 AM", avatar: "https://i.pravatar.cc/150?u=sunita" },
    { id: 2, name: "Ramesh Desai",   crpId: "CRP-NG-002", district: "North Goa", status: "late",    time: "10:15 AM", avatar: "https://i.pravatar.cc/150?u=ramesh" },
    { id: 3, name: "Priya Fernandes", crpId: "CRP-SG-003", district: "South Goa", status: "present", time: "09:30 AM", avatar: "https://i.pravatar.cc/150?u=priya" },
    { id: 4, name: "Anil Gawas",      crpId: "CRP-SG-004", district: "South Goa", status: "absent",  time: "-",        avatar: "https://i.pravatar.cc/150?u=anil" },
    { id: 5, name: "Kavita Sawant",   crpId: "CRP-NG-005", district: "North Goa", status: "pending", time: "-",        avatar: "https://i.pravatar.cc/150?u=kavita" },
    { id: 6, name: "Dr. Suresh Rao",  crpId: "EXT-001",    district: "North Goa", status: "present", time: "09:50 AM", avatar: "https://i.pravatar.cc/150?u=suresh" },
  ]);

  const stats = useMemo(() => {
    const total = mockAttendance.length;
    const present = mockAttendance.filter(a => a.status === "present").length;
    const absent = mockAttendance.filter(a => a.status === "absent").length;
    const late = mockAttendance.filter(a => a.status === "late").length;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return [
      { label: "Total",   value: total.toString(), icon: Users,        color: "text-slate-600 bg-slate-50 border-slate-100" },
      { label: "Present", value: present.toString(), icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
      { label: "Absent",  value: absent.toString(),  icon: XCircle,      color: "text-rose-600 bg-rose-50 border-rose-100" },
      { label: "Late",    value: late.toString(),    icon: Clock,        color: "text-amber-600 bg-amber-50 border-amber-100" },
      { label: "Rate",    value: `${rate}%`,       icon: TrendingUp,   color: "text-blue-600 bg-blue-50 border-blue-100" },
    ];
  }, [mockAttendance]);

  const filteredAttendance = useMemo(() =>
    mockAttendance.filter((item) =>
      statusFilter === "all" ? true : item.status === statusFilter
    ), [mockAttendance, statusFilter]
  );

  const handleExport = useCallback(() => {
    exportToExcel({
      title: "Goa Event Management — Attendance Report",
      headers: ["Name", "CRP ID", "District", "Status", "Time"],
      rows: mockAttendance.map(item => [
        item.name, item.crpId, item.district, item.status, item.time,
      ]),
      filename: "goa_event_attendance_report",
    });
  }, [mockAttendance]);

  const currentEvent = events.find(e => e.id === selectedEvent);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Attendance Tracker</h2>
            <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tech-blue-500"></span>
              {currentEvent?.title || "Event Not Selected"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95">
              <QrCode className="w-4 h-4" />
              QR Scanner
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50/50">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-5 rounded-2xl border shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="px-8 py-6 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or CRP ID..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {["all", "present", "absent", "late", "pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-6 py-2 text-xs font-bold rounded-full border-2 transition-all whitespace-nowrap uppercase tracking-widest ${statusFilter === filter
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 px-4">
        {filteredAttendance.map((item) => (
          <div key={item.id} className="p-6 hover:bg-slate-50/80 rounded-2xl transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center ${
                    item.status === 'present' ? 'bg-emerald-500' : item.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    {item.status === 'present' ? <CheckCircle2 size={10} className="text-white" /> : <XCircle size={10} className="text-white" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-tech-blue-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">{item.crpId}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-xs font-bold text-slate-500">{item.district}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900">{item.time}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival Time</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border-2 ${item.status === "present"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : item.status === "late"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : item.status === "absent"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                  {item.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
