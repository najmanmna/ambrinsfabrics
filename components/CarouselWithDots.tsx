"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";

// Assuming your banner images are in the public folder
const localBanners = [
  {
    imageDesktop: "/banners/bg1.png",
    imageMobile: "/banners/bg1.png", // Use a specific mobile image if available
    heading: "Handcrafted Block Prints",
    subheading: "Inspired By Tradition, Sustainably Made",
    link: "/shop",
  },
  {
    imageDesktop: "/banners/bg2.png",
    imageMobile: "/banners/bg2.png",
    heading: "Artisanal Block Prints",
    subheading: "Every Piece Tells a Story of Craftsmanship",
    link: "/shop",
  },
  {
    imageDesktop: "/banners/bg3.png",
    imageMobile: "/banners/bg3.png",
    heading: "Sustainable Elegance",
    subheading: "Mindfully Made for the Modern Home",
    link: "/shop",
  },
];

const CarouselWithZoom = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();

  const slideDuration = 8000; // 8 seconds per slide

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % localBanners.length);
    }, slideDuration);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } },
  };

  return (
    <Container className="w-full pt-6 sm:pt-4 lg:col-span-3">
      <div className="relative w-full h-[50vh] sm:h-[85vh] overflow-hidden rounded-lg shadow-md">
        <AnimatePresence>
          {localBanners.map((item, index) => {
            const imageUrl = isMobile ? item.imageMobile : item.imageDesktop;

            return (
              selectedIndex === index && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <motion.div
                    className="w-full h-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: slideDuration / 1000 + 1, ease: "linear" }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Banner ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black/30" />

                  <motion.div
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
                  >
                    <motion.h1
                      variants={textItemVariants}
                      className="font-playfair text-white text-4xl sm:text-6xl font-medium"
                      style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {item.heading}
                    </motion.h1>
                    <motion.p
                      variants={textItemVariants}
                      className="text-white text-base sm:text-xl mt-4 max-w-lg"
                      style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.5)" }}
                    >
                      {item.subheading}
                    </motion.p>
                    <motion.div variants={textItemVariants} className="mt-8">
                      <Link
                        href={item.link}
                        className="inline-block bg-[#FDFBF6] text-tech_primary font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                      >
                        Shop Now
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            );
          })}
        </AnimatePresence>

        {/* Progress bars */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {localBanners.map((_, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="w-12 h-1 bg-white/30 rounded-full cursor-pointer"
            >
              {selectedIndex === index && (
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: slideDuration / 1000, ease: "linear" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default CarouselWithZoom;