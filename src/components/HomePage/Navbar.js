import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-poppins' });

export const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
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
                                className="object-contain"
                            />
                        </div>

                        <div className="leading-tight ">
                            <h1 className={`text-xl ${poppins.className} font-bold text-slate-900`}>
                                DRDA Goa
                            </h1>
                            <p className={`text-[12px] ${poppins.className} text-slate-600 uppercase font-medium tracking-widest mt-[-4px]`}>
                                Government of Goa
                            </p>
                        </div>
                    </div>

                    {/* Right: Login */}
                    <Link
                        href="/login"
                        aria-label="Login to CRP Portal"
                        className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2 rounded-full bg-[#f6f8fb] border-2 border-[#d0d7e8] text-[#31469e] font-semibold text-sm hover:bg-[#ebf0f7] transition-colors"
                    >
                        <LogIn size={18} strokeWidth={2} />
                        <span className="hidden sm:inline">Login</span>
                    </Link>

                </div>
            </div>
        </header>

    )
}
