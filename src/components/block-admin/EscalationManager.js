import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SummaryCard from '../common/SummaryCard'
import { AlertCircle, Send, MessageSquare, Clock, CheckCircle2, ChevronRight, Filter, Plus, X, ShieldAlert } from 'lucide-react'

export default function EscalationManager({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock Data
  const escalations = [
    { id: 'ESC001', subject: 'Delay in SHG Mapping Data', category: 'Data Issues', priority: 'High', status: 'In Review', date: '2026-04-28', description: 'Significant delay in receiving mapped SHG data from the Pernem block CRPs.' },
    { id: 'ESC002', subject: 'GIS Location Accuracy', category: 'Technical', priority: 'Medium', status: 'Resolved', date: '2026-04-25', description: 'CRP locations showing 50m+ error in deep village areas.' },
    { id: 'ESC003', subject: 'Honorarium Discrepancy', category: 'Finance', priority: 'Critical', status: 'Pending', date: '2026-04-29', description: 'CRP Rajesh Kumar reporting 2 days missing in honorarium calculation.' },
  ];

  const filteredEscalations = activeFilter === 'all' 
    ? escalations 
    : escalations.filter(e => e.status.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Escalations <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Manager</span>
          </h1>
          <p className="text-slate-500 font-medium">Escalate critical issues directly to the SPM for immediate intervention.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#3b52ab] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} /> New Escalation
        </button>
      </div>

      {/* Stats Summary using SummaryCard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Escalations" 
          value={escalations.length} 
          icon={MessageSquare} 
          variant="blue" 
          delay={0.1} 
        />
        <SummaryCard 
          title="High Priority" 
          value={escalations.filter(e => e.priority === 'High' || e.priority === 'Critical').length} 
          icon={ShieldAlert} 
          variant="rose" 
          delay={0.2} 
        />
        <SummaryCard 
          title="In Review" 
          value={escalations.filter(e => e.status === 'In Review').length} 
          icon={Clock} 
          variant="amber" 
          delay={0.3} 
        />
        <SummaryCard 
          title="Resolved" 
          value={escalations.filter(e => e.status === 'Resolved').length} 
          icon={CheckCircle2} 
          variant="emerald" 
          delay={0.4} 
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
        {['all', 'pending', 'in review', 'resolved'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeFilter === filter ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Active Escalations</h3>
          <Filter size={18} className="text-slate-400" />
        </div>
        <div className="divide-y divide-slate-100">
          <AnimatePresence mode="wait">
            {filteredEscalations.length > 0 ? (
              filteredEscalations.map((esc, i) => (
                <motion.div
                  key={esc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 hover:bg-slate-50/50 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                          esc.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          esc.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {esc.priority} Priority
                        </span>
                        <span className="text-xs font-bold text-slate-300">|</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{esc.category}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {esc.subject}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed max-w-2xl">
                          {esc.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={14} /> {esc.date}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <MessageSquare size={14} /> {esc.id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                          esc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          esc.status === 'In Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {esc.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          {esc.status}
                        </div>
                      </div>
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all group/btn">
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <AlertCircle size={32} />
                </div>
                <p className="text-slate-400 font-medium">No escalations found for the selected filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Escalation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10 border border-slate-200"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">New <span className="text-rose-600">Escalation</span></h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Provide detailed info for SPM review.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject / Issue Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Critical mapping delay in Bicholim Block"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none">
                        <option>Technical Issue</option>
                        <option>Data Discrepancy</option>
                        <option>Operational Delay</option>
                        <option>Finance/Honorarium</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                    <textarea 
                      placeholder="Describe the issue in detail, including specific CRP IDs or village names if applicable..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-rose-500 transition-all min-h-[150px] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                  >
                    <Send size={18} /> Send to SPM
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
