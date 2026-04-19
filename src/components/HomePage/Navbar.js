import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-poppins' });

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Color change threshold
            setIsScrolled(currentScrollY > 20);
            
            // Smart collapse logic: hide when scrolling down past 300px, show when scrolling up
            if (currentScrollY > 500) {
                if (currentScrollY > lastScrollY.current) {
                    setIsHidden(true);
                } else {
                    setIsHidden(false);
                }
            } else {
                setIsHidden(false);
            }
            
            lastScrollY.current = currentScrollY;
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-700 ease-in-out ${
            isScrolled ? 'border-transparent shadow-lg' : 'border-slate-200 shadow-none'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
            {/* Solid White Background Overlay */}
            <div 
                className={`absolute inset-0 bg-white transition-opacity duration-700 ease-in-out pointer-events-none ${
                    isScrolled ? 'opacity-0' : 'opacity-100'
                }`} 
            />

            {/* Smooth Gradient Background Overlay */}
            <div 
                className={`absolute inset-0 bg-gradient-to-r from-[#1e2b58] via-[#293e90] to-[#0f172a] transition-opacity duration-700 ease-in-out pointer-events-none ${
                    isScrolled ? 'opacity-100' : 'opacity-0'
                }`} 
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-3.5">
                <div className="flex items-center justify-between">

                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-4">
                        <div className="relative h-[63px] w-[63px]">
                            {/* Standard Logo */}
                            <Image
                                src="/Seal_of_Goa.webp"
                                alt="Government of Goa Seal"
                                fill
                                sizes="63px"
                                priority
                                className={`object-contain transition-opacity duration-700 ease-in-out ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
                            />
                            {/* White Inverted Logo for Scrolled State */}
                            <Image
                                src="/Seal_of_Goa.webp"
                                alt="Government of Goa Seal"
                                fill
                                sizes="63px"
                                priority
                                className={`object-contain brightness-0 invert transition-opacity duration-700 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </div>

                        <div className="leading-tight ">
                            <h1 className={`text-[15px] ${poppins.className} font-bold transition-colors duration-700 ${isScrolled ? 'text-white' : 'text-slate-900'}`}>
                               Department of Goa Rural Development Agency
                            </h1>
                            <p className={`text-[12px] ${poppins.className} uppercase font-medium tracking-widest mt-[-2px] transition-colors duration-700 ${isScrolled ? 'text-blue-100' : 'text-slate-600'}`}>
                                Government of Goa
                            </p>
                        </div>
                    </div>

                    {/* Center: Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {['About Us', 'Services', 'Schemes', 'Tenders', 'Contact'].map((item) => {
                            const isActive = item === 'Schemes';
                            return (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    className={`relative text-[15px] transition-colors duration-700 py-1 ${poppins.className} ${
                                        isActive 
                                            ? (isScrolled ? 'text-white font-semibold' : 'text-[#293e90] font-semibold')
                                            : (isScrolled ? 'text-blue-100 hover:text-white font-medium' : 'text-slate-500 hover:text-slate-800 font-medium')
                                    }`}
                                >
                                    {item}
                                    {isActive && (
                                        <span className={`absolute -bottom-1.5 left-0 right-0 h-[2.5px] rounded-full transition-colors duration-700 ${isScrolled ? 'bg-white' : 'bg-[#293e90]'}`} />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Login */}
                    <Link
                        href="/login"
                        aria-label="Login to CRP Portal"
                        className={`group inline-flex items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2 rounded-full border-2 font-semibold text-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-md active:scale-95 ${
                            isScrolled
                                ? 'bg-white border-white text-[#293e90] hover:bg-slate-50 hover:shadow-white/20'
                                : 'bg-[#f6f8fb] border-[#d0d7e8] text-[#293e90] hover:bg-white hover:border-[#293e90]'
                        }`}
                    >
                        <LogIn size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="hidden sm:inline">Login</span>
                    </Link>

                </div>
            </div>
        </header>

    )
}
