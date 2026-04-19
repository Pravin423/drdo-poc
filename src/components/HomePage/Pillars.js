import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wallet, Leaf, Heart, ArrowRight } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const pillars = [
  {
    title: "Skill Building",
    description: "Continuous training and workshops to keep our CRPs ahead of the curve.",
    icon: Brain,
    color: "bg-blue-50"
  },
  {
    title: "Financial Inclusion",
    description: "Ensuring every rural family has access to modern banking and credit services.",
    icon: Wallet,
    color: "bg-indigo-50"
  },
  {
    title: "Livelihoods",
    description: "Developing sustainable income streams through local agriculture and crafts.",
    icon: Leaf,
    color: "bg-emerald-50"
  },
  {
    title: "Social Inclusion",
    description: "Ensuring no one is left behind, especially the elderly and differently-abled.",
    icon: Heart,
    color: "bg-rose-50"
  }
];

export const Pillars = () => {
  return (
    <section className={`py-24 bg-[#f8fafc] relative overflow-hidden ${poppins.className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header matching the image style */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h4 className="text-[#1e2b58] font-extrabold text-sm tracking-[0.15em] uppercase mb-3">Pillars</h4>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#0f172a] tracking-tight">Our Operational Pillars</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -12 }}
                className="relative p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(41,62,144,0.12)] transition-all duration-500 group overflow-hidden"
              >
                {/* Expanding Background on Hover - From Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-t from-[#293e90] to-[#3b82f6] group-hover:h-full transition-all duration-500 ease-out z-0" />

                <div className={`relative w-16 h-16 rounded-2xl ${pillar.color} group-hover:bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm z-10`}>
                  <Icon className="w-7 h-7 text-[#293e90] group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className={`relative text-2xl font-bold text-[#0f172a] group-hover:text-white mb-4 tracking-tight transition-colors duration-500 z-10 ${poppins.className}`}>
                  {pillar.title}
                </h3>

                <p className={`relative text-slate-500 group-hover:text-white/90 leading-relaxed text-[16px] font-medium transition-colors duration-500 z-10 ${poppins.className}`}>
                  {pillar.description}
                </p>

                {/* Subtle bottom line indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
