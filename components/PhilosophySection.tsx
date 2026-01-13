"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import handsimage from "@/images/Hands touching luxury lace fabric.png";
import { ArrowRight, Star } from "lucide-react";

// --- SVG: Decorative Background Pattern ---
const MandalaWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
     <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" />
     <path d="M50 20L55 35L70 40L55 45L50 60L45 45L30 40L45 35L50 20Z" opacity="0.6"/>
  </svg>
);

const PhilosophySection = () => {
  return (
    <section className="relative w-full py-24  overflow-hidden">
      
      {/* Decorative Side Element (Left) */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-ambrins_primary to-ambrins_secondary opacity-20 hidden md:block" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* --- 1. Image Composition (Left Side) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 relative h-[400px] md:h-[650px] z-0 px-4 md:px-0"
          >
            {/* The "Golden Frame" Offset Border */}
            <div className="absolute top-4 left-0 md:-left-4 w-full h-full border-2 border-ambrins_secondary/30 z-0 hidden md:block" />
            
            <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-sm">
                <Image
                src={handsimage} 
                alt="Hands touching luxury lace fabric"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                />
                {/* Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-ambrins_dark/20 to-transparent mix-blend-multiply pointer-events-none" />
            </div>
          </motion.div>

          {/* --- 2. Content Box (Right Side - Overlapping) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative z-10 lg:-ml-32 mt-[-40px] lg:mt-0"
          >
            <div className="bg-white p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden rounded-sm border-t-4 border-ambrins_primary">
                
                {/* Background Watermark */}
                {/* <div className="absolute -right-20 -bottom-20 w-80 h-80 text-ambrins_secondary/5 pointer-events-none animate-spin-slow">
                    <MandalaWatermark className="w-full h-full" />
                </div> */}

                {/* Tagline */}
                <div className="flex items-center gap-2 mb-5">
                    <Star className="w-3 h-3 text-ambrins_secondary fill-current" />
                    <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
                       We Take Fabrics Seriously
                    </span>
                </div>

                {/* Heading */}
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-ambrins_dark mb-6 leading-[1.05]">
                  More Than Just <br/> <span className="italic font-light text-ambrins_primary">Yardage.</span>
                </h2>

                {/* Paragraph */}
                <p className="font-body text-ambrins_text/80 text-sm md:text-base leading-relaxed mb-10 relative z-10">
                  For over two decades, Ambrins has been the silent partner to Colombo’s most demanding brides and designers to everyday women who love bringing their own outfits to life. Whether you’re crafting a statement piece or an everyday essential, Ambrins Fabrics is your one-stop destination for fabrics that inspire imagination and individuality
                </p>

                {/* "Read Story" Button */}
                <div className="mb-10 relative z-10">
                  <Link 
                    href="/about" 
                    className="group inline-flex items-center gap-3"
                  >
                    <span className="font-body text-sm font-bold uppercase tracking-widest text-ambrins_dark group-hover:text-ambrins_primary transition-colors duration-300">
                      Read Our Story
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-ambrins_dark/20 group-hover:bg-ambrins_primary group-hover:border-ambrins_primary transition-all duration-300">
                         <ArrowRight className="w-4 h-4 text-ambrins_dark group-hover:text-white transition-colors" />
                    </span>
                  </Link>
                </div>

                {/* Elda Sub-Brand Feature Box */}
                <div className="relative bg-ambrins_secondary/5 p-6 border-l-4 border-ambrins_secondary group hover:bg-ambrins_secondary/10 transition-colors duration-300">
                  <p className="font-body text-sm text-ambrins_dark mb-4 leading-relaxed">
                    <span className="font-bold text-ambrins_secondary block text-xs uppercase tracking-wider mb-1">Also Featuring</span>
                    <span className="font-heading text-xl">Elda House of Block Prints</span> — Our dedicated sub-brand for heritage hand-block prints.
                  </p>
                  
                  <Link 
                    href="/elda" 
                    className="inline-flex items-center font-body text-[10px] font-bold uppercase text-ambrins_dark tracking-widest hover:text-ambrins_primary transition-colors"
                  >
                    Discover Elda
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Link>
                </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;