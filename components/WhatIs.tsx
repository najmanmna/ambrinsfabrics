"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // ✨ Import Framer Motion
import Container from "./Container";

// 🖼️ Optimized Imports (Ensure files are in 'images' or 'src/assets')
import borderTile from "@/images/line-motif.png";
import heroImage from "@/images/hero-blockprint.jpg";

// ✨ Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const WhatIs = () => {
  return (
    <Container className="py-16 overflow-hidden">
      {/* Heading & Subheading - Animates independently */}
      <motion.div 
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
          WHAT IS BLOCK PRINTING?
        </h2>
        <p className="text-tech_gold mt-2 text-lg sm:text-xl">
          The Centuries-Old Craft Of Storytelling On Fabric.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Left: Image with Tiled Border - Slide in from Left */}
        <motion.div
          className="p-[10px] relative shrink-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            backgroundImage: `url(${borderTile.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "40px", // Fixed pixel size usually looks sharper than %
          }}
        >
          <Image
            src={heroImage}
            alt="Artisan carving wooden block"
            width={500}
            height={500}
            placeholder="blur" // ✨ Adds loading blur effect automatically
            className="w-full max-w-[500px] h-auto object-cover block shadow-lg"
          />
        </motion.div>

        {/* Right: Text Content - Slide in from Right */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            Block printing is an age-old tradition from India, where artisans
            hand-carve wooden blocks and print fabric with natural dyes. At
            ELDA, we carefully source and bring these timeless prints to Sri
            Lanka, so you can experience their beauty in your everyday life.
          </p>

          <div className="mt-8 mx-10 sm:mx-0 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              href="/about"
              className="px-8 py-3 bg-tech_primary text-white font-semibold rounded shadow-md hover:bg-tech_gold hover:text-white transition-all transform hover:-translate-y-1"
            >
              READ OUR STORY
            </Link>
            <Link
              href="/care-guide"
              className="px-8 py-3 border border-tech_gold text-tech_primary font-semibold rounded shadow-sm hover:bg-tech_gold hover:text-white transition-all transform hover:-translate-y-1"
            >
              HOW TO CARE
            </Link>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default WhatIs;