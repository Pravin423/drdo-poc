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
          className="bg-[#293e90] text-white px-12 py-5 rounded-full font-bold text-lg shadow-[0_8px_30px_rgb(41,62,144,0.3)] z-10 relative"
        >
          State Headquarters (DRDA)
        </motion.div>

        {/* Stem down from State HQ */}
        <div className="w-0 h-10 border-l-[2.5px] border-dashed border-slate-300" />

        {/* Level 2 Container (Districts) */}
        <div className="flex w-full max-w-4xl justify-center relative">

          {/* North Goa Branch (Left) */}
          <div className="flex-1 flex flex-col items-center relative px-2 sm:px-4">
            {/* Curvy Dotted Connection */}
            <div className="absolute top-0 right-0 w-[50%] h-12 border-t-[2.5px] border-l-[2.5px] border-dashed border-slate-300 rounded-tl-[2rem]" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-12 bg-white border border-slate-200/60 px-10 py-8 rounded-[2.5rem] text-[#293e90] font-bold text-lg shadow-[0_10px_40px_rgb(0,0,0,0.04)] w-full max-w-[320px] text-center z-10 relative"
            >
              North Goa District
            </motion.div>

            {/* Stem down from North Goa */}
            <div className="w-0 h-10 border-l-[2.5px] border-dashed border-slate-300" />

            {/* North Goa Talukas */}
            <div className="flex w-full justify-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col items-center relative px-2 sm:px-3"
              >
                {/* Left curve */}
                <div className="absolute top-0 right-0 w-[50%] h-10 border-t-[2.5px] border-l-[2.5px] border-dashed border-slate-300 rounded-tl-3xl" />
                
                <div className="mt-10 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50 relative z-10">
                  TALUKA LEVEL
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex-1 flex flex-col items-center relative px-2 sm:px-3 opacity-80"
              >
                {/* Right curve */}
                <div className="absolute top-0 left-0 w-[50%] h-10 border-t-[2.5px] border-r-[2.5px] border-dashed border-slate-300 rounded-tr-3xl" />

                <div className="mt-10 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50 relative z-10">
                  TALUKA LEVEL
                </div>
              </motion.div>
            </div>
          </div>

          {/* South Goa Branch (Right) */}
          <div className="flex-1 flex flex-col items-center relative px-2 sm:px-4">
            {/* Curvy Dotted Connection */}
            <div className="absolute top-0 left-0 w-[50%] h-12 border-t-[2.5px] border-r-[2.5px] border-dashed border-slate-300 rounded-tr-[2rem]" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12 bg-white border border-slate-200/60 px-10 py-8 rounded-[2.5rem] text-[#293e90] font-bold text-lg shadow-[0_10px_40px_rgb(0,0,0,0.04)] w-full max-w-[320px] text-center z-10 relative"
            >
              South Goa District
            </motion.div>

            {/* Stem down from South Goa */}
            <div className="w-0 h-10 border-l-[2.5px] border-dashed border-slate-300" />

            {/* South Goa Talukas */}
            <div className="flex w-full justify-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-1 flex flex-col items-center relative px-2 sm:px-3 opacity-50"
              >
                {/* Left curve */}
                <div className="absolute top-0 right-0 w-[50%] h-10 border-t-[2.5px] border-l-[2.5px] border-dashed border-slate-300 rounded-tl-3xl" />
                
                <div className="mt-10 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50 relative z-10">
                  TALUKA LEVEL
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex-1 flex flex-col items-center relative px-2 sm:px-3 opacity-30"
              >
                {/* Right curve */}
                <div className="absolute top-0 left-0 w-[50%] h-10 border-t-[2.5px] border-r-[2.5px] border-dashed border-slate-300 rounded-tr-3xl" />
                
                <div className="mt-10 bg-[#f4f6fa] text-[#293e90] px-6 py-3 rounded-full text-xs font-bold tracking-widest whitespace-nowrap border border-blue-50/50 relative z-10">
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
