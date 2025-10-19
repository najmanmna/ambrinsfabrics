"use client";
import React, { useEffect, useState } from "react";
import LogoBlack from "../LogoBlack";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartMenu from "../CartMenu";


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const announcementHeight = 48;

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      {/* --- Announcement Bar --- */}
      <div
        className={`hidden bg-tech_primary text-white text-xs sm:text-sm px-4 sm:px-6 sm:flex flex-wrap items-center justify-center gap-4 sm:gap-10 transition-all duration-300`}
        style={{
          height: isScrolled ? 0 : announcementHeight,
          overflow: "hidden",
          transform: isScrolled ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <span className="uppercase whitespace-nowrap">Island-wide delivery</span>
        <div className="hidden sm:block w-px h-5 bg-white/70"></div>
        <span className="uppercase whitespace-nowrap">Secure Payments</span>
        <div className="hidden sm:block w-px h-5 bg-white/70"></div>
        <span className="uppercase whitespace-nowrap">Cash on Delivery</span>
      </div>

      {/* --- Main Header --- */}
      <div
        className={`transition-colors duration-300 backdrop-blur-md ${
          isScrolled ? "bg-tech_bg_color/95 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="relative flex items-center justify-between py-3 px-4 sm:px-8 md:px-12">
          {/* Left: Mobile Menu */}
          <div className="flex items-center text-tech_primary">
            <MobileMenu color={isScrolled ? "black" : "black"} />
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-90 sm:scale-100">
            <LogoBlack />
          </div>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block text-black">
              <SearchBar color="black" />
            </div>
            <div className="text-black">
              <CartMenu color="black" />
            </div>
          </div>
        </div>

        {/* --- Mobile Search --- */}
        <div className="block md:hidden px-4 pb-2">
          <SearchBar color="black" />
        </div>
      </div>
  
    </header>
  );
};

export default Header;
