import { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  MapPin, 
  User, 
  CornerDownRight,
  AlertCircle,
  Paperclip,
  CheckCircle
} from "lucide-react";
import DashboardLayout from "../../../components/DashboardLayout";
import { 
  FormModal, 
  FormHeader, 
  FormSelect, 
  FormTextArea, 
  FormActions, 
  FormInput 
} from "../../../components/common/FormUI";

// Mock Data for Escalated Tickets
const MOCK_ESCALATIONS = [
  {
    id: "ESC-8041",
    blockManager: "Amit Dessai",
    block: "Salcete",
    district: "South Goa",
    subject: "Critical: SHG Data Sync Failure",
    preview: "Multiple CRPs in my block are reporting that their offline SHG meeting data is completely wiped when they connect to the internet. Please advise technical team immediately.",
    fullMessage: "Dear SPM,\n\nFor the past 48 hours, at least 15 CRPs operating in the remote areas of Salcete have reported a severe application bug. When they conduct offline meetings and return to areas with network coverage to sync, the app crashes and wipes the local storage cache.\n\nThis is causing massive data loss and operational delays. I cannot resolve this at the block level. Please escalate to the development team urgently.\n\nRegards,\nAmit",
    priority: "High",
    status: "unresolved",
    timestamp: "10:45 AM",
    date: "Today",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
  },
  {
    id: "ESC-8039",
    blockManager: "Sneha Prabhu",
    block: "Bardez",
    district: "North Goa",
    subject: "Requesting Budget Approval for Training",
    preview: "We have onboarded 30 new CRPs and need state-level approval for the upcoming 3-day orientation budget.",
    fullMessage: "Hello,\n\nThe recent recruitment drive in Bardez was highly successful. However, the block budget for orientation training has been exhausted. We need emergency approval for an additional ₹45,000 to cover the 3-day residential training costs for the 30 new CRPs.\n\nPlease find the attached breakdown of costs in the system. Awaiting your approval to proceed.\n\nThanks,\nSneha",
    priority: "Medium",
    status: "unresolved",
    timestamp: "14:20 PM",
    date: "Yesterday",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
  },
  {
    id: "ESC-8032",
    blockManager: "Vishal Kadam",
    block: "Pernem",
    district: "North Goa",
    subject: "Honorarium Dispute - Block 4",
    preview: "Several CRPs are disputing their calculated honorarium for last month regarding village mapping tasks.",
    fullMessage: "Sir,\n\nWe have a conflict regarding the honorarium disbursed on the 1st of this month. 5 CRPs are claiming they mapped 12 extra SHGs that did not reflect in the final finance report.\n\nI have verified their physical logbooks and they match their claims. It seems the API failed to register the tasks. I need state-admin override to manually credit their accounts.\n\nVishal",
    priority: "High",
    status: "resolved",
    timestamp: "09:15 AM",
    date: "May 8",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal",
  },
  {
    id: "ESC-8030",
    blockManager: "Pooja Naik",
    block: "Ponda",
    district: "South Goa",
    subject: "Application for Extended Leave",
    preview: "I am requesting a 3-week medical leave. Please reassign my block duties temporarily.",
    fullMessage: "Dear Program Manager,\n\nI need to undergo an urgent medical procedure and will require 3 weeks of leave starting next Monday. I have attached my medical certificates to my HR profile.\n\nKindly approve the leave and assign an acting manager for Ponda block during my absence to ensure operations continue smoothly.\n\nRegards,\nPooja",
    priority: "Low",
    status: "unresolved",
    timestamp: "16:45 PM",
    date: "May 5",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja",
  }
];

