"use client";

import { X, ChevronDown, Gift, MapPin, Ruler } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { quickLinksDataMenu } from "@/constants";
import { ExpandedCategory } from "./MobileMenu";

// --- TYPES & HELPERS ---
interface CategoryTreeNode extends ExpandedCategory {
  children: CategoryTreeNode[];
}

function buildCategoryTree(categories: ExpandedCategory[]): CategoryTreeNode[] {
  const categoryMap: { [id: string]: CategoryTreeNode } = {};
  const tree: CategoryTreeNode[] = [];

  categories.forEach(cat => {
    categoryMap[cat._id!] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    const node = categoryMap[cat._id!];
    if (cat.parent?._id && categoryMap[cat.parent._id]) {
       categoryMap[cat.parent._id].children.push(node);
    } else {
       tree.push(node);
    }
  });

  return tree;
}

// --- SVG: Decorative Sidebar Mandala ---
const SidebarMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
     <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" />
  </svg>
);

// --- RECURSIVE CATEGORY ITEM ---
interface SidebarCategoryItemProps {
  category: CategoryTreeNode;
  level: number;
  onClose: () => void;
}

const SidebarCategoryItem: React.FC<SidebarCategoryItemProps> = ({ category, level, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hasChildren = category.children.length > 0;
  const paddingLeft = level === 0 ? "pl-0" : `pl-${4 + level * 4}`;
  const isActive = pathname === `/category/${category.slug?.current}`;

  return (
    <div className="mb-2">
      <div className={`flex items-center justify-between group ${paddingLeft}`}>
        <Link
          href={`/category/${category.slug?.current}`}
          onClick={onClose}
          className={`py-2 font-heading text-lg transition-colors duration-300 ${
            isActive
              ? "text-ambrins_primary"
              : "text-ambrins_dark hover:text-ambrins_primary"
          }`}
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-ambrins_secondary/60 hover:text-ambrins_primary transition-colors"
          >
            <ChevronDown
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-180 text-ambrins_primary" : "rotate-0"
              }`}
              size={18}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 overflow-hidden border-l border-ambrins_dark/10 ml-2 pl-4"
          >
            <Link
              href={`/category/${category.slug?.current}`}
              onClick={onClose}
              className={`block py-2 font-body text-sm font-bold uppercase tracking-wider transition-colors ${
                 isActive ? "text-ambrins_primary" : "text-ambrins_text/60 hover:text-ambrins_primary"
              }`}
            >
              All {category.name}
            </Link>
            {category.children.map((child) => (
              <SidebarCategoryItem
                key={child._id}
                category={child}
                level={level + 1}
                onClose={onClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN SIDEBAR COMPONENT ---
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: ExpandedCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  
  const categoryTree = useMemo(() => {
    return categories ? buildCategoryTree(categories) : [];
  }, [categories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ambrins_dark/60 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full max-w-sm h-full bg-ambrins_light z-50 shadow-2xl flex flex-col overflow-hidden border-r border-ambrins_secondary/20"
          >
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 text-ambrins_secondary/5 pointer-events-none -translate-y-1/2 translate-x-1/2">
                <SidebarMandala className="w-full h-full animate-spin-slow" />
            </div>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-ambrins_dark/5 relative z-10">
              <h2 className="font-heading text-2xl text-ambrins_dark">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ambrins_dark/5 text-ambrins_dark transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10 scrollbar-thin scrollbar-thumb-ambrins_secondary/20">
                
                {/* CTA Button */}
                {/* <Link
                    href="/vouchers"
                    onClick={onClose}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-ambrins_primary to-ambrins_primary/90 text-white font-body text-xs font-bold uppercase tracking-[0.1em] py-4 rounded-sm shadow-md hover:shadow-lg hover:to-ambrins_dark transition-all duration-300 mb-8 group"
                >
                    <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Gift Vouchers</span>
                </Link> */}

                {/* Categories */}
                <div className="space-y-4 mb-8">
                    {categories ? (
                        categoryTree.length > 0 ? (
                            categoryTree.map((rootCategory) => (
                                <SidebarCategoryItem
                                    key={rootCategory._id}
                                    category={rootCategory}
                                    level={0}
                                    onClose={onClose}
                                />
                            ))
                        ) : (
                            <div className="text-ambrins_muted text-sm italic">No categories found.</div>
                        )
                    ) : (
                         <div className="flex items-center gap-2 text-ambrins_secondary text-sm">
                            <span className="w-2 h-2 rounded-full bg-ambrins_secondary animate-ping"></span>
                            Loading...
                         </div>
                    )}
                </div>

                {/* Secondary Links */}
                <div className="border-t border-ambrins_dark/10 pt-6 space-y-4">
                    <Link href="/#studio" onClick={onClose} className="flex items-center gap-3 text-ambrins_text/80 hover:text-ambrins_primary transition-colors group">
                        <MapPin className="w-4 h-4 text-ambrins_secondary group-hover:text-ambrins_primary transition-colors" />
                        <span className="font-body text-sm font-medium">Store Locator</span>
                    </Link>
                    {/* <Link href="/care-guide" onClick={onClose} className="flex items-center gap-3 text-ambrins_text/80 hover:text-ambrins_primary transition-colors group">
                        <Ruler className="w-4 h-4 text-ambrins_secondary group-hover:text-ambrins_primary transition-colors" />
                        <span className="font-body text-sm font-medium">Care Guide</span>
                    </Link> */}
                </div>
            </div>

            {/* Footer */}
            {/* <div className="p-6 bg-white border-t border-ambrins_dark/5 relative z-10">
                <div className="flex flex-wrap gap-4 justify-center text-xs text-ambrins_muted font-body font-medium uppercase tracking-wide">
                    {quickLinksDataMenu?.map((item) => (
                        <Link
                            key={item?.title}
                            href={item?.href}
                            onClick={onClose}
                            className="hover:text-ambrins_primary transition-colors"
                        >
                            {item?.title}
                        </Link>
                    ))}
                </div>
            </div> */}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;