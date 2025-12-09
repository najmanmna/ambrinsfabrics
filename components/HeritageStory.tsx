"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // ✨ Animation library
import Container from "./Container";

// 🖼️ Updated Imports (from your new 'images' folder)
import img1 from "@/images/heri1.png";
import img2 from "@/images/heri2.png";
import img3 from "@/images/heri3.png";
import sectionBreak from "@/images/sectionBreak.png";
import borderTile from "@/images/line-motif.png";

const heritagePoints = [
  {
    title: "Handcrafted in India",
    description:
      "We source from traditional artisan communities where block printing has been passed down for generations.",
    image: img1,
  },
  {
    title: "Curated for Sri Lanka",
    description:
      "Our collections are selected with Sri Lankan lifestyles in mind – lightweight, breathable, and timelessly stylish.",
    image: img2,
  },
  {
    title: "Sustainable, Timeless, Artisan-Made",
    description:
      "Each fabric is made to last. When cared for, it carries the soul of slow fashion.",
    image: img3,
  },
];

// ✨ Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const HeritageStory = () => {
  return (
    <div className="relative overflow-hidden pb-10">
      {/* Footer Section Divider (Absolute Bottom) */}
      <div className="absolute -bottom-1 w-full overflow-hidden leading-[0] z-20">
        <Image
          src={sectionBreak}
          alt="Section divider"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>

      <Container className="py-16 sm:py-24">
        {/* Heading */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
            THE HERITAGE WE BRING
          </h2>
          <p className="text-tech_gold mt-4 text-lg sm:text-xl max-w-xl mx-auto font-light leading-relaxed">
            A celebration of authentic handblock printing, carefully curated for
            your home in Sri Lanka.
          </p>
        </motion.div>

        {/* Points Loop */}
        <div className="flex flex-col gap-20 sm:gap-32">
          {heritagePoints.map((point, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }} // Triggers animation when 100px into view
                className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <motion.div 
                  className={`lg:w-1/2 text-center ${isEven ? 'lg:text-left' : 'lg:text-right'}`}
                  variants={{
                    hidden: { opacity: 0, x: isEven ? -50 : 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                >
                  <h3 className="text-2xl sm:text-3xl font-playfair font-semibold mb-4 text-[#2C3E50]">
                    <span className="text-tech_gold mr-2 text-xl align-middle">0{idx + 1}.</span> 
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 inline-block">
                    {point.description}
                  </p>
                </motion.div>

                {/* Image Frame */}
                <motion.div
                  className="lg:w-1/2 w-full max-w-[600px]"
                  variants={{
                    hidden: { opacity: 0, x: isEven ? 50 : -50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
                  }}
                >
                  <div
                    className="p-[12px] relative shadow-lg"
                    style={{
                      backgroundImage: `url(${borderTile.src})`,
                      backgroundRepeat: "repeat",
                      backgroundSize: "40px", // Fixed size looks sharper
                    }}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 shadow-inner">
                      <Image
                        src={point.image}
                        alt={point.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-1000 ease-in-out"
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default HeritageStory;