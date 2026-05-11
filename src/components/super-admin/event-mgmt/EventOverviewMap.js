import { useState, useEffect, useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Map as MapIcon, Calendar } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "520px",
  borderRadius: "1.5rem"
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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const onLoad    = useCallback(() => {}, []);
  const onUnmount = useCallback(() => {}, []);

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

      {/* Map */}
      <div className="relative">
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
              return (
                <Marker
                  key={event.id}
                  position={{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
                  onClick={() => setSelectedEvent(event)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: cfg.color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2.5,
                    scale: 10
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
    </motion.div>
  );
}
