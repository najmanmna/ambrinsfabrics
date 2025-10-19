"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { client } from "@/sanity/lib/client";
import type { Category as BaseCategory } from "@/sanity.types";

// 1. Re-using the same type and query from your MobileMenu component
export interface ExpandedCategory extends Omit<BaseCategory, "parent"> {
  parent?: {
    _id: string;
    name: string | null;
    slug: { current: string | null } | null;
  } | null;
}

const ALLCATEGORIES_QUERY = `
  *[_type == "category"] | order(_createdAt asc){
    ...,
    parent->{
      _id,
      name,
      slug
    }
  }
`;

/**
 * Dropdown animation variants
 */
const dropdownVariants = {
  hidden: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeOut" } },
};

/**
 * A desktop-first navigation bar that shows categories and subcategories on hover.
 */
const DesktopCategoryNav: React.FC = () => {
  // State for fetched data
  const [categories, setCategories] = useState<ExpandedCategory[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State to track which main category is being hovered
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const pathname = usePathname();

  // 2. Fetching logic, identical to your MobileMenu
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

  // 3. Filtering logic, identical to your Sidebar
  const mainCategories = categories?.filter((cat) => !cat.parent?._id);
  const getSubcategories = (parentId: string) =>
    categories?.filter((cat) => cat.parent?._id === parentId);

  // Simple loading skeleton to prevent layout shift
  if (loading) {
    return (
      <nav className="hidden lg:flex justify-center h-16 items-center">
        <div className="flex space-x-6">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    // This navigation is hidden on mobile (lg:flex)
    <nav className="hidden lg:flex justify-center" aria-label="Main navigation">
      <ul className="flex items-center space-x-6">
        {mainCategories?.map((mainCat) => {
          const subcategories = getSubcategories(mainCat._id!);
          const hasSubcategories = subcategories && subcategories.length > 0;
          
          // Check if the current path starts with this category's slug
          const isActive = pathname === `/category/${mainCat.slug?.current}`;

          return (
            <li
              key={mainCat._id}
              className="relative"
              // Set/unset the hovered category ID on mouse enter/leave
              onMouseEnter={() => setHoveredCategory(mainCat._id!)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Main Category Link */}
              <Link
                href={`/category/${mainCat.slug?.current}`}
                className={`flex items-center gap-1 py-5 font-serif text-lg transition-colors duration-200 ${
                  isActive
                    ? "text-[#A67B5B] font-medium" // Active color
                    : "text-[#2C3E50] hover:text-[#A67B5B]" // Default colors
                }`}
              >
                {mainCat.name}
                {/* Show chevron only if there are subcategories */}
                {hasSubcategories && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      hoveredCategory === mainCat._id ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </Link>

              {/* 4. Dropdown Menu */}
              <AnimatePresence>
                {hoveredCategory === mainCat._id && hasSubcategories && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 z-30 min-w-[240px] rounded-b-lg bg-[#FDFBF6] shadow-lg p-5"
                  >
                    <ul className="flex flex-col gap-4">
                      {/* "All" Link (as requested) */}
                      <li>
                        <Link
                          href={`/category/${mainCat.slug?.current}`}
                          onClick={() => setHoveredCategory(null)}
                          className={`block font-medium text-base transition-colors ${
                            isActive
                              ? "text-[#A67B5B] font-semibold"
                              : "text-gray-800 hover:text-[#A67B5B]"
                          }`}
                        >
                          All {mainCat.name}
                        </Link>
                      </li>

                      {/* Divider */}
                      <li className="border-t border-gray-200 -mx-5"></li>

                      {/* Subcategory Links */}
                      {subcategories.map((sub) => {
                        const isSubActive = pathname === `/category/${sub.slug?.current}`;
                        return(
                          <li key={sub._id}>
                            <Link
                              href={`/category/${sub.slug?.current}`}
                              onClick={() => setHoveredCategory(null)}
                              className={`block text-base transition-colors ${
                                isSubActive
                                  ? "text-[#A67B5B] font-semibold"
                                  : "text-gray-600 hover:text-[#A67B5B]"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DesktopCategoryNav;