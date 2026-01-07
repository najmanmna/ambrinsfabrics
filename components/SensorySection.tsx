"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, Waves, Layers, Eye, Sparkles } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
// REPLACE with specific fabric images for best effect
import pleatedSatin from "@/images/pleated-satin.jpg";
import khaadiCotton from "@/images/khaadi_cotton.jpg";
import linenBlend from "@/images/linen-blend.jpg";

// --- SUB-COMPONENT: Image Magnifier (Zoom Lens) ---
const ImageMagnifier = ({
  src,
  alt,
  className,
}: {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  const imgUrl = typeof src === "string" ? src : src.src;

  return (
    <div
      className={`relative w-full h-full overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        placeholder="blur"
        blurDataURL={typeof src === "object" ? src.blurDataURL : undefined}
      />

      <div
        className="hidden lg:block absolute pointer-events-none border-2 border-ambrins_primary/50 rounded-full bg-white shadow-2xl z-50"
        style={{
          display: showMagnifier ? "block" : "none",
          position: "absolute",
          height: "150px",
          width: "150px",
          top: `${magnifierPosition.y}%`,
          left: `${magnifierPosition.x}%`,
          transform: "translate(-50%, -50%)",
          backgroundImage: `url('${imgUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "400%", // 4x Zoom
          backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
        }}
      />
    </div>
  );
};

// --- SVG: Mandala Background ---
const MandalaBg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
     <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" opacity="0.1"/>
     <circle cx="50" cy="50" r="10" opacity="0.2" />
  </svg>
);

// --- UPDATED DATA ---
const SENSORY_DATA = [
  {
    id: "linen-blend",
    title: "Soft Linen Blend",
    handFeel: "Cool & Breathable",
    drape: "Flowy & Relaxed",
    translucency: "Semi-Opaque",
    image: linenBlend, // Replace with image of flowy linen
    description: "The perfect marriage of texture and flow. Unlike stiff pure linen, this premium blend offers a softer, more fluid drape that resists heavy creasing while keeping you cool.",
  },
  {
    id: "khaadi",
    title: "Khaadi Cotton",
    handFeel: "Raw & Earthy",
    drape: "Structured",
    translucency: "Opaque",
    image: khaadiCotton, // Replace with image of textured cotton
    description: "Hand-spun on the charkha, our Khaadi carries the soul of the artisan. It offers a distinct, raw texture that softens with every wash, perfect for structured kurtas.",
  },
  {
    id: "plisse",
    title: "Pleated Satin",
    handFeel: "Ribbed & Silky",
    drape: "Slinky & Fluid",
    translucency: "Opaque Sheen",
    image: pleatedSatin, // Replace with image of pleated fabric
    description: "A modern marvel of texture. These permanent micro-pleats create a liquid-like sheen with a comfortable stretch, requiring no ironing and offering an effortless, high-fashion silhouette.",
  }
];

const SensorySection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="w-full py-24 bg-ambrins_light overflow-hidden border-b border-ambrins_dark/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* --- Section Header --- */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Sparkles className="w-4 h-4 text-ambrins_secondary animate-pulse" />
             <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
               — Sensory Exploration
             </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl text-ambrins_dark mb-6">
            Feel it Through the Screen
          </h2>
          <p className="font-body text-ambrins_text/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We’ve translated thirty years of textile mastery into digital touchpoints. Hover over the fabric to inspect the weave up close.
          </p>
        </div>

        {/* --- Interactive Matrix --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* 1. The Dynamic Image (Left) with ZOOM LENS */}
          <div className="w-full lg:w-1/2 relative aspect-[4/5] md:aspect-square bg-white rounded-lg shadow-xl group border-2 border-ambrins_secondary/10">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
               <MandalaBg className="w-[150%] h-[150%] text-ambrins_primary animate-spin-slow opacity-20" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative w-full h-full z-10 rounded-md overflow-hidden"
              >
                {/* Zoom Component */}
                <ImageMagnifier 
                    src={SENSORY_DATA[activeTab].image} 
                    alt={SENSORY_DATA[activeTab].title} 
                />
                
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ambrins_dark backdrop-blur-sm rounded-full lg:hidden pointer-events-none">
                    Tap to view
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. The Details (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            {/* Tab Selectors */}
            <div className="flex flex-wrap gap-4 md:gap-8 mb-12 border-b border-ambrins_dark/10">
              {SENSORY_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`pb-4 font-body text-xs font-bold tracking-widest uppercase transition-all relative ${
                    activeTab === idx ? "text-ambrins_primary" : "text-gray-400 hover:text-ambrins_secondary"
                  }`}
                >
                  0{idx + 1}. {item.title} {/* Changed to show full title for clarity */}
                  {activeTab === idx && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-ambrins_primary rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Dynamic Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h3 className="font-heading text-3xl md:text-5xl text-ambrins_dark mb-6">
                  {SENSORY_DATA[activeTab].title}
                </h3>
                <p className="font-body text-ambrins_text/80 mb-10 leading-relaxed text-sm md:text-base max-w-lg italic border-l-4 border-ambrins_secondary pl-4">
                  &quot;{SENSORY_DATA[activeTab].description}&quot;
                </p>

                {/* Sensory Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                  <div className="bg-white p-6 border border-ambrins_dark/10 hover:border-ambrins_primary hover:shadow-lg transition-all duration-300 group rounded-lg cursor-default">
                    <Layers className="text-ambrins_secondary mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ambrins_muted mb-1 block">Hand-Feel</span>
                    <span className="font-body text-xs font-bold text-ambrins_dark uppercase">{SENSORY_DATA[activeTab].handFeel}</span>
                  </div>

                  <div className="bg-white p-6 border border-ambrins_dark/10 hover:border-ambrins_primary hover:shadow-lg transition-all duration-300 group rounded-lg cursor-default">
                    <Waves className="text-ambrins_secondary mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ambrins_muted mb-1 block">Drape</span>
                    <span className="font-body text-xs font-bold text-ambrins_dark uppercase">{SENSORY_DATA[activeTab].drape}</span>
                  </div>

                  <div className="bg-white p-6 border border-ambrins_dark/10 hover:border-ambrins_primary hover:shadow-lg transition-all duration-300 group rounded-lg cursor-default">
                    <Eye className="text-ambrins_secondary mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ambrins_muted mb-1 block">Visibility</span>
                    <span className="font-body text-xs font-bold text-ambrins_dark uppercase">{SENSORY_DATA[activeTab].translucency}</span>
                  </div>
                </div>

                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-4 font-body text-xs font-bold tracking-[0.2em] uppercase text-white bg-ambrins_primary px-8 py-4 rounded-full hover:bg-ambrins_dark transition-all shadow-md group"
                >
                  Shop This Fabric
                  <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SensorySection;