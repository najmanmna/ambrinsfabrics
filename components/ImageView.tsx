"use client";
import React, { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image, { ImageLoaderProps } from "next/image"; // ✨ Import Next.js Image
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

interface Props {
  images?: Array<{ _key: string; asset?: { _ref: string } }>;
  isStock?: number;
}

// ✨ OPTIMIZATION: Thumbnail Loader (Quality 65, WebP, max width)
const thumbnailLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 65}&auto=format&fit=max`;
};

export default function ImageView({ images = [], isStock }: Props) {
  const [active, setActive] = useState(images[0]);
  const [showModal, setShowModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (images.length > 0) setActive(images[0]);
  }, [images]);

  const openModal = (i: number) => {
    setInitialSlide(i);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div
        className="w-full md:w-2/5 flex flex-col gap-4 md:sticky md:top-28 h-fit z-10"
        style={{ zIndex: 10 }}
      >
        {/* Main image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-md overflow-hidden cursor-zoom-in flex-grow flex items-center justify-center relative"
            onClick={() =>
              openModal(images.findIndex((i) => i._key === active?._key))
            }
          >
            {active && (
              <InnerImageZoom
                // ✨ OPTIMIZATION: Request resized (800px) & WebP image from Sanity
                // This keeps the library functionality but downloads a 50kb file instead of 2MB
                src={urlFor(active).width(800).fit("max").auto("format").url()}
                zoomSrc={urlFor(active)
                  .width(1200)
                  .fit("max")
                  .auto("format")
                  .url()}
                zoomScale={isMobile ? 1.1 : 1.1}
                zoomType={isMobile ? "click" : "hover"}
                zoomPreload
                className={`w-full h-full object-contain ${
                  isStock === 0 ? "opacity-50" : ""
                }`}
              />
            )}
            {isStock === 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center text-lg font-bold text-red-600">
                Out of Stock
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Thumbnails below */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 flex-wrap p-2 rounded-md border">
            {images.map((img, idx) => (
              <button
                key={`${img._key}-${idx}`}
                onClick={() => setActive(img)}
                // Added 'relative' for Next.js Image fill
                className={`relative border rounded-md overflow-hidden w-16 h-16 md:w-20 md:h-20 transition-transform transform hover:scale-105 ${
                  active?._key === img._key
                    ? "ring-2 ring-tech_dark_color"
                    : ""
                }`}
              >
                {/* ✨ OPTIMIZATION: Replaced <img> with Next.js <Image> */}
                <Image
                  loader={thumbnailLoader}
                  src={urlFor(img).url()} // Loader handles the params
                  alt={`thumb-${idx}`}
                  fill
                  sizes="100px" // Tells browser to fetch tiny version
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal carousel */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white max-w-3xl w-full p-4 relative max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow"
              >
                <X className="h-6 w-6" />
              </button>

              <Carousel className="w-full" opts={{ startIndex: initialSlide }}>
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={`${img._key}-modal-${idx}`}>
                      <div className="flex items-center justify-center">
                        <InnerImageZoom
                          // ✨ OPTIMIZATION: Request high-res (1200px) WebP for modal
                          src={urlFor(img)
                            .width(1200)
                            .fit("max")
                            .auto("format")
                            .url()}
                          zoomSrc={urlFor(img)
                            .width(2000) // Super high-res only on zoom
                            .fit("max")
                            .auto("format")
                            .url()}
                          zoomScale={isMobile ? 1.1 : 1.1}
                          zoomType={isMobile ? "click" : "hover"}
                          zoomPreload
                          className="object-contain max-h-[80vh] w-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}