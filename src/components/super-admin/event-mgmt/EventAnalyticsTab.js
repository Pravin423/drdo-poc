import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Star, Target, ThumbsUp, TrendingUp, Award, Download, MessageSquare } from "lucide-react";

export default function EventAnalyticsTab({ events, participants }) {
  const selectedEvent = events[0];

  const metrics = [
    { label: "Attendance Rate",  value: "87.5%", icon: Users,      color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Average Feedback", value: "4.3/5", icon: Star,       color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Completion Rate",  value: "92%",   icon: Target,     color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Satisfaction",     value: "89%",   icon: ThumbsUp,   color: "text-violet-600 bg-violet-50 border-violet-100" },
  ];

  const topPerformers = [
    { rank: 1, name: "Priya Fernandes", crpId: "CRP-SG-003", score: "96%" },
    { rank: 2, name: "Sunita Naik",    crpId: "CRP-NG-001", score: "94%" },
    { rank: 3, name: "Kavita Sawant",   crpId: "CRP-NG-005", score: "91%" },
  ];

  const feedbackSummary = [
    { category: "Content Quality", rating: "4.5/5", percentage: 90 },
    { category: "Facilitator Effectiveness", rating: "4.2/5", percentage: 84 },
    { category: "Venue & Facilities", rating: "4/5", percentage: 80 },
    { category: "Overall Experience", rating: "4.3/5", percentage: 86 },
  ];

  const handleExportReport = useCallback(() => {
    alert("Exporting analytics report as CSV...");
  }, []);

  const handleGenerateCertificates = useCallback(() => {
    alert("Generating certificates for 32 participants...");
  }, []);

  const handleDownloadAll = useCallback(() => {
    alert("Downloading all certificates...");
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
            <p className="text-sm font-semibold text-slate-500">{selectedEvent?.title || "Event Performance Summary"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={handleGenerateCertificates}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Award className="w-4 h-4" />
              Issue Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group hover:shadow-xl transition-all duration-300"
          >
            <div className={`${metric.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border shadow-sm group-hover:scale-110 transition-transform`}>
              <metric.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{metric.label}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-black text-slate-900 tracking-tight">{metric.value}</p>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Top Performers</h3>
          </div>
          <div className="space-y-6">
            {topPerformers.map((performer) => (
              <div key={performer.rank} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                    performer.rank === 1 ? "bg-amber-100 text-amber-700 ring-2 ring-amber-50" : 
                    performer.rank === 2 ? "bg-slate-100 text-slate-700 ring-2 ring-slate-50" : 
                    "bg-orange-100 text-orange-700 ring-2 ring-orange-50"
                  }`}>
                    #{performer.rank}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800">{performer.name}</h4>
                    <p className="text-xs font-bold text-slate-400 font-mono tracking-wider">{performer.crpId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900 tracking-tight">{performer.score}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Feedback Breakdown</h3>
          </div>
          <div className="space-y-8">
            {feedbackSummary.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-700">{item.category}</h4>
                  <span className="text-sm font-black text-slate-900">{item.rating}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-tech-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Issuance Section */}
      <div className="bg-gradient-to-r from-[#1a2e7a] to-[#3b52ab] rounded-3xl p-10 shadow-xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white tracking-tight">Bulk Certificates</h3>
              <p className="text-blue-100 font-medium opacity-90">32 participants are eligible for completion certificates.</p>
            </div>
          </div>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-3 px-8 py-4 text-sm font-black text-[#1a2e7a] bg-white rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          >
            <Download className="w-5 h-5" />
            Download All
          </button>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
