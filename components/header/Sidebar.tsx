"use client";

import { X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { quickLinksDataMenu } from "@/constants";
import { ExpandedCategory } from "./MobileMenu";
import { GiftIcon } from "@heroicons/react/24/outline";

// --- NEW TYPES & HELPER FUNCTION ---

// Define the shape of a node in our category tree
interface CategoryTreeNode extends ExpandedCategory {
  children: CategoryTreeNode[];
}

/**
 * Helper function to build a nested tree from a flat list of categories.
 */
function buildCategoryTree(categories: ExpandedCategory[]): CategoryTreeNode[] {
  const categoryMap: { [id: string]: CategoryTreeNode } = {};
  const tree: CategoryTreeNode[] = [];

  // Initialize map and add children array to each category
  categories.forEach(cat => {
    categoryMap[cat._id!] = { ...cat, children: [] };
  });

  // Build the tree structure by assigning children to their parents
  categories.forEach(cat => {
    const node = categoryMap[cat._id!];
    if (cat.parent?._id) {
      // If it has a parent, add it to the parent's children array
      if (categoryMap[cat.parent._id]) {
        categoryMap[cat.parent._id].children.push(node);
      }
    } else {
      // If it's a root category, add it to the main tree array
      tree.push(node);
    }
  });

  return tree;
}

// --- NEW RECURSIVE SUB-COMPONENT ---

interface SidebarCategoryItemProps {
  category: CategoryTreeNode;
  level: number;
  onClose: () => void; // Pass onClose to close sidebar on link click
}

const SidebarCategoryItem: React.FC<SidebarCategoryItemProps> = ({ category, level, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hasChildren = category.children.length > 0;

  // Indentation based on level
  const paddingLeft = `pl-${4 + level * 4}`; // e.g., pl-4, pl-8, pl-12
  const mainLinkActive = pathname === `/category/${category.slug?.current}`;

  return (
    <div className="mb-1">
      {/* Main item row */}
      <div className={`flex items-center justify-between ${level === 0 ? 'pl-0' : paddingLeft}`}>
        <Link
          href={`/category/${category.slug?.current}`}
          onClick={onClose}
          className={`py-2 font-serif text-xl transition-colors duration-200 ${
            mainLinkActive
              ? "text-[#A67B5B] font-semibold"
              : "text-[#2C3E50] hover:text-[#A67B5B]"
          }`}
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-[#A67B5B]"
            aria-expanded={isOpen}
            aria-label={`Toggle ${category.name} sub-menu`}
          >
            <ChevronDown
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-180 text-[#A67B5B]" : "rotate-0"
              }`}
              size={20}
            />
          </button>
        )}
      </div>

      {/* Children (Sub-menu) */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-1 overflow-hidden border-l-2 border-gray-200"
          >
            {/* "All" Link for this parent */}
            <Link
              href={`/category/${category.slug?.current}`}
              onClick={onClose}
              className={`block py-1.5 ${paddingLeft} text-base transition-colors ${
                mainLinkActive
                  ? "text-[#A67B5B] font-semibold"
                  : "text-gray-700 hover:text-[#A67B5B]"
              }`}
            >
              All {category.name}
            </Link>

            {/* Recursive render for children */}
            {category.children.map((child) => (
              <SidebarCategoryItem
                key={child._id}
                category={child}
                level={level + 1} // Increment level
                onClose={onClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- UPDATED SIDEBAR COMPONENT ---

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: ExpandedCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  
  // Create the category tree from the flat 'categories' prop
  const categoryTree = useMemo(() => {
    return categories ? buildCategoryTree(categories) : [];
  }, [categories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed h-screen inset-0 bg-black/40 z-40"
        >
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 sm:w-full max-w-sm bg-[#FDFBF6] z-50 h-screen p-6 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium text-[#2C3E50]">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-[#2C3E50] p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* CTA for Vouchers */}
            <Link
              href="/vouchers" // Corrected href from "/voucher"
              onClick={onClose}
              className="flex items-center justify-center gap-3 bg-[#A67B5B] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#8e6e52] transition-colors duration-200"
            >
              <GiftIcon className="w-5 h-5" />
              <span>Gift Vouchers</span>
            </Link>

            {/* Scrollable Section for Categories + Store/Care */}
            <div className="flex-grow overflow-y-auto mt-6 pr-5 space-y-6">
              {/* Category List */}
              <div>
                {/* --- UPDATED RENDER LOGIC --- */}
                {categories ? ( // Check if prop has loaded
                  categoryTree.length > 0 ? (
                    // Render the tree recursively
                    categoryTree.map((rootCategory) => (
                      <SidebarCategoryItem
                        key={rootCategory._id}
                        category={rootCategory}
                        level={0}
                        onClose={onClose}
                      />
                    ))
                  ) : (
                    // Prop is loaded, but no categories found
                    <div className="text-gray-400">No categories found.</div>
                  )
                ) : (
                  // Prop is still undefined (loading in parent)
                  <div className="text-gray-400">Loading categories...</div>
                )}
                {/* --- END UPDATED RENDER LOGIC --- */}
              </div>

              {/* Store Locator + Care Guide */}
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <Link
                  href="/#studio"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  Store Locator
                </Link>
                <Link
                  href="/care-guide"
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  Care Guide
                </Link>
              </div>
            </div>

            {/* Footer Links (Pinned Bottom) */}
            <div className="border-t border-gray-200 mb-15 pt-4 mt-4 space-y-3">
              {quickLinksDataMenu?.map((item) => (
                <Link
                  key={item?.title}
                  href={item?.href}
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  {item?.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

