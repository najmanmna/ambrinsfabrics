"use client";
import React from "react";
import Container from "./Container";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // ✨ 1. Import Framer Motion

// 🖼️ Category images
import img1 from "@/images/categories/img1.jpeg";
import img2 from "@/images/categories/img2.jpeg";
import img3 from "@/images/categories/img3.jpeg";
import img4 from "@/images/categories/img4.jpeg";
import sectionBreak from "@/images/sectionBreak.png";

// 🪷 Motif border image
// Note: If you moved this to src/assets, update this path. 
// If it's still in public, you might need to use the string path "/line-motif.png" instead of import.
import borderTile from "../public/line-motif.png"; 

const categories = [
  { title: "FABRICS", value: "fabrics", image: img1 },
  { title: "HOME & BEDDING", value: "home-and-bedding", image: img3 },
  { title: "CLOTHING", value: "clothing", image: img2 },
  { title: "ACCESSORIES", value: "accessories", image: img4 },
];

// ✨ Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // ✨ Delays each child card by 0.2s
      delayChildren: 0.3,
    },
  },
};

const CategoryCollectionGrid = () => {
  return (
    <div className="py-20 mb-10 relative overflow-hidden">
      {/* Footer Section Divider */}
      <div className="absolute -bottom-6 w-full overflow-hidden leading-[0] z-0">
        <Image
          src={sectionBreak}
          alt="Section divider"
          className="w-full h-auto object-cover rotate-180"
          width={1200}
          height={100}
        />
      </div>

      {/* Heading - Animates independently */}
      <motion.div 
        className="text-center mb-12 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // Triggers when 100px into view
        variants={fadeInUp}
      >
        <h2 className="text-3xl uppercase sm:text-4xl font-playfair font-semibold text-tech_primary">
          Explore Our Collection
        </h2>
        <p className="text-tech_gold mx-10 mt-2 text-lg sm:text-xl font-light">
          Discover centuries-old craft for modern life.
        </p>
      </motion.div>

      {/* Grid Layout - Container handles the stagger */}
      <motion.div 
        className="flex justify-center gap-8 flex-wrap px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-8 justify-items-end">
          {categories.slice(0, 2).map((cat) => (
            <CategoryCard key={cat.value} category={cat} />
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 items-start">
          {categories.slice(2).map((cat) => (
            <CategoryCard key={cat.value} category={cat} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ✨ Wrapped Card Component
const CategoryCard = ({ category }: { category: any }) => {
  return (
    // Wrap the Link in motion.div to apply the stagger effect
    <motion.div variants={fadeInUp}> 
      <Link
        href={`/category/${category.value}`}
        className="relative cursor-pointer group w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] overflow-hidden block"
      >
        {/* Motif Border Layer (Background) */}
        <div
          className="absolute inset-0 p-[10px]"
          style={{
            backgroundImage: `url(${borderTile.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "40px",
          }}
        />

        {/* Inner Content Layer (Inset by 10px) */}
        <div className="absolute inset-[10px] overflow-hidden shadow-md bg-gray-100">
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 640px) 260px, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            placeholder="blur"
          />
          
          {/* Overlay Strip */}
          <div className="absolute bottom-0 left-0 w-full bg-tech_primary/80 backdrop-blur-[2px] group-hover:bg-tech_primary transition-all duration-500 flex items-center justify-between px-5 py-3 border-t border-white/20">
            <h3 className="text-white text-lg sm:text-xl font-medium tracking-widest font-serif">
              {category.title}
            </h3>
            <span className="text-white text-xl font-light group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCollectionGrid;