"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// --- SVG: Decorative Background Mandala ---
const EmptyStateMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" opacity="0.1"/>
  </svg>
);

// --- ANIMATION: The Golden Loom ---
const WeavingLoomIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Warp threads (Vertical - Royal Navy) */}
      {[...Array(11)].map((_, i) => (
        <line
          key={`warp-${i}`}
          x1={10 + i * 8}
          y1="5"
          x2={10 + i * 8}
          y2="55"
          className="stroke-ambrins_dark/20"
          strokeWidth="1.5"
        />
      ))}

      {/* The Weft Thread (Horizontal - Growing Gold Line) */}
      <motion.line
         x1="10"
         y1="30"
         x2="90"
         y2="30"
         className="stroke-ambrins_secondary"
         strokeWidth="2"
         strokeDasharray="80"
         animate={{ strokeDashoffset: [80, 0, 80] }}
         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shuttle (The moving tool - Rani Pink) */}
      <motion.path
        d="M0,5 C0,2 2,0 5,0 L25,0 C28,0 30,2 30,5 C30,8 28,10 25,10 L5,10 C2,10 0,8 0,5 Z"
        fill="currentColor"
        className="text-ambrins_primary"
        animate={{ x: [5, 65, 5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: 25 }} // Center vertically
      />
    </svg>
  );
};

const NoProductAvailable = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center space-y-6 text-center rounded-sm w-full py-20 bg-ambrins_light border border-ambrins_dark/5 overflow-hidden",
        className
      )}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-64 h-64 text-ambrins_secondary animate-spin-slow">
            <EmptyStateMandala className="w-full h-full" />
         </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <WeavingLoomIcon className="w-24 h-auto" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-heading text-3xl md:text-4xl text-ambrins_dark mb-2"
          >
            Currently on the Loom
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md text-ambrins_text/70 font-body text-sm leading-relaxed px-4 mb-8"
          >
            It seems every piece from the{" "}
            {selectedTab && (
              <span className="font-bold text-ambrins_primary uppercase tracking-wide mx-1">
                {selectedTab}
              </span>
            )}{" "}
            collection has found a home. Our artisans are crafting new textures as we speak.
          </motion.p>

          {/* Action Button */}
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link 
                href="/shop"
                className="inline-flex items-center gap-2 border-b border-ambrins_secondary text-ambrins_secondary font-body text-xs font-bold uppercase tracking-[0.2em] hover:text-ambrins_dark hover:border-ambrins_dark transition-colors pb-1"
            >
                Explore Other Collections
                <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
      </div>
    </div>
  );
};

export default NoProductAvailable;