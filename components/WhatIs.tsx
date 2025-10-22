"use client";
import Image from "next/image";
import Container from "./Container";

// Import all images
import borderTile from "../public/line-motif.png";
import heroImage from "../public/hero-blockprint.jpg";

const WhatIs = () => {
  return (
    <Container className="py-16">
      {/* Heading & Subheading on top, centered */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
          WHAT IS BLOCK PRINTING?
        </h2>
        <p className="text-tech_gold mt-2 text-lg sm:text-xl">
          The Centuries-Old Craft Of Storytelling On Fabric.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Image with Tiled Border */}
        <div
          className="p-[10px] relative"
          style={{
            backgroundImage: `url(${borderTile.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "10%", // just like Figma’s "Tile 10%"
          }}
        >
          <Image
            src={heroImage}
            alt="Block Printing"
            width={600}
            height={600}
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 text-center lg:text-left">
          <p className="mt-4 text-gray-700 text-base sm:text-lg">
            Block printing is an age-old tradition from India, where artisans
            hand-carve wooden blocks and print fabric with natural dyes. At
            ELDA, we carefully source and bring these timeless prints to Sri
            Lanka, so you can experience their beauty in your everyday life.
          </p>

          <div className="mt-6 mx-10 sm:mx-0 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a
              href="/about"
              className="px-6 py-3 bg-tech_primary text-white font-semibold rounded shadow hover:bg-tech_gold hover:text-primary transition-colors"
            >
              READ OUR STORY
            </a>
            <a
              href="/care-guide"
              className="px-6 py-3 border border-tech_gold text-tech_primary font-semibold rounded shadow hover:bg-tech_gold hover:text-white transition-colors"
            >
              HOW TO CARE
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WhatIs;
