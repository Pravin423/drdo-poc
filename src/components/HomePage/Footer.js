import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowUpRight, Shield } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
});

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "About DRDA", href: "#" },
      { label: "Our CRP Network", href: "#" },
      { label: "Success Stories", href: "#" },
      { label: "Financial Reports", href: "#" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Training Portal", href: "#" },
      { label: "Grievance Cell", href: "#" },
      { label: "Downloads & Forms", href: "#" },
      { label: "Village Maps", href: "#" },
    ]
  }
];

const socialLinks = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative -mt-28 z-20 ${poppins.className}`}>
      <div className="bg-[#0d1526] rounded-t-[60px] md:rounded-t-[100px] pt-24 pb-0">
        {/* Subtle top separator line */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/[0.06]">

            {/* Brand Column — wider */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-xl flex items-center justify-center p-2">
                    <Image
                      src="/Seal_of_Goa.webp"
                      alt="Seal of Goa"
                      width={52}
                      height={52}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">DRDA Goa</h3>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Government of Goa</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-[1.8] text-[15px] max-w-sm">
                  District Rural Development Agency, Government of Goa — committed to building
                  self-reliant communities through inclusive growth, sustainable livelihoods,
                  and grassroots leadership.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, label, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    aria-label={label}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/80 hover:border-blue-500/50 transition-colors duration-300"
                  >
                    <Icon size={17} />
                  </motion.a>
                ))}
              </div>

              {/* Gov Badge */}
              <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3 w-fit">
                <Shield size={15} className="text-blue-400 flex-shrink-0" />
                <span className="text-slate-400 text-[13px] font-medium">Official Government of Goa Portal</span>
              </div>
            </div>

            {/* Link Columns */}
            {footerLinks.map((section, idx) => (
              <div key={idx} className="lg:col-span-2 flex flex-col gap-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/90">
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <motion.a
                        href={link.href}
                        className="group flex items-center gap-1.5 text-slate-400 hover:text-white text-[14px] font-medium transition-colors duration-200"
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {link.label}
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all duration-200"
                        />
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/90">
                Contact Us
              </h4>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-blue-400" />
                  </div>
                  <p className="text-slate-400 text-[14px] leading-relaxed">
                    Directorate of Rural Development,<br />
                    Patto Plaza, Panaji,<br />
                    Goa — 403 001
                  </p>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-blue-400" />
                  </div>
                  <a href="tel:+918321234567" className="text-slate-300 text-[15px] font-semibold hover:text-white transition-colors tracking-wide">
                    +91 832 1234 567
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-blue-400" />
                  </div>
                  <a href="mailto:support@drdagoa.gov.in" className="text-slate-300 text-[14px] font-medium hover:text-white transition-colors">
                    support@drdagoa.gov.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-slate-600 text-[13px] tracking-wide">
              © {currentYear} District Rural Development Agency, Government of Goa. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {["Privacy Policy", "Terms of Use", "Accessibility"].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-600 hover:text-slate-300 text-[13px] transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;