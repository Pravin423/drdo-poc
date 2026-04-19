import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-poppins' });

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-700 ease-in-out ${
            isScrolled ? 'border-transparent shadow-lg' : 'border-slate-200 shadow-none'
        }`}>
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

            <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ease-in-out ${isScrolled ? 'py-3' : 'py-4'}`}>
                <div className="flex items-center justify-between">

                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-4">
                        <div className="h-18 w-18">
                            <Image
                                src="/Seal_of_Goa.webp"
                                alt="Government of Goa Seal"
                                width={63}
                                height={63}
                                priority
                                className={`object-contain transition-all duration-700 ${isScrolled ? 'brightness-0 invert' : ''}`}
                            />
                        </div>

                        <div className="leading-tight ">
                            <h1 className={`text-xl ${poppins.className} font-bold transition-colors duration-700 ${isScrolled ? 'text-white' : 'text-slate-900'}`}>
                                DRDA Goa
                            </h1>
                            <p className={`text-[12px] ${poppins.className} uppercase font-medium tracking-widest mt-[-4px] transition-colors duration-700 ${isScrolled ? 'text-blue-100' : 'text-slate-600'}`}>
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
                        className={`inline-flex items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2 rounded-full border-2 font-semibold text-sm transition-all duration-700 ${
                            isScrolled
                                ? 'bg-white border-white text-[#293e90] hover:bg-slate-100'
                                : 'bg-[#f6f8fb] border-[#d0d7e8] text-[#293e90] hover:bg-[#ebf0f7]'
                        }`}
                    >
                        <LogIn size={18} strokeWidth={2} />
                        <span className="hidden sm:inline">Login</span>
                    </Link>

                </div>
            </div>
        </header>

    )
}
