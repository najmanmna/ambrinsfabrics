"use client";

import React from "react";
import { motion } from "framer-motion";

// --- SVG: Decorative Mandala Loader ---
const LoaderMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" opacity="0.4"/>
    <circle cx="50" cy="50" r="10" opacity="0.6" />
    <path d="M50 10L55 30L75 35L55 40L50 60L45 40L25 35L45 30L50 10Z" />
  </svg>
);

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ambrins_light">
      
      {/* --- 1. Background Texture (Subtle Spin) --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
         <div className="w-[400px] h-[400px] text-ambrins_secondary/5 animate-spin-slow">
            <LoaderMandala className="w-full h-full" />
         </div>
      </div>

      {/* --- 2. The Logo (Royal Navy) --- */}
      <div className="relative overflow-hidden z-10 text-center">
        <h1 className="font-heading text-3xl md:text-4xl tracking-tight text-ambrins_dark">
          AMBRINS
        </h1>
        <p className="font-body text-[10px] uppercase tracking-[0.4em] text-ambrins_secondary font-bold mt-1">
          FABRICS
        </p>
        
        {/* Shimmer Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1, // Fast sweep
            ease: "linear",
          }}
        />
      </div>

      {/* --- 3. The "Festive Thread" Progress Line --- */}
      {/* Gradient Bar: Rani Pink -> Marigold */}
      <div className="mt-6 w-16 h-[3px] bg-ambrins_dark/10 overflow-hidden rounded-full z-10 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-ambrins_primary to-ambrins_secondary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 0.8, // Snappy duration
            ease: "easeInOut",
          }}
        />
      </div>
      
    </div>
  );
};

export default Loading;