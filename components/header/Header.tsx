"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LogoBlack from "../LogoBlack"; 
import MobileMenu from "./MobileMenu";
import CartMenu from "../CartMenu";
import SearchBar from "./SearchBar"; 

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Color Logic
  const textColorClass = isScrolled ? "text-ambrins_black" : "text-white";
  const hoverColorClass = isScrolled ? "hover:text-ambrins_gold" : "hover:text-white/80";
  const iconColor = isScrolled ? "black" : "white";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-ambrins_linen/95 backdrop-blur-md shadow-sm py-3"
          : "bg-gradient-to-b from-black/50 to-transparent py-4 md:py-6"
      }`}
    >
      {/* Responsive Padding: 
        px-4 on Mobile (more space for content)
        px-12 on Desktop (luxury spacing)
      */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto relative">
        
        {/* --- LEFT: Mobile Menu / Desktop Nav --- */}
        <div className="flex-1 flex items-center justify-start">
          {/* Mobile Menu Trigger */}
          <div className={`md:hidden ${textColorClass}`}>
            <MobileMenu color={iconColor} />
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-8 font-body text-xs md:text-sm tracking-widest uppercase font-medium ${textColorClass}`}>
            <Link href="/shop" className={`transition-colors duration-300 ${hoverColorClass}`}>
              Shop
            </Link>
            <Link href="/collections" className={`transition-colors duration-300 ${hoverColorClass}`}>
              Collections
            </Link>
            <Link href="/elda" className={`transition-colors duration-300 ${hoverColorClass}`}>
              Elda.lk
            </Link>
          </nav>
        </div>

        {/* --- CENTER: Logo --- */}
        {/* Absolute positioning ensures it stays centered relative to the SCREEN, 
           not just the flex content.
        */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`transition-transform duration-500 ${isScrolled ? "scale-75 md:scale-90" : "scale-90 md:scale-100"}`}>
             <div className={`transition-all duration-500 ${!isScrolled ? "invert brightness-0" : ""}`}>
                <LogoBlack />
             </div>
          </div>
        </div>

        {/* --- RIGHT: Icons (Search & Cart) --- */}
        <div className={`flex-1 flex items-center justify-end gap-2 md:gap-4 ${textColorClass}`}>
            
            {/* Desktop Search */}
            <div className={`hidden md:block`}>
               <SearchBar color={iconColor} />
            </div>

            {/* Cart */}
            <div className={`transition-colors duration-300 ${hoverColorClass}`}>
               <CartMenu color={iconColor} />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;