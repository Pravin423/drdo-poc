import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Map as MapIcon, Calendar, MapPin, Clock, Inbox } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "520px",
};

const GOA_CENTER = { lat: 15.4909, lng: 73.8278 };

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
  ]
};

const STATUS_CONFIG = {
  upcoming:  { color: "#3b52ab", label: "Upcoming"  },
  ongoing:   { color: "#f59e0b", label: "Ongoing"   },
  completed: { color: "#10b981", label: "Completed" },
  closed:    { color: "#64748b", label: "Closed"    },
  default:   { color: "#8b5cf6", label: "Event"     },
};

function getStatusConfig(status) {
  return STATUS_CONFIG[(status || "").toLowerCase()] || STATUS_CONFIG.default;
}

function getStatusBadgeStyles(status) {
  switch((status || "").toLowerCase()) {
    case "upcoming":  return { bg: "bg-indigo-50 text-[#3b52ab] border-indigo-100", dot: "bg-[#3b52ab]" };
    case "ongoing":   return { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" };
    case "completed": return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" };
    case "closed":    return { bg: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
    default:          return { bg: "bg-purple-50 text-purple-700 border-purple-100", dot: "bg-purple-500" };
  }
}

function formatVenue(venue) {
  if (!venue) return "Location Unspecified";
  const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  if (coordRegex.test(venue)) {
    const [lat, lng] = venue.split(',').map(Number);
    return `📍 GPS: ${lat.toFixed(5)}°, ${lng.toFixed(5)}°`;
  }
  return venue;
}

const EventListItem = memo(({ event, isSelected, onSelect }) => {
  const cfg = getStatusConfig(event.status);
  const badgeStyles = getStatusBadgeStyles(event.status);

  return (
    <button
      onClick={() => onSelect(event)}
      className={`w-full text-left p-4 rounded-2xl border transition-[transform,box-shadow,border-color,background-color] duration-200 flex flex-col gap-2 group relative
        ${isSelected 
          ? "bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/40 border-indigo-200 shadow-md shadow-indigo-900/5 -translate-y-[1px]" 
          : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-sm hover:-translate-y-[1px]"}`}
      style={{ willChange: 'transform' }}
    >
      {isSelected && (
        <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-[#3b52ab] rounded-r-md" />
      )}
      
      <div className="flex items-center justify-between gap-2 w-full">
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${badgeStyles.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyles.dot}`} />
          {cfg.label}
        </div>
        {event.startTime && (
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/50">
            <Clock size={10} className="text-slate-400 shrink-0" /> {event.startTime}
          </span>
        )}
      </div>
      
      <h4 className={`text-sm font-bold leading-snug line-clamp-2 transition-colors duration-200 ${isSelected ? "text-[#1a2e7a]" : "text-slate-800 group-hover:text-[#3b52ab]"}`}>
        {event.title}
      </h4>

      <div className="flex items-start gap-1.5 text-[11px] font-medium text-slate-500 mt-0.5">
        <MapPin size={12} className={`shrink-0 mt-0.5 ${isSelected ? "text-indigo-500" : "text-slate-400"}`} />
        <span className="line-clamp-2 text-slate-500 leading-relaxed">
          {formatVenue(event.venue || event.district)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mt-1.5 pt-2.5 border-t border-dashed border-slate-200/60 w-full">
        <div className="flex items-center min-w-0">
          <span className="text-[9px] font-black uppercase text-[#3b52ab] bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/30 tracking-wider truncate">
            {event.vertical || "General"}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold tracking-tight shrink-0 tabular-nums flex items-center gap-1">
          <Calendar size={10} className="text-slate-300" /> {event.date}
        </span>
      </div>
    </button>
  );
});

EventListItem.displayName = "EventListItem";

// Extract valid lat/lng from a raw API event — tries multiple field name conventions.
function extractCoords(e) {
  const lat = parseFloat(
    e.latitude ?? e.lat ?? e.geo_lat ?? e.event_lat ?? ""
  );
  const lng = parseFloat(
    e.longitude ?? e.lng ?? e.geo_lng ?? e.event_lng ?? e.long ?? ""
  );
  if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
    return { lat: String(lat), lng: String(lng) };
  }
  return null;
}

// Normalise any raw event object into the shape the map needs.
function normaliseEvent(e) {
  const coords = extractCoords(e);
  if (!coords) return null;

  let rawStatus = (e.status || "").toLowerCase().trim();
  const dateStr = e.start_datetime ? e.start_datetime.split("T")[0] : (e.date || "");
  
  // If the backend doesn't explicitly send a valid status, derive it from the date 
  // exactly like the Event Management list tabs do.
  if (!rawStatus || rawStatus === "active" || rawStatus === "inactive") {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr > today) rawStatus = "upcoming";
    else if (dateStr === today) rawStatus = "ongoing";
    else if (dateStr < today) rawStatus = "completed";
    else rawStatus = "upcoming";
  }

  return {
    id:        e.id,
    title:     e.title || "Untitled Event",
    type:      e.type  || "Meeting",
    status:    rawStatus,
    date:      dateStr,
    startTime: e.start_datetime ? e.start_datetime.split("T")[1]?.substring(0, 5) : (e.startTime || ""),
    venue:     e.location || e.venue || e.village || "",
    district:  e.district || "",
    vertical:  e.vertical_name || e.vertical || "",
    latitude:  coords.lat,
    longitude: coords.lng,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EventOverviewMap
//
// Props:
//   events  — optional pre-fetched events array from the parent page.
//             If provided the component skips its own fetch (preferred).
//             Each item needs at least { id, title, latitude, longitude }.
// ─────────────────────────────────────────────────────────────────────────────
export default function EventOverviewMap({ events: eventsProp }) {
  const [events, setEvents]               = useState([]);
  const [loading, setLoading]             = useState(!eventsProp);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter]   = useState("all");

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((mapInst) => {
    setMap(mapInst);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Pan map to event when an event is selected
  useEffect(() => {
    if (map && selectedEvent) {
      const lat = parseFloat(selectedEvent.latitude);
      const lng = parseFloat(selectedEvent.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.panTo({ lat, lng });
        map.setZoom(13);
      }
    }
  }, [map, selectedEvent]);

  // ── Path A: parent passed events as prop ───────────────────────────────────
  useEffect(() => {
    if (!eventsProp) return;
    const normalised = eventsProp.map(normaliseEvent).filter(Boolean);
    console.log(
      "[EventOverviewMap] From prop — total:", eventsProp.length,
      "with coords:", normalised.length, normalised
    );
    setEvents(normalised);
    setLoading(false);
  }, [eventsProp]);

  // ── Path B: self-fetch fallback when no prop provided ─────────────────────
  useEffect(() => {
    if (eventsProp) return;
    const fetchEvents = async () => {
      try {
        const res    = await fetch("/api/events");
        const result = await res.json();
        console.log("[EventOverviewMap] Raw API response:", result);

        const raw =
          result.data?.events?.data ||
          result.data?.events       ||
          result.data               ||
          result.events?.data       ||
          result.events             ||
          (Array.isArray(result) ? result : []);

        console.log("[EventOverviewMap] Raw events (", raw.length, "):", raw);
        if (raw.length > 0) {
          console.log("[EventOverviewMap] Keys on first event:", Object.keys(raw[0]));
          console.log("[EventOverviewMap] First event full:", raw[0]);
        }

        const normalised = raw.map(normaliseEvent).filter(Boolean);
        console.log("[EventOverviewMap] Events with valid coords:", normalised.length, normalised);
        setEvents(normalised);
      } catch (err) {
        console.error("[EventOverviewMap] fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventsProp]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter(e => e.status === activeFilter);
  }, [events, activeFilter]);

  // Clear popup when changing filters
  useEffect(() => {
    setSelectedEvent(null);
  }, [activeFilter]);

  const filters = [
    { id: "all",       label: "All" },
    { id: "upcoming",  label: "Upcoming"  },
    { id: "ongoing",   label: "Ongoing"   },
    { id: "completed", label: "Completed" },
    { id: "closed",    label: "Closed"    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-[520px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-[#3b52ab] rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 italic tracking-wide">Loading Event Geo-Data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapIcon className="text-[#3b52ab]" size={20} />
            Event Geographic Overview
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} mapped across Goa
            {events.length === 0 && " — create events with GPS coordinates to see them here"}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 flex-wrap">
          {filters.map(f => {
            const cfg = f.id === "all" ? null : getStatusConfig(f.id);
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5
                  ${activeFilter === f.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                {cfg && (
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: cfg.color }} />
                )}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Pane: Interactive Events List */}
        <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col h-[520px] bg-slate-50/20 shrink-0">
          <div className="p-4 border-b border-slate-100 bg-white shrink-0 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={13} className="text-[#3b52ab]"/> Directory Listing
            </span>
            <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50">
              {filteredEvents.length} Items
            </span>
          </div>
          
          <div 
            className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2"
            style={{ transform: 'translate3d(0,0,0)', willChange: 'transform', WebkitOverflowScrolling: 'touch' }}
          >
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-200 h-full">
                <Inbox size={32} className="text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No Matching Events</p>
                <p className="text-[10px] text-slate-400 mt-0.5">No data matches current filters.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onSelect={handleSelectEvent}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Map */}
        <div className="flex-1 relative h-[520px]">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={GOA_CENTER}
              zoom={10}
              options={mapOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {filteredEvents.map(event => {
                if (typeof window === "undefined" || !window.google) return null;
                const cfg = getStatusConfig(event.status);
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <Marker
                    key={event.id}
                    position={{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
                    onClick={() => setSelectedEvent(event)}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: cfg.color,
                      fillOpacity: 1,
                      strokeColor: isSelected ? "#1e293b" : "#ffffff",
                      strokeWeight: isSelected ? 3.5 : 2.5,
                      scale: isSelected ? 12 : 10
                    }}
                  />
                );
              })}

              {selectedEvent && (
                <InfoWindow
                  position={{ lat: parseFloat(selectedEvent.latitude), lng: parseFloat(selectedEvent.longitude) }}
                  onCloseClick={() => setSelectedEvent(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                        style={{ background: getStatusConfig(selectedEvent.status).color }}
                      >
                        {selectedEvent.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedEvent.type}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{selectedEvent.title}</h3>
                    {selectedEvent.date && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                        <Calendar size={11} />
                        {selectedEvent.date}{selectedEvent.startTime && ` · ${selectedEvent.startTime}`}
                      </p>
                    )}
                    {selectedEvent.venue    && <p className="text-xs text-slate-500 mb-0.5">📍 {selectedEvent.venue}</p>}
                    {selectedEvent.district && <p className="text-xs text-slate-400">{selectedEvent.district}</p>}
                    {selectedEvent.vertical && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedEvent.vertical}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-300 mt-1">
                      {parseFloat(selectedEvent.latitude).toFixed(5)}°N &nbsp;
                      {parseFloat(selectedEvent.longitude).toFixed(5)}°E
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="h-[520px] bg-slate-50 flex items-center justify-center border-y border-slate-100">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Initialising Maps...</p>
              </div>
            </div>
          )}

          {/* Floating legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl pointer-events-none">
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(STATUS_CONFIG).filter(([k]) => k !== "default").map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: cfg.color }} />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state overlay */}
          {!loading && filteredEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200 shadow-lg text-center max-w-xs">
                <MapIcon size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">No events with GPS coordinates yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Enter latitude &amp; longitude when creating an event — the pin will appear here instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
