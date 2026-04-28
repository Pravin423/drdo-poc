import React, { useState, useEffect } from 'react';
import { MapPin, Map, Home, Users, ArrowRight, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import SummaryCard from '../../common/SummaryCard';

export default function DistrictDetailOverview({ districtId, assignedTalukaIds = [] }) {
    const [districtData, setDistrictData] = useState(null);
    const [talukas, setTalukas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!districtId) return;
            setIsLoading(true);
            try {
                // Parse assignedTalukaIds if it's a string (e.g. '["25","26"]')
                let parsedTalukaIds = assignedTalukaIds;
                if (typeof assignedTalukaIds === 'string' && assignedTalukaIds.startsWith('[')) {
                    try {
                        parsedTalukaIds = JSON.parse(assignedTalukaIds);
                    } catch (e) {
                        console.error("Error parsing assignedTalukaIds:", e);
                    }
                }
                const idsArray = Array.isArray(parsedTalukaIds) 
                    ? parsedTalukaIds.map(String) 
                    : [String(parsedTalukaIds)];

                // Fetch ALL Districts to find the name (more reliable)
                let foundDistrict = null;
                const distListRes = await fetch(`/api/districts`);
                const distListJson = await distListRes.json();
                
                if (distListJson.status && distListJson.data) {
                    foundDistrict = distListJson.data.find(d => String(d.id) === String(districtId));
                    if (foundDistrict) {
                        setDistrictData(foundDistrict);
                    }
                }

                // If not found in list, fallback to details API
                if (!foundDistrict) {
                    const distRes = await fetch(`/api/district-details?id=${districtId}`);
                    const distJson = await distRes.json();
                    if (distJson.status && distJson.data) {
                        const dData = distJson.data.data || distJson.data;
                        foundDistrict = dData;
                        setDistrictData(dData);
                    }
                }
                
                console.log("[Dashboard] Matched District Data:", foundDistrict);

                // Fetch Talukas for this district
                const talRes = await fetch(`/api/talukas?district_id=${districtId}`);
                const talJson = await talRes.json();
                if (talJson.status && talJson.data) {
                    const allTalukas = talJson.data;
                    // Filter the list to only show assigned ones
                    const filtered = allTalukas.filter(t => idsArray.includes(String(t.id)));
                    setTalukas(filtered);
                }
            } catch (err) {
                console.error("Error fetching district overview data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [districtId, assignedTalukaIds]);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-32 bg-slate-100 rounded-3xl" />
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-3xl" />)}
                </div>
            </div>
        );
    }

    const districtName = districtData?.distName || districtData?.name || districtData?.dist_name || "N/A";

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="relative group">
                    <SummaryCard 
                        title="Assigned District"
                        value={districtName}
                        icon={MapPin}
                        variant="blue"
                        delay={0.1}
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                         <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg shadow-sm border border-blue-200">ID: {districtId}</span>
                    </div>
                </div>

                <div className="relative group">
                    <SummaryCard 
                        title="Appointed Blocks"
                        value={talukas.length}
                        icon={Map}
                        variant="emerald"
                        delay={0.2}
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
                        {talukas.slice(0, 2).map(t => (
                            <span key={t.id} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg shadow-sm border border-emerald-200">
                                {t.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative group">
                    <SummaryCard 
                        title="Status"
                        value="Active"
                        icon={Activity}
                        variant="amber"
                        delay={0.3}
                    />
                    <div className="absolute top-6 right-8 z-20">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                             <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}
