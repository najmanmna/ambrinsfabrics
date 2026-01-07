import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import herobg from "@/images/hero_image1.png"; 
import Image from "next/image";

const Hero = () => {
  // --- TOGGLE THIS TO TEST ---
  const SHOW_VIDEO = true; 
  // ---------------------------

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-ambrins_dark">
      
      {/* --- Background Asset Container --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        
        {SHOW_VIDEO ? (
          <video
            className="absolute scale-[1.05] top-0 left-0 w-full h-full object-cover pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
            poster={herobg.src} 
          >
            <source src="/videos/hero_2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={herobg}
            alt="Hero Background"
            fill
            className="object-cover"
            priority 
            quality={90}
          />
        )}

        {/* Gradient Overlay: 
            Ensures text pops against colorful fabrics. 
            Goes from clear -> dark navy at bottom 
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-ambrins_dark/90 via-black/40 to-black/30" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        
        {/* 1. BRAND PROMISE (Marketing Tagline) */}
        <span className="font-body text-ambrins_secondary text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in-up bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-ambrins_secondary/30">
           — We Take Fabrics Seriously —
        </span>

        {/* 2. MAIN VALUE PROP (Headline) */}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium tracking-tight mb-6 drop-shadow-2xl leading-[1.1] md:leading-[1]">
          Your One-Stop <br />
          <span className="italic font-light text-white">Fabric Destination</span>
        </h1>

        {/* 3. SUPPORTING COPY (The "Why") */}
        <p className="font-body text-white/90 text-sm sm:text-base md:text-lg tracking-wide max-w-xs sm:max-w-md md:max-w-2xl mb-10 font-light leading-relaxed">
          From bridal silks to everyday cottons, explore Colombo&apos;s widest range of textures. Whatever you envision, we have the yardage for it.
        </p>

        {/* 4. CALL TO ACTION (Rani Pink Pop) */}
        <div className="flex flex-col sm:flex-row gap-4">
            <Link 
                href="/shop"
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-sm transition-all duration-300 ease-out bg-white text-ambrins_dark hover:bg-ambrins_primary hover:text-white shadow-lg hover:shadow-ambrins_primary/50"
            >
                <span className="relative z-10 font-body text-xs md:text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                   Shop The Range
                </span>
            </Link>
            
            <Link 
                href="/collections"
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-sm transition-all duration-300 ease-out border border-white text-white hover:border-ambrins_secondary hover:text-ambrins_secondary"
            >
                <span className="relative z-10 font-body text-xs md:text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                   View Collections
                </span>
            </Link>
        </div>
      </div>

      {/* --- Scroll Indicator --- */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce duration-[2000ms]">
        <div className="flex flex-col items-center gap-2 opacity-70">
            <span className="text-[9px] uppercase tracking-widest text-white/60 hidden md:block">Start Exploring</span>
            <ArrowDown className="text-white w-6 h-6 font-light" strokeWidth={1} />
        </div>
      </div>

    </section>
  );
};

export default Hero;