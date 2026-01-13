"use client";

import React, { useState, useEffect, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ScanEye, ChevronLeft, ChevronRight } from "lucide-react";
import Image, { ImageLoaderProps } from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Props {
  images?: Array<{ _key: string; asset?: { _ref: string } }>;
  isStock?: number;
}

const sanityLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 75}&auto=format&fit=max`;
};

// --- LENS MAGNIFIER COMPONENT (No Changes Needed Here) ---
const LensMagnifier = ({
  image,
  onClick,
  isStock,
}: {
  image: any;
  onClick: () => void;
  isStock?: number;
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const zoomImgUrl = image ? urlFor(image).width(1600).format("webp").url() : "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div
      ref={imgRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair group bg-white rounded-sm border border-ambrins_dark/10 shadow-sm"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
         {image && (
           <Image
            loader={sanityLoader}
            src={urlFor(image).url()}
            alt="Product View"
            fill
            className={`object-contain transition-opacity duration-300 ${isStock === 0 ? "opacity-50 grayscale" : ""}`}
            priority
          />
         )}
      </div>

      {isStock === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 pointer-events-none">
           <span className="font-heading text-2xl text-ambrins_dark border-b-2 border-ambrins_primary pb-1">Sold Out</span>
        </div>
      )}

      <div className="lg:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-10">
         <Maximize2 className="w-3 h-3 text-ambrins_dark" />
         <span className="text-[10px] font-bold uppercase tracking-widest text-ambrins_dark">Tap to Zoom</span>
      </div>

      <div className={`hidden lg:flex absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg items-center gap-2 z-10 transition-opacity duration-300 ${showMagnifier ? "opacity-0" : "opacity-100"}`}>
         <ScanEye className="w-4 h-4 text-ambrins_secondary" />
         <span className="text-[10px] font-bold uppercase tracking-widest text-ambrins_dark">Hover to Inspect</span>
      </div>

      <div
        className="hidden lg:block absolute pointer-events-none border-2 border-ambrins_primary/30 rounded-full bg-white shadow-2xl z-20"
        style={{
          display: showMagnifier ? "block" : "none",
          height: "200px",
          width: "200px",
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          transform: "translate(-50%, -50%)",
          backgroundImage: `url('${zoomImgUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "250%",
          backgroundPosition: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ImageView({ images = [], isStock }: Props) {
  const [active, setActive] = useState(images[0]);
  const [showModal, setShowModal] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // --- BUG FIX: Sync Active Image on Prop Change ---
  useEffect(() => {
    // Whenever the 'images' array changes (e.g. user clicks "Blue" variant),
    // we MUST reset the active image to the first one in the new array.
    if (images.length > 0) {
      setActive(images[0]);
    }
  }, [images]); // Dependency on 'images' ensures this runs on variant switch

  // Sync Modal Carousel to Active Image
  useEffect(() => {
    if (carouselApi && showModal) {
      const index = images.findIndex((img) => img._key === active?._key);
      if (index !== -1) carouselApi.scrollTo(index);
    }
  }, [showModal, carouselApi, active, images]);

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  if (!images.length) return null;

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        
        {/* 1. Main Viewport */}
        <div className="w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-white rounded-sm shadow-xl shadow-ambrins_dark/5 relative z-10">
           <AnimatePresence mode="wait">
             <motion.div
               key={active?._key}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4 }}
               className="w-full h-full"
             >
               <LensMagnifier 
                 image={active} 
                 onClick={openModal} 
                 isStock={isStock} 
               />
             </motion.div>
           </AnimatePresence>
        </div>

        {/* 2. Thumbnails Strip (HANDLES MULTIPLE IMAGES PER VARIANT) */}
        {/* If the current variant has 3 images, this map will render 3 buttons */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
            {images.map((img, idx) => {
               const isActive = active?._key === img._key;
               return (
                <button
                  key={img._key}
                  onClick={() => setActive(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border transition-all duration-300 ${
                    isActive
                      ? "border-ambrins_secondary ring-1 ring-ambrins_secondary opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    loader={sanityLoader}
                    src={urlFor(img).url()}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
               );
            })}
          </div>
        )}
      </div>

      {/* 3. Full Screen Lightbox */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ambrins_dark/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <X className="h-8 w-8" strokeWidth={1.5} />
            </button>

            <div 
                className="w-full max-w-5xl px-4 md:px-12 relative"
                onClick={(e) => e.stopPropagation()}
            >
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {images.map((img) => (
                    <CarouselItem key={img._key} className="flex items-center justify-center h-[80vh]">
                      <div className="relative w-full h-full">
                        <Image
                          loader={sanityLoader}
                          src={urlFor(img).width(1200).url()}
                          alt="Full Screen View"
                          fill
                          className="object-contain"
                          quality={90}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 bg-transparent border-white/20 text-white hover:bg-white hover:text-ambrins_dark" />
                <CarouselNext className="hidden md:flex -right-4 bg-transparent border-white/20 text-white hover:bg-white hover:text-ambrins_dark" />
              </Carousel>
              <div className="md:hidden text-center mt-4 text-white/50 text-xs font-bold uppercase tracking-widest">
                  Swipe to view more
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}