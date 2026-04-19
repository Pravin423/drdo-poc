import React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import { CheckCircle2 } from 'lucide-react';
import BorderGlow from './BorderGlow';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function Journery() {
    const features = [
        "Local leadership training for every CRP",
        "Direct financial support for woman-led SHGs",
        "Digital literacy for rural micro-entrepreneurs"
    ];

    return (
        <section className="px-6 py-28 bg-[#f8f9fc] flex justify-center items-center overflow-hidden">
            <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                {/* Left Side - Image/Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-1/2 relative"
                >
                    {/* Shadow glow */}
                    <div className="absolute inset-0 bg-[#293e90]/10 blur-[60px] rounded-[3rem] transform -rotate-3 scale-105" />

                    {/* Main Image Container */}
                    <BorderGlow
                        className="relative aspect-square w-full max-w-[500px] mx-auto shadow-[0_20px_50px_-15px_rgba(41,62,144,0.15)] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
                        backgroundColor="#f8f9fc"
                        borderRadius={40}
                        glowColor="210 100 60"
                        glowIntensity={2.5}
                        fillOpacity={0.9}
                        colors={['#1e40af', '#3b82f6', '#60a5fa']}
                        animated={true}
                    >
                        <div className="w-full h-full flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                            <img
                                src="/Seal_of_Goa.webp"
                                alt="Seal of Goa"
                                className="w-full h-full object-contain drop-shadow-2xl"
                                onError={(e) => {
                                    // Fallback if image doesn't exist yet
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </BorderGlow>
                </motion.div>

                {/* Right Side - Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-1/2 flex flex-col"
                >
                    <h4 className={`text-[#293e90] text-[13px] font-black tracking-[0.15em] uppercase mb-4 ${poppins.className}`}>
                        Our Shared Journey
                    </h4>

                    <h2 className={`text-4xl md:text-5xl lg:text-[52px] font-black text-[#0f172a] tracking-tight leading-[1.15] mb-6 ${poppins.className}`}>
                        Connecting Hearts &<br className="hidden lg:block" /> Building Communities
                    </h2>

                    <p className={`text-[17px] text-slate-500 font-medium leading-relaxed mb-10 ${poppins.className}`}>
                        For over a decade, DRDA Goa has been the catalyst for rural transformation. We believe that true development starts from within the community, led by the voices of those who know the land best.
                    </p>

                    <div className="flex flex-col gap-5 mb-10">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ duration: 0.8, delay: 0.5 + (index * 0.15), ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-4"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#293e90]/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-[#293e90]" />
                                </div>
                                <span className={`text-[16px] font-bold text-[#1e2b58] ${poppins.className}`}>
                                    {feature}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button className={`bg-[#293e90] hover:bg-[#1e2b58] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(41,62,144,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(41,62,144,0.6)] hover:-translate-y-1 ${poppins.className}`}>
                            Learn More About DRDA
                        </button>
                    </motion.div>

                </motion.div>

            </div>
        </section>
    );
}
