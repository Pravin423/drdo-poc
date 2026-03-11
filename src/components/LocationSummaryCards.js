import React, { useState, useEffect } from 'react';
import { MapPin, Map, Home, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationSummaryCards({
    totalDistricts = 0,
    totalTalukas = 0,
    totalVillages = 0,
    activeCrps = "8,970"
}) {
    const [counts, setCounts] = useState({
        districts: totalDistricts,
        talukas: totalTalukas,
        villages: totalVillages
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [distRes, talRes, vilRes] = await Promise.all([
                    fetch('/api/districts', { headers }).catch(() => null),
                    fetch('/api/talukas', { headers }).catch(() => null),
                    fetch('/api/villages', { headers }).catch(() => null)
                ]);

                let distCount = counts.districts;
                if (distRes && distRes.ok) {
                    const distData = await distRes.json();
                    const distArray = Array.isArray(distData.data) ? distData.data : (Array.isArray(distData) ? distData : []);
                    distCount = distArray.length;
                }

                let talCount = counts.talukas;
                if (talRes && talRes.ok) {
                    const talData = await talRes.json();
                    const talArray = Array.isArray(talData.data) ? talData.data : (Array.isArray(talData) ? talData : []);
                    talCount = talArray.length;
                }

                let vilCount = counts.villages;
                if (vilRes && vilRes.ok) {
                    const vilData = await vilRes.json();
                    const vilArray = Array.isArray(vilData.data) ? vilData.data : (Array.isArray(vilData) ? vilData : []);
                    vilCount = vilArray.length;
                }

                setCounts(prev => ({
                    ...prev,
                    districts: distCount,
                    talukas: talCount,
                    villages: vilCount
                }));

            } catch (err) {
                console.error("Error fetching summary counts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounts();
    }, [totalDistricts, totalTalukas, totalVillages]);

    const SUMMARY_CARDS = [
        {
            label: "Total Districts",
            value: counts.districts.toString(),
            delta: "State of Goa",
            icon: MapPin,
            accent: "text-blue-600 bg-blue-50 border-blue-100",
        },
        {
            label: "Total Talukas",
            value: counts.talukas.toString(),
            delta: "Across all districts",
            icon: Map,
            accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
        {
            label: "Total Villages",
            value: counts.villages.toString(),
            delta: "100% Mapped",
            icon: Home,
            accent: "text-purple-600 bg-purple-50 border-purple-100",
        },
        {
            label: "Active Field CRPs",
            value: activeCrps.toString(),
            delta: "Deployed",
            icon: Users,
            accent: "text-amber-600 bg-amber-50 border-amber-100",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SUMMARY_CARDS.map((card, index) => (
                <motion.section
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-2xl ${card.accent} border`}>
                            <card.icon size={22} />
                        </div>
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full">
                            {card.delta}
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        {isLoading ? (
                            <div className="h-9 w-12 bg-slate-200 rounded animate-pulse" />
                        ) : (
                            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
                        )}
                        <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                    </div>
                </motion.section>
            ))}
        </div>
    );
}
