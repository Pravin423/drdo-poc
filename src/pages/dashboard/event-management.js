"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Plus,
  Download,
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import { exportToExcel } from "../../lib/exportToExcel";

// Components
import EventOverviewStats from "../../components/super-admin/event-mgmt/EventOverviewStats";
import EventCalendarTab from "../../components/super-admin/event-mgmt/EventCalendarTab";
import EventAttendanceTab from "../../components/super-admin/event-mgmt/EventAttendanceTab";
import EventParticipantsTab from "../../components/super-admin/event-mgmt/EventParticipantsTab";
import EventAnalyticsTab from "../../components/super-admin/event-mgmt/EventAnalyticsTab";
import CreateEventModal from "../../components/super-admin/event-mgmt/CreateEventModal";
import AddParticipantModal from "../../components/super-admin/event-mgmt/AddParticipantModal";

export default function EventManagement() {
  const router = useRouter();
  const isViewOnly = router.query.viewOnly === "true";

  const [activeTab, setActiveTab] = useState("calendar");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // Events state
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Health & Nutrition Training",
      type: "training",
      date: "2026-01-28",
      startTime: "09:00",
      endTime: "17:00",
      venue: "Community Hall, Margao",
      district: "South Goa",
      block: "Margao",
      facilitator: "Dr. Maria Fernandes",
      capacity: 50,
      description: "Comprehensive health and nutrition training for CRPs",
      materials: "Handbooks, Charts, Projector",
      allowExternal: true,
    },
  ]);

  // Participants state
  const [participants, setParticipants] = useState([
    { id: 1, name: "Sunita Naik", email: "sunita.naik@example.com", phone: "+91 9876543210", type: "CRP", district: "North Goa", organization: "", events: 12, avatar: "https://i.pravatar.cc/150?u=sunita" },
    { id: 2, name: "Ramesh Desai", email: "ramesh.desai@example.com", phone: "+91 9876543211", type: "CRP", district: "North Goa", organization: "", events: 8, avatar: "https://i.pravatar.cc/150?u=ramesh" },
    { id: 3, name: "Priya Fernandes", email: "priya.fernandes@example.com", phone: "+91 9876543212", type: "CRP", district: "South Goa", organization: "", events: 15, avatar: "https://i.pravatar.cc/150?u=priya" },
    { id: 4, name: "Anil Gawas", email: "anil.gawas@example.com", phone: "+91 9876543213", type: "CRP", district: "South Goa", organization: "", events: 6, avatar: "https://i.pravatar.cc/150?u=anil" },
    { id: 5, name: "Kavita Sawant", email: "kavita.sawant@example.com", phone: "+91 9876543214", type: "CRP", district: "North Goa", organization: "", events: 10, avatar: "https://i.pravatar.cc/150?u=kavita" },
    { id: 6, name: "Dr. Suresh Rao", email: "suresh.rao@ngo.org", phone: "+91 9876543215", type: "External", district: "North Goa", organization: "Health NGO", events: 3, avatar: "https://i.pravatar.cc/150?u=suresh" },
  ]);

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
    { id: "calendar",     label: "Event Calendar", icon: "Calendar" },
    { id: "attendance",   label: "Attendance",     icon: "FileCheck" },
    { id: "participants", label: "Participants",   icon: "Users" },
    { id: "analytics",    label: "Analytics",      icon: "BarChart3" },
  ];

  return (
    <ProtectedRoute allowedRole="super-admin">
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
              {activeTab === "calendar" && (
                <EventCalendarTab events={events} onCreateEvent={() => setShowCreateEventModal(true)} isViewOnly={isViewOnly} />
              )}
              {activeTab === "attendance" && (
                <EventAttendanceTab events={events} participants={participants} />
              )}
              {activeTab === "participants" && (
                <EventParticipantsTab participants={participants} onAddParticipant={() => setShowAddParticipantModal(true)} isViewOnly={isViewOnly} />
              )}
              {activeTab === "analytics" && (
                <EventAnalyticsTab events={events} participants={participants} />
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
      </AnimatePresence>
    </ProtectedRoute>
  );
}
