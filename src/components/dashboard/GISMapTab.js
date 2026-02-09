import { useState, useEffect, useCallback, memo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Target, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Navigation,
  Maximize2
} from "lucide-react";

// Mock CRP data - In production, this would come from your API
const initialCRPData = [
  {
    id: "CRP2024001",
    name: "Rajesh Kumar Naik",
    location: "Arambol, Pernem",
    coordinates: { lat: 15.2993, lng: 74.1240 },
    accuracy: "High (5m)",
    timestamp: "2026-01-30 09:15 AM",
    status: "present",
    district: "North Goa",
    block: "Pernem"
  },
  {
    id: "CRP2024002",
    name: "Priya Desai",
    location: "Mayem, Bicholim",
    coordinates: { lat: 15.5889, lng: 73.9558 },
    accuracy: "Medium (12m)",
    timestamp: "2026-01-30 09:45 AM",
    status: "exception",
    district: "North Goa",
    block: "Bicholim"
  },
  {
    id: "CRP2024003",
    name: "Amit Prabhu Dessai",
    location: "Mandrem, Pernem",
    coordinates: { lat: 15.7172, lng: 73.7417 },
    accuracy: "High (8m)",
    timestamp: "2026-01-30 09:10 AM",
    status: "present",
    district: "North Goa",
    block: "Pernem"
  },
  {
    id: "CRP2024004",
    name: "Sunita Gaonkar",
    location: "Panaji, North Goa",
    coordinates: { lat: 15.4909, lng: 73.8278 },
    accuracy: "Low (25m)",
    timestamp: "2026-01-30 10:30 AM",
    status: "absent",
    district: "North Goa",
    block: "Tiswadi"
  },
  {
    id: "CRP2024005",
    name: "Mangesh Naik",
    location: "Vasco, Mormugao",
    coordinates: { lat: 15.3990, lng: 73.8153 },
    accuracy: "High (6m)",
    timestamp: "2026-01-30 09:20 AM",
    status: "present",
    district: "South Goa",
    block: "Mormugao"
  }
];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "1rem"
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
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Status color configurations
const statusConfig = {
  present: {
    color: "emerald",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
    markerColor: "#10b981"
  },
  absent: {
    color: "rose",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    dotColor: "bg-rose-500",
    markerColor: "#ef4444"
  },
  exception: {
    color: "orange",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-500",
    markerColor: "#f97316"
  }
};

export default function GISMapTab() {
  const [crpData, setCRPData] = useState(initialCRPData);
  const [filteredData, setFilteredData] = useState(initialCRPData);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  // Real-time updates simulation - updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small coordinate changes (real-time movement)
      setCRPData(prevData => 
        prevData.map(crp => ({
          ...crp,
          coordinates: {
            lat: crp.coordinates.lat + (Math.random() - 0.5) * 0.001,
            lng: crp.coordinates.lng + (Math.random() - 0.5) * 0.001
          },
          timestamp: new Date().toLocaleString()
        }))
      );
      setLastUpdated(new Date().toLocaleString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter data based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredData(crpData);
    } else {
      setFilteredData(crpData.filter(crp => crp.status === activeFilter));
    }
  }, [activeFilter, crpData]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const getCounts = () => {
    return {
      all: crpData.length,
      present: crpData.filter(crp => crp.status === "present").length,
      absent: crpData.filter(crp => crp.status === "absent").length,
      exception: crpData.filter(crp => crp.status === "exception").length
    };
  };

  const counts = getCounts();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">GIS Attendance Map</h2>
            <p className="text-sm text-slate-500 mt-1">
              Real-time CRP location tracking - Last updated: {lastUpdated}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-slate-600">Exception</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3">
          <FilterButton
            label="All"
            count={counts.all}
            isActive={activeFilter === "all"}
            onClick={() => handleFilterClick("all")}
            color="slate"
          />
          <FilterButton
            label="Present"
            count={counts.present}
            isActive={activeFilter === "present"}
            onClick={() => handleFilterClick("present")}
            color="emerald"
          />
          <FilterButton
            label="Absent"
            count={counts.absent}
            isActive={activeFilter === "absent"}
            onClick={() => handleFilterClick("absent")}
            color="rose"
          />
          <FilterButton
            label="Exceptions"
            count={counts.exception}
            isActive={activeFilter === "exception"}
            onClick={() => handleFilterClick("exception")}
            color="orange"
          />
        </div>
      </motion.div>

      {/* Map and Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="relative">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                options={mapOptions}
              >
                {filteredData.map((crp) => (
                  <Marker
                    key={crp.id}
                    position={crp.coordinates}
                    onClick={() => setSelectedMarker(crp)}
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                      fillColor: statusConfig[crp.status].markerColor,
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                      scale: 8
                    }}
                  />
                ))}

                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.coordinates}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold text-slate-900 mb-1">{selectedMarker.name}</h3>
                      <p className="text-xs text-slate-600 mb-1">{selectedMarker.id}</p>
                      <p className="text-xs text-slate-500">{selectedMarker.location}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                          Status: <span className={`font-semibold ${statusConfig[selectedMarker.status].textColor}`}>
                            {selectedMarker.status.charAt(0).toUpperCase() + selectedMarker.status.slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>

            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 p-3 shadow-lg">
              <div className="text-xs text-slate-600 font-medium mb-1">Current Center</div>
              <div className="text-sm font-bold text-slate-900">
                {center.lat.toFixed(4)}°N {center.lng.toFixed(4)}°E
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  Directions
                </button>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  View larger map
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CRP Locations Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit max-h-[600px] overflow-hidden flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            CRP Locations ({filteredData.length})
          </h3>

          <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: "520px" }}>
            {filteredData.map((crp, index) => (
              <CRPLocationCard
                key={crp.id}
                crp={crp}
                isExpanded={expandedCard === crp.id}
                onToggle={() => setExpandedCard(expandedCard === crp.id ? null : crp.id)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Filter Button Component
const FilterButton = memo(function FilterButton({ label, count, isActive, onClick, color }) {
  const colorStyles = {
    slate: {
      active: "bg-slate-700 text-white border-slate-700",
      inactive: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
    },
    emerald: {
      active: "bg-emerald-600 text-white border-emerald-600",
      inactive: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
    },
    rose: {
      active: "bg-rose-600 text-white border-rose-600",
      inactive: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
    },
    orange: {
      active: "bg-orange-600 text-white border-orange-600",
      inactive: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border font-semibold text-sm transition-all duration-200 ${
        isActive ? colorStyles[color].active : colorStyles[color].inactive
      }`}
    >
      {label} ({count})
    </button>
  );
});

// CRP Location Card Component
const CRPLocationCard = memo(function CRPLocationCard({ crp, isExpanded, onToggle, index }) {
  const config = statusConfig[crp.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border ${config.borderColor} ${config.bgColor} rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md`}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start justify-between text-left"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className={`${config.dotColor} w-2 h-2 rounded-full mt-2`} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{crp.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{crp.id}</p>
            <p className="text-xs text-slate-600 mt-1 truncate">{crp.location}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-200/50 pt-3">
              {/* Coordinates */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Coordinates</p>
                  <p className="text-xs text-slate-700 font-mono">
                    {crp.coordinates.lat.toFixed(4)}, {crp.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Accuracy</p>
                  <p className="text-xs text-slate-700">{crp.accuracy}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Last Updated</p>
                  <p className="text-xs text-slate-700">{crp.timestamp}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
