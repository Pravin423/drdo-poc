import {
    MapPin,
    Search,
    Plus,
    Filter,
    Download,
    MoreVertical,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Users,
    Map,
    Eye
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";

// Mock Data for Goa Districts
const DISTRICTS_DATA = [
    {
        id: "DST-001",
        name: "North Goa",
        headquarters: "Panaji",
        talukas: 6,
        villages: 212,
        activeCRPs: 4850,
        status: "Active",
        lastUpdated: "30 Jan 2026, 10:30 AM"
    },
    {
        id: "DST-002",
        name: "South Goa",
        headquarters: "Margao",
        talukas: 6,
        villages: 184,
        activeCRPs: 4120,
        status: "Active",
        lastUpdated: "29 Jan 2026, 04:15 PM"
    }
];

const SUMMARY_CARDS = [
    {
        label: "Total Districts",
        value: "2",
        delta: "State of Goa",
        isPositive: true,
        icon: MapPin,
        accent: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
        label: "Total Talukas",
        value: "12",
        delta: "Across all districts",
        isPositive: true,
        icon: Map,
        accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
        label: "Geocoded Villages",
        value: "396",
        delta: "100% Mapped",
        isPositive: true,
        icon: TrendingUp,
        accent: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
        label: "Active Field CRPs",
        value: "8,970",
        delta: "Deployed",
        isPositive: true,
        icon: Users,
        accent: "text-amber-600 bg-amber-50 border-amber-100",
    },
];

export default function DistrictsManagement() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDistricts = DISTRICTS_DATA.filter((district) =>
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.headquarters.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRole="super-admin">
            <DashboardLayout>
                <div className="max-w-[1600px] mx-auto space-y-8 p-4">

                    {/* Header Section */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                                <div className="p-2.5 bg-tech-blue-100 text-tech-blue-600 rounded-xl">
                                    <MapPin size={24} />
                                </div>
                                District <span className="bg-gradient-to-r from-tech-blue-600 to-emerald-500 bg-clip-text text-transparent">Management</span>
                            </h1>
                            <p className="text-slate-500 font-medium ml-14">
                                Manage and monitor administrative districts across Goa.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                <Download size={16} /> Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-tech-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-tech-blue-700 transition-all shadow-md shadow-tech-blue-500/20 active:scale-95">
                                <Plus size={16} /> Add District
                            </button>
                        </div>
                    </motion.header>

                    {/* Summary Cards */}
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
                                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
                                    <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                                </div>
                            </motion.section>
                        ))}
                    </div>

                    {/* Main Content Area: Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col"
                    >
                        {/* Table Controls Header */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                            <div className="relative max-w-md w-full">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search districts by name or HQ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue-500/20 focus:border-tech-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                                    <Filter size={16} /> Filters
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District ID</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">District Name</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Headquarters</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Jurisdiction</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-transparent">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right bg-transparent">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDistricts.length > 0 ? (
                                        filteredDistricts.map((district, idx) => (
                                            <motion.tr
                                                key={district.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                                        {district.id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-tech-blue-600 transition-colors">
                                                        {district.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">Updated: {district.lastUpdated}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-700">{district.headquarters}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700">{district.talukas}</p>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Talukas</p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-200"></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700">{district.villages}</p>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Villages</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`h-2 w-2 rounded-full ${district.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        <span className="text-xs font-bold text-slate-700">{district.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 text-slate-400 hover:text-tech-blue-600 hover:bg-tech-blue-50 rounded-lg transition-colors" title="View Details">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit District">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete District">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <button className="p-2 text-slate-400 group-hover:hidden transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Map size={32} className="mb-3 opacity-50" />
                                                    <p className="text-sm font-semibold">No districts found matching your search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 bg-slate-50 mt-auto border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-500">
                                Showing all <span className="text-slate-900">{filteredDistricts.length}</span> records
                            </p>
                            <div className="flex gap-2">
                                <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                                    <ChevronLeft size={16} />
                                </button>
                                <button disabled className="p-1.5 text-slate-300 rounded-lg border border-slate-200 bg-white cursor-not-allowed">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
