import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const Counter = ({ from = 0, to, duration = 2.5, decimals = 0, prefix = "", suffix = "" }) => {
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && nodeRef.current) {
            const controls = animate(from, to, {
                duration: duration,
                ease: "easeOut",
                onUpdate(value) {
                    if (nodeRef.current) {
                        nodeRef.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
                    }
                }
            });
            return () => controls.stop();
        }
    }, [from, to, duration, decimals, prefix, suffix, isInView]);

    return <span ref={nodeRef}>{prefix}{from.toFixed(decimals)}{suffix}</span>;
};

export const Stats = () => {
    return (
        <section className={`w-full bg-gradient-to-r from-[#1e2b58] via-[#293e90] to-[#0f172a] py-16 md:py-24 ${poppins.className}`}>
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { to: 12, suffix: "+", decimals: 0, label: "RURAL BLOCKS" },
                        { to: 1.5, suffix: "M", decimals: 1, label: "LIVES IMPACTED" },
                        { to: 450, suffix: "+", decimals: 0, label: "ACTIVE PROJECTS" },
                        { to: 100, suffix: "%", decimals: 0, label: "DIGITAL TRANSPARENCY" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <h3 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-3 md:mb-5 tracking-tight">
                                <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals} />
                            </h3>
                            <p className="text-[11px] md:text-xs lg:text-[13px] font-bold text-blue-200/70 uppercase tracking-[0.2em] whitespace-nowrap">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
