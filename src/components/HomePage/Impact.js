import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { ArrowRight } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const impactStories = [
    {
        category: "CRP NETWORK",
        title: "How Automated Tracking Reduced Honorarium Delays by 60%",
        bgClass: "bg-[url('/tracking.jpg')] bg-cover bg-center",
    },
    {
        category: "NORTH GOA DISTRICT",
        title: "Digitizing Panchayat Records: A Leap Towards 100% Transparency",
        bgClass: "bg-[url('/digi.png')] bg-cover bg-center",
    },
    {
        category: "BARDEZ TALUKA",
        title: "Empowering Local Volunteers and Self-Help Groups with Per-Day Wage Payment System",
        bgClass: "bg-[url('/j.jpeg')] bg-cover bg-center",
    },
    {
        category: "SOUTH GOA DISTRICT",
        title: "Sustainable Rural Infrastructure: Upgrading 50+ Village Centers",
        bgClass: "bg-[url('/road.jpg')] bg-cover bg-center",
    }
];

export const Impact = () => {
    return (
        <section id="impact" className={`pt-24 bg-gray-100 ${poppins.className}`}>
            <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h4 className="text-[#1e2b58] font-extrabold text-sm tracking-[0.15em] uppercase mb-3">Stories of Change</h4>
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#0f172a] tracking-tight">The Impact Grid</h2>
                </div>
               
            </div>

            <div className="w-full relative">
                <ScrollStack
                    useWindowScroll={true}
                    itemDistance={40}
                    itemStackDistance={35}
                    className="max-w-5xl mx-auto"
                >
                    {impactStories.map((story, idx) => (
                        <ScrollStackItem
                            key={idx}
                            itemClassName={`flex flex-col justify-end p-10 md:p-14 text-white overflow-hidden ${story.bgClass}`}
                        >
                            {/* Dark overlay for better text readability against bright images */}
                            <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-[40px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none rounded-[40px]" />
                            <div className="relative z-10">
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 block opacity-80">
                                    {story.category}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl text-white drop-shadow-lg">
                                    {story.title}
                                </h3>
                            </div>
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>
        </section>
    );
};
