import React from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const Workflow = () => {
  return (
    <section className="px-6 py-24 bg-[#f8f9fc] min-h-screen flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="text-center mb-16 relative z-10 mt-10">
        <h4 className={`text-[#293e90] text-sm font-bold tracking-[0.2em] uppercase mb-4 ${poppins.className}`}>
          Organizational Structure
        </h4>
        <h2 className={`text-4xl md:text-[54px] font-extrabold text-[#0f172a] mb-6 tracking-tight leading-tight ${poppins.className}`}>
          Strategic Governance
        </h2>
        <p className={`text-[17px] text-slate-500 font-medium ${poppins.className}`}>
          Flow of accountability from State to Community
        </p>
      </div>

      {/* Tree Container */}
      <div className={`flex flex-col items-center w-full max-w-5xl relative z-10 ${poppins.className}`}>
        
        {/* Level 1: State HQ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#293e90] text-white px-12 py-5 rounded-full font-bold text-lg shadow-[0_8px_30px_rgb(41,62,144,0.3)] z-10"
        >
          State Headquarters (DRDA)
        </motion.div>

        {/* Line down */}
        <div className="w-px h-12 bg-slate-300" />

        {/* Level 2 Container */}
        <div className="flex w-full max-w-4xl justify-center relative">
          {/* Horizontal connection */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300" />

          {/* North Goa Branch */}
          <div className="flex-1 flex flex-col items-center relative px-4">
            <div className="w-px h-10 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-10 bg-white border border-slate-200/60 px-10 py-8 rounded-[2.5rem] text-[#293e90] font-bold text-lg shadow-[0_10px_40px_rgb(0,0,0,0.04)] w-full max-w-[320px] text-center z-10"
            >
              North Goa District
            </motion.div>

            <div className="w-px h-12 bg-slate-300" />

            {/* North Goa Talukas */}
            <div className="flex w-full justify-center relative gap-4 sm:gap-6">
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col items-center relative"
              >
                <div className="w-px h-8 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="mt-8 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50">
                  TALUKA LEVEL
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex-1 flex flex-col items-center relative opacity-80"
              >
                <div className="w-px h-8 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="mt-8 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50">
                  TALUKA LEVEL
                </div>
              </motion.div>
            </div>
          </div>

          {/* South Goa Branch */}
          <div className="flex-1 flex flex-col items-center relative px-4">
            <div className="w-px h-10 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 bg-white border border-slate-200/60 px-10 py-8 rounded-[2.5rem] text-[#293e90] font-bold text-lg shadow-[0_10px_40px_rgb(0,0,0,0.04)] w-full max-w-[320px] text-center z-10"
            >
              South Goa District
            </motion.div>

            <div className="w-px h-12 bg-slate-300" />

            {/* South Goa Talukas */}
            <div className="flex w-full justify-center relative gap-4 sm:gap-6">
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-1 flex flex-col items-center relative opacity-50"
              >
                <div className="w-px h-8 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="mt-8 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50">
                  TALUKA LEVEL
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex-1 flex flex-col items-center relative opacity-30"
              >
                <div className="w-px h-8 bg-slate-300 absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="mt-8 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50">
                  TALUKA LEVEL
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
