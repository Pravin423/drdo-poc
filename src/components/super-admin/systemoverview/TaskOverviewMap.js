import { useState, useEffect, useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Map as MapIcon, Filter, Layers, Navigation } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "1.5rem"
};

const center = {
  lat: 15.4909,
  lng: 73.8278
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

export default function TaskOverviewMap() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/activity-tasks");
        const result = await res.json();
        const data = Array.isArray(result) ? result : (result.data || []);
        
        // Filter tasks that have valid coordinates
        const tasksWithCoords = data.filter(t => t.latitude && t.longitude);
        setTasks(tasksWithCoords);
      } catch (err) {
        console.error("Failed to fetch tasks for map:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter(t => (t.task_type || "").toLowerCase() === activeFilter);
  }, [tasks, activeFilter]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 italic tracking-wide">Loading Task Geo-Data...</p>
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
            <MapIcon className="text-blue-600" size={20} />
            Task Geographic Overview
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            Visualizing task distribution across Goa — {filteredTasks.length} mapped tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter("regular")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeFilter === "regular" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Regular
          </button>
          <button 
            onClick={() => setActiveFilter("special")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeFilter === "special" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            Special
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative group">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={10}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {filteredTasks.map((task) => {
              const isSpecial = (task.task_type || "").toLowerCase() === "special";
              // Only render markers if window.google is available
              if (typeof window === "undefined" || !window.google) return null;

              return (
                <Marker
                  key={task.id}
                  position={{ lat: parseFloat(task.latitude), lng: parseFloat(task.longitude) }}
                  onClick={() => setSelectedTask(task)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: isSpecial ? "#ef4444" : "#10b981",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: 8
                  }}
                />
              );
            })}

            {selectedTask && (
              <InfoWindow
                position={{ lat: parseFloat(selectedTask.latitude), lng: parseFloat(selectedTask.longitude) }}
                onCloseClick={() => setSelectedTask(null)}
              >
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${(selectedTask.task_type || "").toLowerCase() === "special" ? "bg-rose-500" : "bg-emerald-500"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {selectedTask.task_type} Task
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{selectedTask.task_name}</h3>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{selectedTask.task_description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedTask.vertical_name || "General"}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase">Details</button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="h-[500px] bg-slate-50 flex items-center justify-center border-y border-slate-100">
             <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Initialising Maps...</p>
             </div>
          </div>
        )}

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Regular Tasks</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Special Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
