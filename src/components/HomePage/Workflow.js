import React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import { Building2, Map, MapPin, Home } from 'lucide-react';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const Workflow = () => {
    const lineStyle = "border-dashed border-[#293e90]/30";

    return (
        <section className="px-6 py-32 bg-[#f8f9fc] min-h-screen flex flex-col items-center">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-5xl mb-28 relative z-10 flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12"
            >
                <div className="text-left flex-1 relative">
                    {/* Subtle glow behind the title */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#293e90]/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Subtitle */}
                    <h4 className={`text-[#293e90] text-sm font-bold tracking-[0.2em] uppercase mb-4 relative z-10 ${poppins.className}`}>
                        Organizational Structure
                    </h4>

                    {/* Title */}
                    <h2 className={`text-4xl md:text-[64px] font-black tracking-tight leading-[1.05] relative z-10 ${poppins.className}`}>
                        <span className="text-[#0f172a]">Strategic
                            Governance
                        </span>
                    </h2>
                </div>

                {/* Right side floating card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="max-w-[420px] p-7 md:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(41,62,144,0.08)] border border-white flex-shrink-0 mt-4 md:mt-6 relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(41,62,144,0.12)] transition-shadow duration-500"
                >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#293e90] to-[#4361ee] group-hover:w-2 transition-all duration-300" />
                    <p className={`text-[16px] text-slate-500 font-medium text-left leading-relaxed ${poppins.className}`}>
                        A streamlined flow of accountability and operations, ensuring policies formulated at the <strong className="text-[#1e2b58]">State level</strong> are effectively executed across every <strong className="text-[#1e2b58]">community</strong>.
                    </p>
                </motion.div>
            </motion.div>

            {/* Tree Container */}
            <div className={`flex flex-col items-center w-full max-w-5xl relative z-10 ${poppins.className}`}>

                {/* Level 1: State HQ */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-4 bg-gradient-to-r from-[#1e2b58] to-[#293e90] text-white px-10 py-5 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(41,62,144,0.5)] border border-white/10">
                        <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                            <Building2 className="w-6 h-6 text-blue-50" />
                        </div>
                        <span className="font-bold text-[19px] tracking-wide">State Headquarters (DRDA)</span>
                    </div>
                </motion.div>

                {/* Stem down from State HQ */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3, ease: "linear" }}
                    style={{ transformOrigin: 'top' }}
                    className={`w-0 h-10 border-l-[2px] ${lineStyle}`}
                />

                {/* Level 2 Container (Districts) */}
                <div className="flex w-full max-w-4xl justify-center relative">

                    {/* North Goa Branch (Left) */}
                    <div className="flex-1 flex flex-col items-center relative px-2 sm:px-4">
                        {/* Curvy Dotted Connection */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7, ease: "linear" }}
                            className={`absolute top-0 right-0 w-[50%] h-12 border-t-[2px] border-l-[2px] rounded-tl-[2rem] ${lineStyle}`}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -15 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.1 }}
                            className="mt-12 bg-white border border-[#293e90]/10 px-8 py-7 rounded-[2rem] text-[#1e2b58] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] w-full max-w-[320px] flex flex-col items-center gap-4 relative z-10 hover:-translate-y-1 transition-transform duration-300 cursor-default"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-[#f8f9fc] to-blue-50/50 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-[#293e90]/10">
                                <Map className="w-6 h-6 text-[#293e90]" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl tracking-tight">North Goa District</span>
                        </motion.div>

                        {/* Stem down from North Goa */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.4, ease: "linear" }}
                            style={{ transformOrigin: 'top' }}
                            className={`w-0 h-10 border-l-[2px] ${lineStyle}`}
                        />

                        {/* North Goa Talukas */}
                        <div className="flex w-full justify-center">

                            <div className="flex-1 flex flex-col items-center relative px-2 sm:px-3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 1.8, ease: "linear" }}
                                    className={`absolute top-0 right-0 w-[50%] h-10 border-t-[2px] border-l-[2px] rounded-tl-3xl ${lineStyle}`}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 2.2 }}
                                    className="mt-10 bg-white px-5 py-3 rounded-xl text-[#293e90] text-[13px] font-bold tracking-[0.15em] whitespace-nowrap border border-[#293e90]/15 shadow-sm flex items-center gap-2.5 relative z-10"
                                >
                                    <MapPin className="w-4 h-4 text-[#293e90]/60" />
                                    <span>TALUKA LEVEL</span>
                                </motion.div>

                                {/* Stem down to Village */}
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 2.6, ease: "linear" }}
                                    style={{ transformOrigin: 'top' }}
                                    className={`w-0 h-8 border-l-[2px] ${lineStyle}`}
                                />

                                {/* Village Level Node */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 3.0 }}
                                    className="bg-white px-4 py-2 rounded-lg text-slate-600 text-[12px] font-semibold tracking-wide whitespace-nowrap border border-slate-200/50 flex items-center gap-2 relative z-10 shadow-sm"
                                >
                                    <Home className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Village Panchayat</span>
                                </motion.div>
                            </div>

                            <div className="flex-1 flex flex-col items-center relative px-2 sm:px-3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 1.8, ease: "linear" }}
                                    className={`absolute top-0 left-0 w-[50%] h-10 border-t-[2px] border-r-[2px] rounded-tr-3xl ${lineStyle}`}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 2.2 }}
                                    className="mt-10 bg-white px-5 py-3 rounded-xl text-[#293e90] text-[13px] font-bold tracking-[0.15em] whitespace-nowrap border border-[#293e90]/15 shadow-sm flex items-center gap-2.5 relative z-10"
                                >
                                    <MapPin className="w-4 h-4 text-[#293e90]/60" />
                                    <span>TALUKA LEVEL</span>
                                </motion.div>

                                {/* Stem down to Village */}
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 2.6, ease: "linear" }}
                                    style={{ transformOrigin: 'top' }}
                                    className={`w-0 h-8 border-l-[2px] ${lineStyle}`}
                                />

                                {/* Village Level Node */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 3.0 }}
                                    className="bg-white px-4 py-2 rounded-lg text-slate-600 text-[12px] font-semibold tracking-wide whitespace-nowrap border border-slate-200/50 flex items-center gap-2 relative z-10 shadow-sm"
                                >
                                    <Home className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Village Panchayat</span>
                                </motion.div>
                            </div>

                        </div>
                    </div>

                    {/* South Goa Branch (Right) */}
                    <div className="flex-1 flex flex-col items-center relative px-2 sm:px-4">
                        {/* Curvy Dotted Connection */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7, ease: "linear" }}
                            className={`absolute top-0 left-0 w-[50%] h-12 border-t-[2px] border-r-[2px] rounded-tr-[2rem] ${lineStyle}`}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -15 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.1 }}
                            className="mt-12 bg-white/90 backdrop-blur-xl border border-[#293e90]/10 px-8 py-7 rounded-[2rem] text-[#1e2b58] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] w-full max-w-[320px] flex flex-col items-center gap-4 relative z-10 hover:-translate-y-1 transition-transform duration-300 cursor-default"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-[#f8f9fc] to-blue-50/50 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-[#293e90]/10">
                                <Map className="w-6 h-6 text-[#293e90]" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl tracking-tight">South Goa District</span>
                        </motion.div>

                        {/* Stem down from South Goa */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.4, ease: "linear" }}
                            style={{ transformOrigin: 'top' }}
                            className={`w-0 h-10 border-l-[2px] ${lineStyle}`}
                        />

                        {/* South Goa Talukas */}
                        <div className="flex w-full justify-center">

                            <div className="flex-1 flex flex-col items-center relative px-2 sm:px-3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 1.8, ease: "linear" }}
                                    className={`absolute top-0 right-0 w-[50%] h-10 border-t-[2px] border-l-[2px] rounded-tl-3xl ${lineStyle}`}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 2.2 }}
                                    className="mt-10 bg-white/80 backdrop-blur-md px-5 py-3 rounded-xl text-[#293e90] text-[13px] font-bold tracking-[0.15em] whitespace-nowrap border border-[#293e90]/15 shadow-sm flex items-center gap-2.5 relative z-10"
                                >
                                    <MapPin className="w-4 h-4 text-[#293e90]/60" />
                                    <span>TALUKA LEVEL</span>
                                </motion.div>

                                {/* Stem down to Village */}
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 2.6, ease: "linear" }}
                                    style={{ transformOrigin: 'top' }}
                                    className={`w-0 h-8 border-l-[2px] ${lineStyle}`}
                                />

                                {/* Village Level Node */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 3.0 }}
                                    className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg text-slate-600 text-[12px] font-semibold tracking-wide whitespace-nowrap border border-slate-200/50 flex items-center gap-2 relative z-10 shadow-sm"
                                >
                                    <Home className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Village Panchayat</span>
                                </motion.div>
                            </div>

                            <div className="flex-1 flex flex-col items-center relative px-2 sm:px-3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 1.8, ease: "linear" }}
                                    className={`absolute top-0 left-0 w-[50%] h-10 border-t-[2px] border-r-[2px] rounded-tr-3xl ${lineStyle}`}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 2.2 }}
                                    className="mt-10 bg-white/80 backdrop-blur-md px-5 py-3 rounded-xl text-[#293e90] text-[13px] font-bold tracking-[0.15em] whitespace-nowrap border border-[#293e90]/15 shadow-sm flex items-center gap-2.5 relative z-10"
                                >
                                    <MapPin className="w-4 h-4 text-[#293e90]/60" />
                                    <span>TALUKA LEVEL</span>
                                </motion.div>

                                {/* Stem down to Village */}
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 2.6, ease: "linear" }}
                                    style={{ transformOrigin: 'top' }}
                                    className={`w-0 h-8 border-l-[2px] ${lineStyle}`}
                                />

                                {/* Village Level Node */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 3.0 }}
                                    className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg text-slate-600 text-[12px] font-semibold tracking-wide whitespace-nowrap border border-slate-200/50 flex items-center gap-2 relative z-10 shadow-sm"
                                >
                                    <Home className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Village Panchayat</span>
                                </motion.div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
