"use client";

import { Menu, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { client } from "@/sanity/lib/client";
import type { Category as BaseCategory } from "@/sanity.types";

// --- TYPES ---
export interface ExpandedCategory extends Omit<BaseCategory, "parent"> {
  parent?: {
    _id: string;
    name: string | null;
    slug: { current: string | null } | null;
  } | null;
}

const ALLCATEGORIES_QUERY = `
  *[_type == "category"] | order(name asc){
    ...,
    parent->{
      _id,
      name,
      slug
    }
  }
`;

interface MobileMenuProps {
  color?: "black" | "white";
}

const MobileMenu: React.FC<MobileMenuProps> = ({ color = "black" }) => {
  const [categories, setCategories] = useState<ExpandedCategory[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await client.fetch<ExpandedCategory[]>(ALLCATEGORIES_QUERY);
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  // --- STYLE LOGIC ---
  // If color is 'white' (transparent header), text is white.
  // If color is 'black' (sticky header), text is Royal Navy.
  const textColorClass = color === "white" ? "text-white" : "text-ambrins_dark";
  const hoverColorClass = "group-hover:text-ambrins_primary"; // Rani Pink on hover

  return (
    <>
      {/* --- THE TRIGGER BUTTON --- */}
      <motion.button
        onClick={toggleSidebar}
        className={`group flex items-center gap-3 focus:outline-none transition-colors duration-300 ${textColorClass}`}
        whileTap={{ scale: 0.95 }}
      >
        {/* 1. The "MENU" Label (Hidden on very small screens, visible on mobile/tablet) */}
        <span className={`hidden xs:block font-body text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${hoverColorClass}`}>
          Menu
        </span>

        {/* 2. The Icon Container */}
        <div className={`relative p-2 rounded-full border border-transparent group-hover:bg-ambrins_primary/10 transition-all duration-300`}>
           <Menu 
             strokeWidth={1.5} 
             className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-300 ${hoverColorClass}`} 
           />
           
           {/* Decorative Dot (Optional: indicates menu is ready) */}
           {!loading && (
             <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-ambrins_secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           )}
        </div>
      </motion.button>

      {/* --- THE SIDEBAR --- */}
      {/* We pass the data down so the Sidebar doesn't have to fetch it again */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories ?? undefined}
      />
    </>
  );
};

export default MobileMenu;