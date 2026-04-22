import React, { useState, useMemo, useCallback } from "react";
import { Plus, Mail, Search, ChevronDown, Download, MoreVertical } from "lucide-react";
import { exportToExcel } from "../../../lib/exportToExcel";

export default function EventParticipantsTab({ participants, onAddParticipant }) {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = districtFilter === "all" || p.district === districtFilter;
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [participants, searchTerm, districtFilter, typeFilter]);

  const handleSelectAll = useCallback((checked) => {
    setSelectedAll(checked);
    if (checked) {
      setSelectedIds(filteredParticipants.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  }, [filteredParticipants]);

  const handleSelectOne = useCallback((id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
      setSelectedAll(false);
    }
  }, []);

  const handleExport = useCallback(() => {
    exportToExcel({
      title: "Goa Event Management — Participants Report",
      headers: ["Name", "Email", "Phone", "Type", "District", "Organization", "Events Attended"],
      rows: filteredParticipants.map(p => [
        p.name, p.email, p.phone, p.type,
        p.district, p.organization || "N/A", p.events,
      ]),
      filename: "goa_event_participants_report",
    });
  }, [filteredParticipants]);

  const handleSendNotification = useCallback(() => {
    if (selectedIds.length === 0) {
      alert("Please select participants to send notification");
      return;
    }
    alert(`Sending notification to ${selectedIds.length} selected participant(s)`);
  }, [selectedIds]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-slate-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Participant Database</h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">Directory of CRPs and external members</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAddParticipant}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Participant
            </button>
            <button
              onClick={handleSendNotification}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Send Mail ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-8 border-b border-slate-100 bg-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-tech-blue-500/10 focus:border-tech-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="pl-5 pr-12 py-3 text-sm font-bold text-slate-700 border-2 border-slate-100 rounded-2xl focus:border-tech-blue-500 outline-none appearance-none bg-white transition-all"
              >
                <option value="all">All Districts</option>
                <option value="North Goa">North Goa</option>
                <option value="South Goa">South Goa</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-5 pr-12 py-3 text-sm font-bold text-slate-700 border-2 border-slate-100 rounded-2xl focus:border-tech-blue-500 outline-none appearance-none bg-white transition-all"
              >
                <option value="all">All Types</option>
                <option value="CRP">CRP Only</option>
                <option value="External">External Only</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={handleExport}
              className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Select All Row */}
      <div className="px-10 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedAll ? 'bg-tech-blue-600 border-tech-blue-600' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="hidden"
            />
            {selectedAll && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Select All ({filteredParticipants.length})
          </span>
        </label>
      </div>

      {/* Database List */}
      <div className="divide-y divide-slate-100 px-4">
        {filteredParticipants.map((participant) => (
          <div key={participant.id} className="p-6 hover:bg-slate-50/80 rounded-2xl transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => handleSelectOne(participant.id, !selectedIds.includes(participant.id))}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${selectedIds.includes(participant.id) ? 'bg-tech-blue-600 border-tech-blue-600' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}
                >
                  {selectedIds.includes(participant.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </div>
                
                <div className="relative shrink-0">
                  <img src={participant.avatar} alt={participant.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-tech-blue-600 transition-colors">{participant.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{participant.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-center hidden lg:block">
                  <p className="text-sm font-black text-slate-900">{participant.district}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                </div>
                
                <div className="text-center hidden lg:block">
                  <p className="text-sm font-black text-slate-900">{participant.events}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Events</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                    participant.type === "CRP" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-purple-50 text-purple-700 border-purple-100"
                  }`}>
                    {participant.type}
                  </span>
                  
                  <button className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
