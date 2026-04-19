import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, ArrowRight, Shield } from 'lucide-react';

export const Cta = () => {
    return (
        <section className="px-6 py-20 lg:px-8 bg-gradient-to-br from-tech-blue-600 via-steel-600 to-tech-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Access the Secure Portal
                    </h2>
                    <p className="text-lg text-tech-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Authorized government officials and CRPs can access the system using
                        their official credentials. All access is logged and monitored for security.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-tech-blue-600 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                    >
                        <Lock size={22} />
                        Login to CRP Portal
                        <ArrowRight size={22} />
                    </Link>
                    <p className="mt-6 text-sm text-tech-blue-100 flex items-center justify-center gap-2">
                        <Shield size={16} />
                        <span>Verified Government Access Only • Role-Based Authentication</span>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
