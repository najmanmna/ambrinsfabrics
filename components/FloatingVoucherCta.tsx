"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GiftIcon } from "@heroicons/react/24/outline";

interface FloatingVoucherCtaProps {
  href?: string;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  offset?: number; // Offset from the corner in px
}

const FloatingVoucherCta: React.FC<FloatingVoucherCtaProps> = ({
  href = "/vouchers", // Changed default back to /vouchers, assuming this is correct
  label = "Gift Vouchers",
  position = "bottom-right",
  offset = 40,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Determine inline style for position
  const getPositionStyle = () => {
    const style: React.CSSProperties = {
      position: "fixed", // Ensure fixed positioning
      zIndex: 40,        // Ensure z-index is applied
    };
    switch (position) {
      case "bottom-right":
        style.bottom = `${offset}px`;
        style.right = `${offset}px`;
        break;
      case "bottom-left":
        style.bottom = `${offset}px`;
        style.left = `${offset}px`;
        break;
      case "top-right":
        style.top = `${offset}px`;
        style.right = `${offset}px`;
        break;
      case "top-left":
        style.top = `${offset}px`;
        style.left = `${offset}px`;
        break;
    }
    return style;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            },
          }}
          // Apply the position and z-index directly via inline style
          style={getPositionStyle()}
          // Removed dynamic Tailwind classes like `bottom-[${offset}px]`
          // Keep other fixed Tailwind classes here if any, but they are not needed for position
        >
          <Link
            href={href}
            className="flex items-center gap-2 bg-[#A67B5B] text-white px-4 py-4 rounded-full shadow-lg
                       hover:bg-[#8e6e52] hover:shadow-xl transition-all duration-300 transform hover:scale-105
                       text-sm font-semibold whitespace-nowrap"
            aria-label={label}
          >
            <GiftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>{" "}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingVoucherCta;