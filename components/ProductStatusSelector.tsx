"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Container from "./Container";
import Image from "next/image";

// 🖼️ Category images
import img1 from "../public/img1.jpeg";
import img2 from "../public/img2.jpeg";
import img3 from "../public/img3.jpeg";
import img4 from "../public/img4.jpeg";
import sectionBreak from "../public/sectionBreak.png";

// 🪷 Motif border image (tileable PNG)
import borderTile from "../public/line-motif.png";

const categories = [
  { title: "FABRICS", value: "fabrics", image: img1 },

  { title: "HOME & BEDDING", value: "home-and-bedding", image: img3 },
  { title: "CLOTHING", value: "clothing", image: img2 },
  { title: "ACCESSORIES", value: "accessories", image: img4 },
];

const ProductStatusSelector = () => {
  const router = useRouter();

  const handleClick = (value: string) => {
    router.push(`/category/${value}`);
  };

  return (
    <div className="py-20  mb-10 relative ">

         <div className="absolute -bottom-6  w-2xl sm:w-full overflow-hidden">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl uppercase sm:text-4xl font-playfair font-semibold text-tech_primary">
          Explore Our Collection
        </h2>
        <p className="text-tech_gold mx-10 mt-2 text-lg sm:text-xl">
          Discover centuries old craft for the modern life.
        </p>
      </div>

      {/* ✅ Two columns aligned outward */}
      <div className="flex justify-center gap-8 flex-wrap">
        {/* Left group */}
        <div className="flex flex-col gap-8 justify-items-end">
          {categories.slice(0, 2).map((cat) => (
            <div
              key={cat.value}
              onClick={() => handleClick(cat.value)}
              className="relative cursor-pointer group w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]  overflow-hidden"
            >
              {/* Motif Border */}
              <div
                className="absolute inset-0 p-[10px]"
                style={{
                  backgroundImage: `url(${borderTile.src})`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "10%",
                }}
              />

              {/* Inner Image */}
              <div className="absolute inset-[10px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder="blur"
                />
                {/* Overlay Strip */}
                <div className="absolute bottom-0 left-0 w-full bg-tech_primary/70 group-hover:bg-tech_primary transition-all duration-500 flex items-center justify-between px-6 py-3">
                  <h3 className="text-white text-xl font-semibold tracking-wide">
                    {cat.title}
                  </h3>
                  <span className="text-white text-2xl font-light group-hover:translate-x-1 transition-transform duration-300">
                    &gt;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right group */}
        <div className="flex flex-col gap-8 items-start">
          {categories.slice(2).map((cat) => (
            <div
              key={cat.value}
              onClick={() => handleClick(cat.value)}
              className="relative cursor-pointer group w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]  overflow-hidden"
            >
              {/* Motif Border */}
              <div
                className="absolute inset-0 p-[10px] "
                style={{
                  backgroundImage: `url(${borderTile.src})`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "10%",
                }}
              />

              {/* Inner Image */}
              <div className="absolute inset-[10px]  overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder="blur"
                />
                {/* Overlay Strip */}
                <div className="absolute bottom-0 left-0 w-full bg-tech_primary/70 group-hover:bg-tech_primary transition-all duration-500 flex items-center justify-between px-6 py-3">
                  <h3 className="text-white  text-xl font-semibold tracking-wide">
                    {cat.title}
                  </h3>
                  <span className="text-white text-2xl font-light group-hover:translate-x-1 transition-transform duration-300">
                    &gt;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductStatusSelector;
