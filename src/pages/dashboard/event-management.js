"use client";

import { useState, useCallback, useMemo,useEffect  } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Plus,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  LayoutDashboard,
  X,
  Trash2,
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { exportToExcel } from "../../lib/exportToExcel";

// Components
import EventOverviewStats from "../../components/super-admin/event-mgmt/EventOverviewStats";
import EventListTab from "../../components/super-admin/event-mgmt/EventListTab";
import EventDetailsModal from "../../components/super-admin/event-mgmt/EventDetailsModal";
import EventParticipantsTab from "../../components/super-admin/event-mgmt/EventParticipantsTab";
import EventAnalyticsTab from "../../components/super-admin/event-mgmt/EventAnalyticsTab";
import CreateEventModal from "../../components/super-admin/event-mgmt/CreateEventModal";
import AddParticipantModal from "../../components/super-admin/event-mgmt/AddParticipantModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function EventManagement() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "delete", // 'delete' or 'close'
    onConfirm: () => {},
  });

  // Events state
  const [events, setEvents] = useState([]);

  // Participants state (keeping as mock for now unless API provided)
  const [participants, setParticipants] = useState([
    { id: 1, name: "Sunita Naik", email: "sunita.naik@example.com", phone: "+91 9876543210", type: "CRP", district: "North Goa", organization: "", events: 12, avatar: "https://i.pravatar.cc/150?u=sunita" },
    { id: 2, name: "Ramesh Desai", email: "ramesh.desai@example.com", phone: "+91 9876543211", type: "CRP", district: "North Goa", organization: "", events: 8, avatar: "https://i.pravatar.cc/150?u=ramesh" },
    { id: 3, name: "Priya Fernandes", email: "priya.fernandes@example.com", phone: "+91 9876543212", type: "CRP", district: "South Goa", organization: "", events: 15, avatar: "https://i.pravatar.cc/150?u=priya" },
    { id: 4, name: "Anil Gawas", email: "anil.gawas@example.com", phone: "+91 9876543213", type: "CRP", district: "South Goa", organization: "", events: 6, avatar: "https://i.pravatar.cc/150?u=anil" },
    { id: 5, name: "Kavita Sawant", email: "kavita.sawant@example.com", phone: "+91 9876543214", type: "CRP", district: "North Goa", organization: "", events: 10, avatar: "https://i.pravatar.cc/150?u=kavita" },
    { id: 6, name: "Dr. Suresh Rao", email: "suresh.rao@ngo.org", phone: "+91 9876543215", type: "External", district: "North Goa", organization: "Health NGO", events: 3, avatar: "https://i.pravatar.cc/150?u=suresh" },
  ]);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events?_t=${Date.now()}`);
      const result = await res.json();
      
      if (result.status === 1 && result.data?.events?.data) {
        const mappedEvents = result.data.events.data.map(e => ({
          id: e.id,
          title: e.title,
          type: e.type || "Meeting",
          date: e.start_datetime ? e.start_datetime.split('T')[0] : "",
          startTime: e.start_datetime ? e.start_datetime.split('T')[1].substring(0, 5) : "",
          endTime: e.end_datetime ? e.end_datetime.split('T')[1].substring(0, 5) : "",
          endDate: e.end_datetime ? e.end_datetime.split('T')[0] : "",
          venue: e.location || e.village || "N/A",
          district: e.district || "N/A",
          block: e.taluka || "N/A",
          facilitator: e.primary_coordinator_id ? `Coordinator #${e.primary_coordinator_id}` : "Admin",
          capacity: 0,
          description: e.description || "",
          status: e.status || "upcoming",
          participants_count: e.participants_count || 0
        }));
        setEvents(mappedEvents);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = useCallback((newEvent) => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setShowCreateEventModal(false);
  }, []);

  const handleAddParticipant = useCallback((newParticipant) => {
    setParticipants(prev => [...prev, {
      ...newParticipant,
      id: Date.now(),
      events: 0,
      avatar: `https://i.pravatar.cc/150?u=${newParticipant.email}`,
    }]);
    setShowAddParticipantModal(false);
  }, []);

  const handleCloseEvent = useCallback(async (event) => {
    setConfirmModal({
      isOpen: true,
      title: "Close Event?",
      message: `Are you sure you want to mark "${event.title}" as closed? This will move it to the Closed tab and prevent further changes.`,
      type: "close",
      confirmText: "Yes, Close",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/events?action=close-event&id=${event.id}`, {
            method: "POST"
          });
          const result = await res.json();
          if (result.status === 1) {
            fetchEvents();
          }
        } catch (err) {
          console.error("Close event error:", err);
        }
      }
    });
  }, [fetchEvents]);

  const handleDeleteEvent = useCallback(async (event) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Event?",
      message: `This action cannot be undone. Are you sure you want to permanently delete "${event.title}"?`,
      type: "delete",
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/events?id=${event.id}`, {
            method: "DELETE"
          });
          const result = await res.json();
          if (result.status === 1) {
            fetchEvents();
          }
        } catch (err) {
          console.error("Delete event error:", err);
        }
      }
    });
  }, [fetchEvents]);

  const handleExportReports = useCallback(() => {
    exportToExcel({
      title: "Goa Event Management — Events Report",
      headers: ["Title", "Type", "Date", "Start Time", "End Time", "Venue", "District", "Block", "Facilitator", "Capacity"],
      rows: events.map(event => [
        event.title, event.type, event.date, event.startTime,
        event.endTime, event.venue, event.district,
        event.block || "N/A", event.facilitator, event.capacity,
      ]),
      filename: "goa_event_reports",
    });
  }, [events]);

  const stats = useMemo(() => {
    const now = new Date();
    const futureEvents = events.filter(e => new Date(e.date) > now);
    return {
      totalEvents: events.length,
      totalParticipants: participants.length,
      upcomingEvents: futureEvents.length,
      certificatesIssued: Math.floor(participants.length * 0.89),
    };
  }, [events, participants]);

  const tabs = [
    { id: "all",          label: "All Events",  icon: LayoutDashboard },
    { id: "upcoming",     label: "Upcoming",    icon: Calendar },
    { id: "ongoing",      label: "Ongoing",     icon: Clock },
    { id: "completed",    label: "Completed",   icon: CheckCircle2 },
    { id: "closed",       label: "Closed",      icon: X },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (activeTab === "all") return true;
      
      // Normalize status check
      const eventStatus = e.status?.toLowerCase();
      const tabStatus = activeTab.toLowerCase();

      // Priority 1: Match by explicit status from API
      if (eventStatus === tabStatus) return true;

      // Special case: 'completed' often matches 'closed' in some systems, 
      // but here we keep them separate as per request.
      
      // Priority 2: Fallback to date logic for standard tabs if status doesn't match
      const today = new Date().toISOString().split('T')[0];
      if (activeTab === "upcoming" && !eventStatus) return e.date > today;
      if (activeTab === "ongoing" && !eventStatus) return e.date === today;
      if (activeTab === "completed" && !eventStatus) return e.date < today;
      
      return false;
    });
  }, [events, activeTab]);

  return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-6 lg:p-8">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Event <span className="bg-gradient-to-br from-[#1a2e7a] to-[#3b52ab] bg-clip-text text-transparent">Management</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] opacity-60">
                Strategic Training & Community Engagement Portal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportReports}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              {!isViewOnly && (
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <EventOverviewStats stats={stats} />

          {/* Tab Navigation */}
          <div className="flex p-1.5 bg-slate-100/50 rounded-[2rem] w-fit backdrop-blur-md border border-slate-200/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300
                  ${activeTab === tab.id
                    ? "bg-white text-[#1a2e7a] shadow-xl shadow-slate-200 ring-1 ring-slate-100 scale-105"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >

              {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-tech-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Fetching Events...</p>
                </div>
              ) : (
                (activeTab === "all" || activeTab === "upcoming" || activeTab === "ongoing" || activeTab === "completed" || activeTab === "closed") && (
                  <EventListTab
                    status={activeTab}
                    events={filteredEvents}
                    onEventAction={(event) => {
                      setSelectedEventForDetails(event);
                      setShowDetailsModal(true);
                    }}
                    onCloseEvent={handleCloseEvent}
                    onDeleteEvent={handleDeleteEvent}
                    isViewOnly={isViewOnly}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <AnimatePresence>
        {showCreateEventModal && (
          <CreateEventModal
            isOpen={showCreateEventModal}
            onClose={() => setShowCreateEventModal(false)}
            onSave={handleAddEvent}
          />
        )}
        {showAddParticipantModal && (
          <AddParticipantModal
            isOpen={showAddParticipantModal}
            onClose={() => setShowAddParticipantModal(false)}
            onSave={handleAddParticipant}
          />
        )}
        {showDetailsModal && (
          <EventDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            event={selectedEventForDetails}
          />
        )}
      </AnimatePresence>

      {/* Shared Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
      />
    </ProtectedRoute>
  );
}