export default function EscalationsInbox() {
  const [activeTab, setActiveTab] = useState("unresolved");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(MOCK_ESCALATIONS[0]);
  const [tickets, setTickets] = useState(MOCK_ESCALATIONS);

  // UI Interactivity States
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  // Priority Management Form State
  const [newPriority, setNewPriority] = useState("Medium");
  const [priorityComment, setPriorityComment] = useState("");

  // Escalation Management Form State
  const [spmName, setSpmName] = useState("Dr. Kiran Rao (Super Admin)");
  const [escalateComment, setEscalateComment] = useState("");
  const [attachment, setAttachment] = useState(null);

  const filteredTickets = tickets.filter(t => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.blockManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "High": return <span className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600"><AlertCircle size={12}/> High</span>;
      case "Medium": return <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium</span>;
      case "Low": return <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Low</span>;
      default: return null;
    }
  };

  const handleResolve = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "resolved" } : t));
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: "resolved" });
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Escalations | DRDA Goa</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] flex flex-col bg-white border border-slate-200 shadow-sm mt-2 sm:rounded-2xl overflow-hidden">
        
        {/* Premium Top Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-5">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
              Escalations
            </h1>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center p-1 bg-slate-100 rounded-xl shadow-inner">
              {['unresolved', 'resolved', 'all'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-bold capitalize rounded-lg transition-all duration-200 ${
                    activeTab === tab 
                      ? "bg-white text-indigo-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {tab === 'unresolved' ? 'Open' : tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 placeholder:text-slate-400 font-medium"
              />
            </div>
            <button className="flex items-center justify-center w-9 h-9 text-slate-500 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Premium Inbox Split View */}
        <div className="flex flex-1 overflow-hidden bg-white">
          
          {/* Left Panel: Ticket List */}
          <div className="w-full md:w-[400px] border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/50 relative z-10">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="font-bold text-slate-700 text-base">Inbox Zero</p>
                  <p className="text-sm mt-1 text-slate-500">No tickets in this view.</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {filteredTickets.map(ticket => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 relative group border ${
                        selectedTicket?.id === ticket.id 
                          ? "bg-white border-indigo-200 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] ring-1 ring-indigo-50" 
                          : "bg-transparent border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm"
                      }`}
                    >
                      {selectedTicket?.id === ticket.id && (
                        <motion.div layoutId="active-ticket-dot" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                      )}
                      
                      <div className="flex justify-between items-baseline mb-2">
                        <span className={`text-sm font-bold truncate ${selectedTicket?.id === ticket.id ? "text-indigo-900" : "text-slate-800"}`}>
                          {ticket.blockManager}
                        </span>
                        <span className={`text-[10px] font-bold whitespace-nowrap ml-2 ${selectedTicket?.id === ticket.id ? "text-indigo-500" : "text-slate-400"}`}>
                          {ticket.date}
                        </span>
                      </div>
                      
                      <h4 className={`text-[13px] font-bold truncate mb-1.5 ${ticket.status === 'resolved' ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 pr-2 mb-3 leading-relaxed font-medium">
                        {ticket.preview}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100/80 px-2 py-0.5 rounded-md">
                          {ticket.id}
                        </span>
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Ticket Detail View */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
            {selectedTicket ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedTicket.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full overflow-y-auto custom-scrollbar"
                >
                  
                  {/* Premium Reading Pane Header */}
                  <div className="px-10 py-8 border-b border-slate-100 shrink-0 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                          selectedTicket.status === 'resolved' 
                            ? 'bg-slate-100 text-slate-500' 
                            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        }`}>
                          {selectedTicket.status === 'resolved' ? 'Closed' : 'Open Ticket'}
                        </span>
                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">#{selectedTicket.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTicket.status !== 'resolved' && (
                          <button 
                            onClick={() => handleResolve(selectedTicket.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            <CheckCircle2 size={16} /> Resolve
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={() => setShowActionDropdown(!showActionDropdown)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all shadow-sm ${
                              showActionDropdown 
                                ? "bg-slate-100 border-slate-300 text-indigo-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" 
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                            }`}
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <AnimatePresence>
                            {showActionDropdown && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowActionDropdown(false)} />
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden transform origin-top-right"
                                >
                                  <button 
                                    onClick={() => {
                                      setShowActionDropdown(false);
                                      setNewPriority(selectedTicket.priority);
                                      setShowPriorityModal(true);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                                  >
                                    <AlertCircle size={16} className="text-slate-400" />
                                    Change Priority
                                  </button>
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button 
                                    onClick={() => {
                                      setShowActionDropdown(false);
                                      setShowEscalateModal(true);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 flex items-center gap-2.5 transition-colors"
                                  >
                                    <CornerDownRight size={16} className="text-rose-500" />
                                    Escalate to Superadmin
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                      {selectedTicket.subject}
                    </h2>

                    {/* Sender Info */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={selectedTicket.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {selectedTicket.blockManager}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Block Admin • <span className="text-slate-700">{selectedTicket.block}, {selectedTicket.district}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[13px] font-bold text-slate-700">{selectedTicket.date}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedTicket.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="px-10 py-8 flex-1">
                    <div className="prose prose-slate prose-sm max-w-none">
                      {selectedTicket.fullMessage.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-slate-700 text-[15px] leading-relaxed mb-5">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Premium Attachment */}
                    {selectedTicket.priority === "High" && (
                      <div className="mt-10 flex items-center gap-4 p-4 border border-slate-200 rounded-2xl inline-flex hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all bg-white group">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Paperclip size={18} />
                        </div>
                        <div className="pr-4">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">error_logs_v2.pdf</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">1.2 MB • PDF Document</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Premium Reply Box */}
                  <div className="p-8 bg-slate-50/80 border-t border-slate-100 shrink-0">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all flex flex-col">
                      <textarea 
                        placeholder="Write a response..." 
                        className="w-full h-28 p-5 text-sm text-slate-700 focus:outline-none resize-none custom-scrollbar placeholder:text-slate-400 font-medium bg-transparent"
                      />
                      <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Paperclip size={16} />
                          </button>
                        </div>
                        <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5">
                          Send Reply <CornerDownRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-600">No ticket selected</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Select an escalation from the list to view details.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Change Priority Modal */}
      <FormModal isOpen={showPriorityModal} onClose={() => setShowPriorityModal(false)}>
        <FormHeader 
          title="Update Priority" 
          subtitle={`Ticket #${selectedTicket?.id}`} 
          icon={AlertCircle}
          onClose={() => setShowPriorityModal(false)}
        />
        <div className="p-8 space-y-6 overflow-y-auto">
          <FormSelect 
            label="Select Priority Level"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            options={[
              { value: "High", label: "High Priority" },
              { value: "Medium", label: "Medium Priority" },
              { value: "Low", label: "Low Priority" }
            ]}
          />
          <FormTextArea 
            label="Justification Comment"
            placeholder="Provide reasoning for updating the priority level..."
            value={priorityComment}
            onChange={(e) => setPriorityComment(e.target.value)}
          />
          <FormActions 
            onCancel={() => setShowPriorityModal(false)}
            onConfirm={() => {
              setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, priority: newPriority } : t));
              setSelectedTicket(prev => ({ ...prev, priority: newPriority }));
              setShowPriorityModal(false);
              setPriorityComment("");
            }}
            confirmText="Save Changes"
          />
        </div>
      </FormModal>

      {/* Escalate to Superadmin Modal */}
      <FormModal isOpen={showEscalateModal} onClose={() => setShowEscalateModal(false)}>
        <FormHeader 
          title="Escalate to Superadmin" 
          subtitle={`Forwarding Ticket #${selectedTicket?.id}`} 
          icon={CornerDownRight}
          onClose={() => setShowEscalateModal(false)}
        />
        <div className="p-8 space-y-6 overflow-y-auto">
          <FormInput 
            label="Forwarded to (SPM Name)"
            value={spmName}
            disabled
            readOnly
            icon={User}
          />
          <FormTextArea 
            label="Escalation Details / Comments"
            placeholder="Provide supporting details to assist the Superadmin in resolving..."
            value={escalateComment}
            onChange={(e) => setEscalateComment(e.target.value)}
          />
          
          <div className="space-y-2 font-sans">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Attach Supporting Document
            </label>
            <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-6 text-center flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/20 transition-all duration-200 cursor-pointer relative group/attach">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
              <Paperclip size={24} className="text-slate-400 mb-2 group-hover/attach:text-indigo-500 transition-colors" />
              <p className="text-xs font-bold text-slate-700">
                {attachment ? attachment.name : "Click to upload file or drag and drop"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, DOC, XLS, PNG or ZIP up to 20MB</p>
            </div>
          </div>

          <FormActions 
            onCancel={() => setShowEscalateModal(false)}
            onConfirm={() => {
              setShowEscalateModal(false);
              setEscalateComment("");
              setAttachment(null);
            }}
            confirmText="Forward & Escalate"
          />
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
