"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  FileCheck,
  BarChart3,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  MapPin,
  User,
  ChevronDown,
  Search,
  Filter,
  Mail,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  Smile,
  QrCode,
  Target,
  ThumbsUp,
  MessageSquare,
  MoreVertical,
  Star,
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";

/* ---------------- UTILITY FUNCTIONS ---------------- */
// CSV Export utility
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]?.toString() || "";
        // Escape commas and quotes
        return value.includes(",") || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */
export default function EventManagement() {
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
    {
      id: 1,
      name: "Sunita Naik",
      email: "sunita.naik@example.com",
      phone: "+91 9876543210",
      type: "CRP",
      district: "North Goa",
      organization: "",
      events: 12,
      avatar: "https://i.pravatar.cc/150?u=sunita",
    },
    {
      id: 2,
      name: "Ramesh Desai",
      email: "ramesh.desai@example.com",
      phone: "+91 9876543211",
      type: "CRP",
      district: "North Goa",
      organization: "",
      events: 8,
      avatar: "https://i.pravatar.cc/150?u=ramesh",
    },
    {
      id: 3,
      name: "Priya Fernandes",
      email: "priya.fernandes@example.com",
      phone: "+91 9876543212",
      type: "CRP",
      district: "South Goa",
      organization: "",
      events: 15,
      avatar: "https://i.pravatar.cc/150?u=priya",
    },
    {
      id: 4,
      name: "Anil Gawas",
      email: "anil.gawas@example.com",
      phone: "+91 9876543213",
      type: "CRP",
      district: "South Goa",
      organization: "",
      events: 6,
      avatar: "https://i.pravatar.cc/150?u=anil",
    },
    {
      id: 5,
      name: "Kavita Sawant",
      email: "kavita.sawant@example.com",
      phone: "+91 9876543214",
      type: "CRP",
      district: "North Goa",
      organization: "",
      events: 10,
      avatar: "https://i.pravatar.cc/150?u=kavita",
    },
    {
      id: 6,
      name: "Dr. Suresh Rao",
      email: "suresh.rao@ngo.org",
      phone: "+91 9876543215",
      type: "External",
      district: "North Goa",
      organization: "Health NGO",
      events: 3,
      avatar: "https://i.pravatar.cc/150?u=suresh",
    },
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
    const reportData = events.map(event => ({
      Title: event.title,
      Type: event.type,
      Date: event.date,
      "Start Time": event.startTime,
      "End Time": event.endTime,
      Venue: event.venue,
      District: event.district,
      Block: event.block || "N/A",
      Facilitator: event.facilitator,
      Capacity: event.capacity,
    }));
    exportToCSV(reportData, "event_reports");
  }, [events]);

  const tabs = [
    { id: "calendar", label: "Event Calendar", icon: Calendar },
    { id: "attendance", label: "Attendance", icon: FileCheck },
    { id: "participants", label: "Participants", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  // Calculate stats
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

  return (
    <ProtectedRoute allowedRole="super-admin">
      <DashboardLayout>
        <div className="min-h-screen p-2 lg:p-3 xl:p-4">
          <div className="max-w-[1600px] mx-auto space-y-8">
           

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Event Management <span className="bg-gradient-to-b from-[#3b52ab] to-[#1a2e7a] bg-clip-text text-transparent">Portal</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Comprehensive training and workshop management system
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportReports}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Reports
                </button>
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white  bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <OverviewStats stats={stats} />

            {/* Tab Navigation */}
            <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit backdrop-blur-sm border border-slate-200/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeTab === tab.id
                        ? "bg-white text-[#1a2e7a] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "calendar" && (
                  <EventCalendarTab 
                    events={events} 
                    onCreateEvent={() => setShowCreateEventModal(true)} 
                  />
                )}
                {activeTab === "attendance" && <AttendanceTab events={events} participants={participants} />}
                {activeTab === "participants" && (
                  <ParticipantsTab 
                    participants={participants} 
                    onAddParticipant={() => setShowAddParticipantModal(true)} 
                  />
                )}
                {activeTab === "analytics" && <AnalyticsTab events={events} participants={participants} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <CreateEventModal 
        isOpen={showCreateEventModal} 
        onClose={() => setShowCreateEventModal(false)} 
        onSave={handleAddEvent}
      />
      <AddParticipantModal 
        isOpen={showAddParticipantModal} 
        onClose={() => setShowAddParticipantModal(false)} 
        onSave={handleAddParticipant}
      />
    </ProtectedRoute>
  );
}

