import React from 'react'
import { motion } from "framer-motion";
import { Search, ListFilter } from "lucide-react";
import Link from "next/link";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 px-6">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    src="/herobackground.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Bottom fade to white */}
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto mt-12">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-center mt-[50px] mb-8"
                >
                    <h1 className={`text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.2] tracking-tight ${poppins.className}`}>
                        Empowering Rural <span className="relative inline-block">
                            Goa,
                            <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-white rounded-full"></span>
                        </span><br />
                        Together
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`text-lg md:text-xl text-white/95 text-center max-w-3xl mx-auto leading-relaxed mb-10 ${poppins.className} font-medium`}
                >
                    Connecting dedicated Community Resource Persons with village<br className="hidden md:block" />
                    elders and Self-Help Groups to build a resilient and vibrant future for<br className="hidden md:block" />
                    every household.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-5 mb-17"
                >
                    <button className={`px-8 py-3.5 rounded-full bg-[#293e90] text-white font-semibold text-lg hover:bg-[#1e2b58] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${poppins.className}`}>
                        Explore Our Journey
                    </button>
                    <button className={`px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${poppins.className}`}>
                        Watch the Impact
                    </button>
                </motion.div>

                {/* Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full max-w-4xl bg-white rounded-full p-2.5 shadow-2xl flex items-center border border-slate-100"
                >
                    <div className="flex-1 flex items-center px-4">
                        <Search className="text-slate-400 w-6 h-6 mr-3" />
                        <input
                            type="text"
                            placeholder="Search for CRPs, SHGs, or specific modules..."
                            className={`w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-lg ${poppins.className}`}
                        />
                    </div>
                    <button className={`shrink-0 flex items-center gap-2 px-6 py-3.5 bg-[#0f172a] text-white rounded-full font-medium hover:bg-slate-800 transition-colors ${poppins.className}`}>
                        <ListFilter className="w-5 h-5" />
                        <span>Advanced Search</span>
                    </button>
                </motion.div>

            </div>
        </section>
    )
}
