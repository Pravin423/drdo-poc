import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function EventCalendarTab({ events, onCreateEvent }) {
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Event Calendar</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("month")}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Week
              </button>
            </div>
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-xl font-extrabold text-slate-900 min-w-[240px] text-center tracking-tight">{monthYear}</h3>
          <button
            onClick={handleNextMonth}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-8">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3">
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
                className={`min-h-[120px] border-2 border-slate-100 rounded-2xl p-3 transition-all ${isToday ? "border-tech-blue-500 bg-tech-blue-50/30" : ""} ${!day ? "bg-slate-50 border-transparent opacity-40" : "bg-white hover:border-tech-blue-200 hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer"}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-bold mb-3 flex items-center justify-center w-7 h-7 rounded-lg ${isToday ? "bg-tech-blue-600 text-white shadow-md" : "text-slate-900"}`}>{day}</div>
                    <div className="space-y-1.5">
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg truncate border ${getEventColor(event.type)}`}
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
        <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legend</span>
          <div className="flex flex-wrap gap-6">
            {eventTypes.map((type) => (
              <div key={type.type} className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full ${type.color} ring-2 ring-white shadow-sm`}></div>
                <span className="text-sm font-semibold text-slate-600">{type.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