/* ---------------- OVERVIEW STATS COMPONENT ---------------- */
function OverviewStats({ stats }) {
  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents.toLocaleString(),
      delta: "+3 this month",
      isPositive: true,
      color: "blue",
      icon: Calendar,
    },
    {
      label: "Total Participants",
      value: stats.totalParticipants.toLocaleString(),
      delta: "+12%",
      isPositive: true,
      color: "emerald",
      icon: Users,
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      subValue: "Next 30 days",
      color: "amber",
      icon: Clock,
    },
    {
      label: "Certificates",
      value: stats.certificatesIssued.toLocaleString(),
      delta: "89% rate",
      isPositive: true,
      color: "indigo",
      icon: Award,
    },
  ];

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {statCards.map((card, index) => (
        <motion.section
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
        >
          {/* Subtle Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex justify-between items-start relative z-10">
            <div className={`p-2.5 rounded-xl ${colorMap[card.color]} border transition-transform duration-300 group-hover:scale-110`}>
              <card.icon size={20} />
            </div>
            
            {card.delta && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${
                card.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {card.isPositive && <TrendingUp size={12} />}
                {card.delta}
              </div>
            )}
          </div>

          <div className="mt-6 relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              {card.label}
            </p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </h4>
              {card.subValue && (
                <span className="text-[11px] font-medium text-slate-400 italic">
                  {card.subValue}
                </span>
              )}
            </div>
          </div>

          {/* Decorative Large Background Icon */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <card.icon size={120} strokeWidth={1.5} />
          </div>
      
        </motion.section>
      ))}
    </div>
  );
}

