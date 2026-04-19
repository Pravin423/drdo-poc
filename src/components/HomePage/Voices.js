import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const testimonials = [
    {
        id: 1,
        name: "Anita Fernandes",
        role: "Community Resource Person, Quepem",
        quote: "Joining the DRDA as a CRP didn't just give me a job, it gave me a voice. Today, I'm proud to help other women in my village start their own businesses and send their children to school.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
    },
    {
        id: 2,
        name: "Rajesh Naik",
        role: "Community Resource Person, Ponda",
        quote: "Being a CRP has allowed me to bridge the gap between government schemes and the people who need them most. Seeing a family get their first loan is incredibly rewarding.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
    },
    {
        id: 3,
        name: "Sunita D'Souza",
        role: "Self-Help Group Leader, Canacona",
        quote: "The guidance we received from the DRDA team transformed our small stitching unit into a thriving local business. We are now self-reliant and helping others in our community.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita"
    }
];

const Voices = () => {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    const nextStep = useCallback(() => {
        setDirection(1);
        setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, []);

    const prevStep = useCallback(() => {
        setDirection(-1);
        setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextStep, 5000);
        return () => clearInterval(timer);
    }, [isHovered, nextStep]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <section id="voices" className={`py-24 bg-[#f8fafc] relative overflow-hidden ${poppins.className}`}>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-12 w-64 h-64 bg-blue-100/50 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-indigo-100/50 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-[#293e90] font-extrabold text-sm tracking-[0.15em] uppercase mb-3">Community Impact</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#0f172a] tracking-tight">Voices of Goa</h2>
                    </motion.div>

                    <div className="hidden md:flex gap-4 mb-2">
                        <button
                            onClick={prevStep}
                            className="p-4 rounded-full bg-white shadow-sm border border-slate-200 text-[#293e90] hover:bg-[#293e90] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextStep}
                            className="p-4 rounded-full bg-white shadow-sm border border-slate-200 text-[#293e90] hover:bg-[#293e90] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className="relative max-w-5xl mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-white/50 p-10 md:p-20 overflow-hidden">
                        {/* Quote Icon Background */}
                        <div className="absolute top-10 left-10 text-slate-100/80">
                            <Quote size={120} strokeWidth={1} />
                        </div>

                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4 }
                                }}
                                className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
                            >
                                {/* Image Side */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-inner group relative">
                                        <img
                                            src={testimonials[index].image}
                                            alt={testimonials[index].name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    {/* Decorative badge */}
                                    <div className="absolute -bottom-4 -right-4 bg-[#293e90] text-white p-3 rounded-2xl shadow-lg">
                                        <Quote size={20} fill="currentColor" />
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="flex-1 text-center lg:text-left">
                                    <blockquote className="text-xl md:text-3xl text-[#1e293b] font-semibold leading-[1.4] mb-10 italic">
                                        "{testimonials[index].quote}"
                                    </blockquote>

                                    <div>
                                        <h4 className="text-2xl font-black text-[#0f172a] mb-2">{testimonials[index].name}</h4>
                                        <div className="flex items-center justify-center lg:justify-start gap-3">
                                            <span className="w-8 h-px bg-[#293e90]/30 hidden md:block" />
                                            <p className="text-[#293e90] font-extrabold text-sm tracking-widest uppercase">
                                                {testimonials[index].role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > index ? 1 : -1);
                                    setIndex(i);
                                }}
                                className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-12 bg-[#293e90]' : 'w-2 bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex justify-center md:hidden gap-6 mt-10">
                        <button
                            onClick={prevStep}
                            className="p-4 rounded-full bg-white shadow-md border border-slate-100 text-[#293e90] active:scale-90"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextStep}
                            className="p-4 rounded-full bg-white shadow-md border border-slate-100 text-[#293e90] active:scale-90"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Voices;