"use client";

import React from "react";
import Link from "next/link";
import useCartStore from "@/store";
import { motion } from "framer-motion";

interface CartMenuProps {
  color?: "black" | "white"; // dynamic text color passed from Header
}

const CartMenu: React.FC<CartMenuProps> = ({ color = "black" }) => {
  const { items } = useCartStore();
  const cartCount = items.length;

  // --- Color Logic ---
  // Matches the Navigation Links: White on top, Black on scroll
  const textColor = color === "white" ? "text-white" : "text-ambrins_black";
  const hoverColor = color === "white" ? "hover:text-white/80" : "hover:text-ambrins_gold";

  return (
    <motion.div
      className="relative z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        href="/cart"
        className={`relative inline-flex items-center justify-center transition-colors duration-300 font-body text-xs md:text-sm font-medium tracking-widest uppercase ${textColor} ${hoverColor}`}
      >
        <span>
          Cart ({cartCount})
        </span>
      </Link>
    </motion.div>
  );
};

export default CartMenu;