/* ---------------- EVENT CALENDAR TAB ---------------- */
function EventCalendarTab({ events, onCreateEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [viewMode, setViewMode] = useState("month");

  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Map events to calendar days
  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach(event => {
      const eventDate = new Date(event.date);
      if (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth()
      ) {
        const day = eventDate.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [events, currentDate]);

  const eventTypes = [
    { type: "Training", color: "bg-blue-200" },
    { type: "Workshop", color: "bg-purple-200" },
    { type: "Seminar", color: "bg-teal-200" },
    { type: "Meeting", color: "bg-orange-200" },
  ];

  const getEventColor = (type) => {
    const typeMap = {
      training: "bg-blue-100 text-blue-700",
      workshop: "bg-purple-100 text-purple-700",
      seminar: "bg-teal-100 text-teal-700",
      meeting: "bg-orange-100 text-orange-700",
    };
    return typeMap[type] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Event Calendar</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === "month" ? " bg-emerald-600 rounded-lg hover:bg-emerald-700  text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${viewMode === "week" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Week
              </button>
            </div>
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700  transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">{monthYear}</h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const today = new Date();
            const isToday = day && 
              currentDate.getFullYear() === today.getFullYear() &&
              currentDate.getMonth() === today.getMonth() &&
              day === today.getDate();
            
            const dayEvents = day ? eventsByDay[day] || [] : [];

            return (
              <div
                key={index}
                className={`min-h-[100px] border border-slate-200 rounded-lg p-2 ${
                  isToday ? "ring-2 ring-[#0e5a8a]" : ""
                } ${!day ? "bg-slate-50" : "bg-white hover:bg-slate-50 cursor-pointer transition-colors"}`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium text-slate-900 mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded truncate ${getEventColor(event.type)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Event Types Legend */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200">
          <span className="text-sm font-semibold text-slate-700">Event Types:</span>
          {eventTypes.map((type) => (
            <div key={type.type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${type.color}`}></div>
              <span className="text-sm text-slate-600">{type.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ATTENDANCE TAB ---------------- */
function AttendanceTab({ events, participants }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || null);

  // Mock attendance data
  const [mockAttendance] = useState([
    {
      id: 1,
      name: "Sunita Naik",
      crpId: "CRP-NG-001",
      district: "North Goa",
      status: "present",
      time: "09:45 AM",
      avatar: "https://i.pravatar.cc/150?u=sunita",
    },
    {
      id: 2,
      name: "Ramesh Desai",
      crpId: "CRP-NG-002",
      district: "North Goa",
      status: "late",
      time: "10:15 AM",
      avatar: "https://i.pravatar.cc/150?u=ramesh",
    },
    {
      id: 3,
      name: "Priya Fernandes",
      crpId: "CRP-SG-003",
      district: "South Goa",
      status: "present",
      time: "09:30 AM",
      avatar: "https://i.pravatar.cc/150?u=priya",
    },
    {
      id: 4,
      name: "Anil Gawas",
      crpId: "CRP-SG-004",
      district: "South Goa",
      status: "absent",
      time: "-",
      avatar: "https://i.pravatar.cc/150?u=anil",
    },
    {
      id: 5,
      name: "Kavita Sawant",
      crpId: "CRP-NG-005",
      district: "North Goa",
      status: "pending",
      time: "-",
      avatar: "https://i.pravatar.cc/150?u=kavita",
    },
    {
      id: 6,
      name: "Dr. Suresh Rao",
      crpId: "EXT-001",
      district: "North Goa",
      status: "present",
      time: "09:50 AM",
      avatar: "https://i.pravatar.cc/150?u=suresh",
    },
  ]);

  const stats = useMemo(() => {
    const total = mockAttendance.length;
    const present = mockAttendance.filter(a => a.status === "present").length;
    const absent = mockAttendance.filter(a => a.status === "absent").length;
    const late = mockAttendance.filter(a => a.status === "late").length;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return [
      { label: "Total", value: total.toString(), icon: Users, color: "text-slate-600 bg-slate-50" },
      { label: "Present", value: present.toString(), icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
      { label: "Absent", value: absent.toString(), icon: XCircle, color: "text-rose-600 bg-rose-50" },
      { label: "Late", value: late.toString(), icon: Clock, color: "text-amber-600 bg-amber-50" },
      { label: "Rate", value: `${rate}%`, icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
    ];
  }, [mockAttendance]);

  const filteredAttendance = useMemo(() => 
    mockAttendance.filter((item) =>
      statusFilter === "all" ? true : item.status === statusFilter
    ), [mockAttendance, statusFilter]
  );

  const handleExport = useCallback(() => {
    const exportData = mockAttendance.map(item => ({
      Name: item.name,
      "CRP ID": item.crpId,
      District: item.district,
      Status: item.status,
      Time: item.time,
    }));
    exportToCSV(exportData, "attendance");
  }, [mockAttendance]);

  const currentEvent = events.find(e => e.id === selectedEvent);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Attendance Management</h2>
            <p className="text-sm text-slate-500 mt-1">{currentEvent?.title || "SHG Leadership Training"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white  bg-emerald-600 rounded-lg hover:bg-emerald-700  rounded-lg  transition-colors">
              <QrCode className="w-4 h-4" />
              QR Scanner
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4 border-b border-slate-200">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" />
              <p className="text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or CRP ID..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {["all", "present", "absent", "late", "pending"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${statusFilter === filter
                  ? "bg-[#0e5a8a] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance List */}
      <div className="divide-y divide-slate-100">
        {filteredAttendance.map((item) => (
          <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">
                    {item.crpId} • {item.district}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 ${item.status === "present"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "late"
                        ? "bg-amber-50 text-amber-700"
                        : item.status === "absent"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-50 text-slate-700"
                    }`}
                >
                  {item.status === "present" && <CheckCircle2 className="w-4 h-4" />}
                  {item.status === "late" && <Clock className="w-4 h-4" />}
                  {item.status === "absent" && <XCircle className="w-4 h-4" />}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                <span className="text-sm font-medium text-slate-900 min-w-[80px] text-right">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PARTICIPANTS TAB ---------------- */
function ParticipantsTab({ participants, onAddParticipant }) {
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
    const exportData = filteredParticipants.map(p => ({
      Name: p.name,
      Email: p.email,
      Phone: p.phone,
      Type: p.type,
      District: p.district,
      Organization: p.organization || "N/A",
      "Events Attended": p.events,
    }));
    exportToCSV(exportData, "participants");
  }, [filteredParticipants]);

  const handleSendNotification = useCallback(() => {
    if (selectedIds.length === 0) {
      alert("Please select participants to send notification");
      return;
    }
    alert(`Sending notification to ${selectedIds.length} selected participant(s)`);
  }, [selectedIds]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Participant Database</h2>
            <p className="text-sm text-slate-500 mt-1">Manage CRPs and external participants</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAddParticipant}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0e5a8a] rounded-lg hover:bg-[#0a4a6e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Participant
            </button>
            <button 
              onClick={handleSendNotification}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Notification ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <select 
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="pl-4 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">Filter by district</option>
              <option value="North Goa">North Goa</option>
              <option value="South Goa">South Goa</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-4 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">Filter by type</option>
              <option value="CRP">CRP</option>
              <option value="External">External</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Select All */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Select All ({filteredParticipants.length} participants)
          </span>
        </label>
      </div>

      {/* Participants List */}
      <div className="divide-y divide-slate-100">
        {filteredParticipants.map((participant) => (
          <div key={participant.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(participant.id)}
                  onChange={(e) => handleSelectOne(participant.id, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-slate-900">{participant.name}</h3>
                  <p className="text-sm text-slate-600">{participant.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${participant.type === "CRP" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }`}
                >
                  {participant.type}
                </span>
                <span className="text-sm text-slate-600 min-w-[100px]">{participant.district}</span>
                <span className="text-sm text-slate-600 min-w-[80px]">{participant.events} events</span>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ANALYTICS TAB ---------------- */
function AnalyticsTab({ events, participants }) {
  const selectedEvent = events[0];

  const metrics = [
    {
      label: "Attendance Rate",
      value: "87.5%",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Average Feedback",
      value: "4.3/5",
      icon: Star,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completion Rate",
      value: "92%",
      icon: Target,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Satisfaction Score",
      value: "89%",
      icon: ThumbsUp,
      color: "text-violet-600 bg-violet-50",
    },
  ];

  const topPerformers = [
    { rank: 1, name: "Priya Fernandes", crpId: "CRP-SG-003", score: "96%" },
    { rank: 2, name: "Sunita Naik", crpId: "CRP-NG-001", score: "94%" },
    { rank: 3, name: "Kavita Sawant", crpId: "CRP-NG-005", score: "91%" },
  ];

  const feedbackSummary = [
    { category: "Content Quality", rating: "4.5/5", responses: "32 responses" },
    { category: "Facilitator Effectiveness", rating: "4.2/5", responses: "32 responses" },
    { category: "Venue & Facilities", rating: "4/5", responses: "32 responses" },
    { category: "Overall Experience", rating: "4.3/5", responses: "32 responses" },
  ];

  const handleExportReport = useCallback(() => {
    const reportData = [
      { Metric: "Attendance Rate", Value: "87.5%" },
      { Metric: "Average Feedback", Value: "4.3/5" },
      { Metric: "Completion Rate", Value: "92%" },
      { Metric: "Satisfaction Score", Value: "89%" },
    ];
    exportToCSV(reportData, "analytics_report");
  }, []);

  const handleGenerateCertificates = useCallback(() => {
    alert("Generating certificates for 32 participants...");
  }, []);

  const handleDownloadAll = useCallback(() => {
    alert("Downloading all certificates...");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Event Analytics</h2>
            <p className="text-sm text-slate-500 mt-1">{selectedEvent?.title || "Health & Nutrition Training"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button 
              onClick={handleGenerateCertificates}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0e5a8a] rounded-lg hover:bg-[#0a4a6e] transition-colors"
            >
              <Award className="w-4 h-4" />
              Generate Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className={`${metric.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Performers and Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer) => (
              <div key={performer.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${performer.rank === 1
                        ? "bg-amber-100 text-amber-700"
                        : performer.rank === 2
                          ? "bg-slate-100 text-slate-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {performer.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{performer.name}</h4>
                    <p className="text-sm text-slate-600">{performer.crpId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{performer.score}</p>
                  <p className="text-xs text-slate-500">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Feedback Summary</h3>
          </div>
          <div className="space-y-4">
            {feedbackSummary.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-900">{item.category}</h4>
                  <span className="text-sm font-bold text-slate-900">{item.rating}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div
                    className="bg-[#0e5a8a] h-2 rounded-full"
                    style={{ width: `${(parseFloat(item.rating) / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">{item.responses}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">Certificates Issued</h3>
              <p className="text-sm text-blue-700">32 participants received completion certificates</p>
            </div>
          </div>
          <button 
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0e5a8a] rounded-lg hover:bg-[#0a4a6e] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CREATE EVENT MODAL ---------------- */
function CreateEventModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    district: "",
    block: "",
    facilitator: "",
    capacity: "",
    description: "",
    materials: "",
    allowExternal: false,
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.type || !formData.date || !formData.startTime || 
        !formData.endTime || !formData.venue || !formData.district || !formData.facilitator || 
        !formData.capacity) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSave(formData);
      
      // Reset form
      setFormData({
        title: "",
        type: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        district: "",
        block: "",
        facilitator: "",
        capacity: "",
        description: "",
        materials: "",
        allowExternal: false,
      });
      setConfirmChecked(false);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Profile-Style Header */}
        <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                Create New Event
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                Schedule a training, workshop, or meeting for CRPs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-8">

          {/* Section: Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Event Details</h3>
              <p className="text-xs text-slate-500 mt-1">Basic information about the event.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Title *</p>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Type *</p>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select event type</option>
                    <option value="training">Training</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="meeting">Meeting</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Date *</p>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Schedule</h3>
              <p className="text-xs text-slate-500 mt-1">Event timing details.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time *</p>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time *</p>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Location</h3>
              <p className="text-xs text-slate-500 mt-1">Venue and administrative area.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Venue *</p>
                <input
                  type="text"
                  placeholder="Enter venue name and address"
                  value={formData.venue}
                  onChange={(e) => handleChange("venue", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">District *</p>
                <div className="relative">
                  <select 
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select district</option>
                    <option value="North Goa">North Goa</option>
                    <option value="South Goa">South Goa</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Block</p>
                <div className="relative">
                  <select 
                    value={formData.block}
                    onChange={(e) => handleChange("block", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select block</option>
                    <option value="Pernem">Pernem</option>
                    <option value="Bicholim">Bicholim</option>
                    <option value="Sattari">Sattari</option>
                    <option value="Margao">Margao</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Organizer Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Organizer Details</h3>
              <p className="text-xs text-slate-500 mt-1">Facilitator and capacity information.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Facilitator *</p>
                <div className="relative">
                  <select 
                    value={formData.facilitator}
                    onChange={(e) => handleChange("facilitator", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select facilitator</option>
                    <option value="Dr. Maria Fernandes">Dr. Maria Fernandes</option>
                    <option value="Prof. Rajesh Kumar">Prof. Rajesh Kumar</option>
                    <option value="Ms. Priya Desai">Ms. Priya Desai</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Capacity *</p>
                <input
                  type="number"
                  placeholder="Max participants"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Additional Information</h3>
              <p className="text-xs text-slate-500 mt-1">Description and materials needed.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</p>
                <textarea
                  rows={3}
                  placeholder="Event description and objectives"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm resize-none"
                ></textarea>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Required Materials</p>
                <textarea
                  rows={2}
                  placeholder="List of materials needed (comma separated)"
                  value={formData.materials}
                  onChange={(e) => handleChange("materials", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                I confirm that all the information provided above is accurate and I have verified the availability of the venue and facilitator.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            disabled={!confirmChecked || isSubmitting}
            onClick={handleSubmit}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ${
              confirmChecked && !isSubmitting
                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                : "bg-slate-300 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- ADD PARTICIPANT MODAL ---------------- */
function AddParticipantModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    district: "",
    organization: "",
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.type || !formData.district) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSave(formData);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "",
        district: "",
        organization: "",
      });
      setConfirmChecked(false);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Profile-Style Header */}
        <div className="relative h-28 bg-gradient-to-r from-slate-800 to-slate-900 px-8 flex items-center">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                Add New Participant
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                Register a participant to the event database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="max-h-[70vh] overflow-y-auto pt-8 px-8 pb-4 space-y-8">

          {/* Section: Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500 mt-1">Identity and contact information.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</p>
                <input
                  type="text"
                  placeholder="Enter participant name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address *</p>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number *</p>
                <input
                  type="tel"
                  placeholder="+91"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Participant Type *</p>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="CRP">CRP</option>
                    <option value="External">External</option>
                    <option value="Facilitator">Facilitator</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Administrative Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-slate-900">Administrative Assignment</h3>
              <p className="text-xs text-slate-500 mt-1">Geographical responsibility.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">District *</p>
                <div className="relative">
                  <select 
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none appearance-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Select district</option>
                    <option value="North Goa">North Goa</option>
                    <option value="South Goa">South Goa</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Organization</p>
                <input
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                I confirm that all the information provided above is accurate and the participant has consented to being registered in the system.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-50/80 border-t flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            disabled={!confirmChecked || isSubmitting}
            onClick={handleSubmit}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ${
              confirmChecked && !isSubmitting
                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                : "bg-slate-300 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Participant"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
