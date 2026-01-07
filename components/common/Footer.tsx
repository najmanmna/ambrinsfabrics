"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Send } from "lucide-react";

// Define Links
const shopLinks = [
  { href: "/shop", title: "All Fabrics" },
  { href: "/collections", title: "Collections" },
  { href: "/new-arrivals", title: "New Arrivals" },
  { href: "/elda", title: "Elda Artisan" },
];

const companyLinks = [
  { href: "/about", title: "Our Story" },
  { href: "/visit", title: "Visit Studio" },
  { href: "/contact", title: "Contact Us" },
];

const legalLinks = [
  { href: "/terms", title: "Terms & Conditions" },
  { href: "/privacy", title: "Privacy Policy" },
  { href: "/returns", title: "Returns & Exchanges" },
];

// --- SVG: Decorative Footer Mandala ---
const FooterMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" />
    <circle cx="50" cy="50" r="15" opacity="0.5" />
    <path d="M50 20L55 35L70 40L55 45L50 60L45 45L30 40L45 35L50 20Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-ambrins_dark text-white border-t border-white/5 font-body relative overflow-hidden">
      
      {/* --- Background Decor (Mandala Watermark) --- */}
      <div className="absolute -top-20 -right-20 w-96 h-96 text-white opacity-[0.03] animate-spin-slow pointer-events-none z-0">
         <FooterMandala className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-16 pb-8 relative z-10">
        
        {/* --- Top Section: Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* 1. Brand Identity (Span 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-6 block group">
               <h2 className="font-heading text-4xl tracking-tight text-white group-hover:text-ambrins_secondary transition-colors duration-300">
                 AMBRINS
               </h2>
            </Link>
            
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-8 font-light">
              Curating Colombo’s finest silks, laces, and artisan prints since 1999. We are the silent partner to your most elegant creations.
            </p>

            {/* Social Icons (Hover: Rani Pink) */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-ambrins_primary hover:border-ambrins_primary hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-ambrins_primary hover:border-ambrins_primary hover:text-white transition-all duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-ambrins_primary hover:border-ambrins_primary hover:text-white transition-all duration-300">
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* 2. Shop Links (Span 2 cols) */}
          <div className="lg:col-span-2 text-center md:text-left">
            <h3 className="font-heading text-lg text-ambrins_secondary mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-ambrins_primary transition-colors duration-300">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company Links (Span 2 cols) */}
          <div className="lg:col-span-2 text-center md:text-left">
            <h3 className="font-heading text-lg text-ambrins_secondary mb-6 tracking-wide">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-ambrins_primary transition-colors duration-300">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter (Span 4 cols) */}
          <div className="lg:col-span-4 text-center md:text-left">
            <h3 className="font-heading text-lg text-ambrins_secondary mb-6 tracking-wide">The List</h3>
            <p className="text-white/60 text-sm mb-6">
              Join our exclusive list for early access to new collections and private studio events.
            </p>
            
            <form className="flex flex-col gap-3">
              <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-white/5 border border-white/10 text-white px-5 py-4 w-full focus:outline-none focus:border-ambrins_primary focus:ring-1 focus:ring-ambrins_primary text-sm placeholder:text-white/30 rounded-sm transition-all"
                  />
                  <button 
                    type="button" 
                    className="absolute right-2 top-2 bottom-2 bg-ambrins_primary text-white px-4 rounded-sm hover:bg-white hover:text-ambrins_dark transition-colors duration-300 flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
              </div>
              <span className="text-[10px] text-white/30">By subscribing, you agree to our Privacy Policy.</span>
            </form>
          </div>

        </div>

        {/* --- Bottom Section: Copyright & Legal --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
               <Link key={link.title} href={link.href} className="hover:text-ambrins_secondary transition-colors">
                  {link.title}
               </Link>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="mb-1">© {new Date().getFullYear()} Ambrins Fabrics. All rights reserved.</p>
            <p>
              Designed & Developed by{" "}
              <a
                href="https://ahamedwebstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ambrins_secondary transition-colors font-medium border-b border-white/20 hover:border-ambrins_secondary pb-0.5"
              >
                Ahamed Web Studio
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;