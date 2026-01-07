"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

// --- Types ---
interface Collection {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  imageUrl: string;
}

// --- Fetch Data ---
const fetchCollections = async () => {
  const query = `
    *[_type == "collection"] | order(_modifiedAt desc)[0...8] {
      _id,
      title,
      slug,
      description,
      "imageUrl": image.asset->url
    }
  `;
  return await client.fetch(query);
};

const TheCurrentEdit = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  useEffect(() => {
    const getData = async () => {
      const data = await fetchCollections();
      setCollections(data);
    };
    getData();
  }, []);

  // --- Progress Bar Logic ---
  const onScroll = useCallback((emblaApi: any) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("scroll", onScroll);
  }, [emblaApi, onScroll]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!collections || collections.length === 0) return null;

  return (
    <section className="w-full py-24  overflow-hidden border-b border-ambrins_dark/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1920px]">
        
        {/* --- Header with Controls --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-2 md:px-4">
          <div className="max-w-xl mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-ambrins_secondary animate-pulse" />
               <span className="block font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
                 — Curated Selections
               </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl text-ambrins_dark leading-[0.9]">
              The Current Edit
            </h2>
          </div>

          {/* Slider Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
                onClick={scrollPrev}
                className="group w-14 h-14 border border-ambrins_dark/10 text-ambrins_dark flex items-center justify-center rounded-full hover:bg-ambrins_primary hover:border-ambrins_primary transition-all duration-300 active:scale-95"
            >
                <ChevronLeft size={24} className="group-hover:text-white transition-colors" strokeWidth={1.5} />
            </button>
            <button 
                onClick={scrollNext}
                className="group w-14 h-14 border border-ambrins_dark/10 text-ambrins_dark flex items-center justify-center rounded-full hover:bg-ambrins_primary hover:border-ambrins_primary transition-all duration-300 active:scale-95"
            >
                <ChevronRight size={24} className="group-hover:text-white transition-colors" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* --- INFINITY SLIDER --- */}
        <div className="relative" ref={emblaRef}>
            <div className="flex touch-pan-y gap-5 md:gap-8 cursor-grab active:cursor-grabbing pb-12">
                {collections.map((item) => (
                    // Card Width Logic
                    <div className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-2" key={item._id}>
                        <Link 
                            href={`/collections/${item.slug.current}`}
                            className="group block relative w-full aspect-[3/4] overflow-hidden"
                        >
                            {/* 1. Image with Scale Effect */}
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-ambrins_dark/5 flex items-center justify-center text-ambrins_dark/30">No Image</div>
                            )}

                            {/* 2. Scrim Gradient (Smooth fade for text) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-ambrins_dark/90 via-ambrins_dark/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                            
                            {/* 3. Golden Focus Border (The Enhancement) 
                                Draws a border on hover
                            */}
                            <div className="absolute inset-0 border-[1px] border-ambrins_secondary/0 group-hover:border-ambrins_secondary/50 transition-colors duration-500 m-3 md:m-4 pointer-events-none" />

                            {/* 4. Text Content */}
                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end z-10">
                                
                                {/* Label */}
                                <span className="text-[10px] uppercase tracking-widest text-white/60 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    Collection
                                </span>

                                {/* Title */}
                                <h3 className="font-heading text-3xl md:text-5xl text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                                    {item.title}
                                </h3>
                                
                                {/* Reveal Section */}
                                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-out">
                                    <p className="font-body text-sm text-white/80 line-clamp-2 leading-relaxed mb-6 font-light">
                                        {item.description || "Discover our latest curated selection of fine fabrics and exclusive prints."}
                                    </p>

                                    <span className="inline-flex items-center gap-3 font-body text-xs font-bold tracking-[0.2em] uppercase text-ambrins_secondary group-hover:text-white transition-colors">
                                        View Fabrics
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 text-ambrins_primary" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>

        {/* --- Progress Bar (Luxury Touch) --- */}
        <div className="relative w-full h-[1px] bg-ambrins_dark/10 mt-4 rounded-full overflow-hidden max-w-xs md:max-w-md mx-auto md:mx-0">
            <div 
                className="absolute top-0 left-0 h-full bg-ambrins_secondary transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>

        {/* --- Mobile View All Link --- */}
        <div className="mt-12 text-center md:hidden">
            <Link 
                href="/collections" 
                className="inline-block border-b border-ambrins_dark pb-1 font-body text-xs font-bold uppercase tracking-[0.2em] text-ambrins_dark hover:text-ambrins_primary hover:border-ambrins_primary transition-colors"
            >
                View All Collections
            </Link>
        </div>

      </div>
    </section>
  );
};

export default TheCurrentEdit;