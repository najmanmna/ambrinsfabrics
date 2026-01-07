"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

// --- SVG: The Mandala (Indian Motif) ---
const MandalaIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" opacity="0.2"/>
    <path d="M50 15c-1.5 0-2.8 1.1-3 2.6l-1.6 11.4c-.2 1.3.6 2.5 1.8 2.8 1.2.3 2.5-.4 2.8-1.6l1.2-8.6 1.2 8.6c.3 1.2 1.6 1.9 2.8 1.6 1.2-.3 2-1.5 1.8-2.8l-1.6-11.4c-.2-1.5-1.5-2.6-3-2.6z" />
    <circle cx="50" cy="50" r="5" />
    {/* Decorative dots for color */}
    <circle cx="50" cy="10" r="2" />
    <circle cx="90" cy="50" r="2" />
    <circle cx="50" cy="90" r="2" />
    <circle cx="10" cy="50" r="2" />
  </svg>
);

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[#FFFBF2] px-6 overflow-hidden relative">
      
      {/* --- Background Texture (Subtle warm gradient) --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* --- 1. The Centerpiece (Mandala + Bag) --- */}
      <div className="relative mb-8 flex items-center justify-center">
        
        {/* Rotating Mandala Background (The "Vibe") */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute text-pink-500/10 w-64 h-64 md:w-80 md:h-80"
        >
          <MandalaIcon className="w-full h-full" />
        </motion.div>

        {/* The Bag Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-orange-100"
        >
          <ShoppingBag className="w-10 h-10 text-pink-600" strokeWidth={1.5} />
          
          {/* Floating "Empty" Dot */}
          <span className="absolute top-6 right-6 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        </motion.div>
      </div>

      {/* --- 2. The Typography --- */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-md relative z-10"
      >
        
        
        <h2 className="font-heading text-4xl md:text-5xl text-ambrins_black mb-4">
          Your Cart is Empty.
        </h2>
        
        <p className="font-body text-gray-600 text-sm leading-relaxed mb-8 px-4">
          The finest silks and hand-block prints are waiting to be draped. Add a touch of color to your collection today.
        </p>

        {/* --- 3. The Call to Action (Vibrant Button) --- */}
        <Link
          href="/shop"
          className="group relative inline-flex items-center gap-3 bg-pink-700 text-white px-8 py-3.5 rounded-full overflow-hidden shadow-lg hover:shadow-pink-700/30 transition-all duration-300"
        >
          <span className="relative z-10 font-body text-xs font-bold uppercase tracking-widest">
            Explore Collection
          </span>
          <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          
          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </motion.div>

    </div>
  );
}