"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { client } from "@/sanity/lib/client";
import type { Category as BaseCategory } from "@/sanity.types";

// 1. Re-using the same type and query
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

/**
 * A recursive component to render a category and its children.
 */
const CategoryTreeItem: React.FC<{ category: CategoryTreeNode; level: number }> = ({ category, level }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const hasChildren = category.children.length > 0;
  
  // Check if this category or any of its children are active
  const checkIsActive = (cat: CategoryTreeNode): boolean => {
    if (pathname === `/category/${cat.slug?.current}`) return true;
    return cat.children.some(checkIsActive); // Recursively check children
  };
  const isActive = checkIsActive(category);

  // Define styles based on the level
  const linkPadding = level === 0 ? "py-5" : "py-3 px-5";
  const linkColor = isActive
    ? "text-[#A67B5B] font-medium"
    : "text-[#2C3E50] hover:text-[#A67B5B]";

  const dropdownPosition = level === 0
    ? "absolute top-full left-0 z-30" // Level 1 dropdown (main menu)
    : "absolute top-0 left-full z-30"; // Level 2+ dropdown (side menu)

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/category/${category.slug?.current}`}
        className={`flex items-center justify-between gap-1 ${linkPadding} font-serif text-lg transition-colors duration-200 ${linkColor}`}
      >
        {category.name}
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? (level === 0 ? "rotate-180" : "-rotate-90") : (level === 0 ? "rotate-0" : "-rotate-90")
            }`}
          />
        )}
      </Link>

      {/* --- RECURSIVE DROPDOWN --- */}
      <AnimatePresence>
        {isHovered && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${dropdownPosition} min-w-[240px] rounded-b-lg bg-[#FDFBF6] shadow-lg`}
          >
            <ul className="flex flex-col">
              {/* Add an "All" link for the parent category */}
              <li>
                <Link
                  href={`/category/${category.slug?.current}`}
                  onClick={() => setIsHovered(false)}
                  className={`block py-3 px-5 text-base transition-colors ${
                    pathname === `/category/${category.slug?.current}`
                      ? "text-[#A67B5B] font-semibold"
                      : "text-gray-800 hover:text-[#A67B5B]"
                  }`}
                >
                  All {category.name}
                </Link>
              </li>
              <li className="border-t border-gray-200 -mx-5"></li>
              
              {/* Render children by calling this component again */}
              {category.children.map((child) => (
                <CategoryTreeItem key={child._id} category={child} level={level + 1} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};


/**
 * The main Desktop Navigation component.
 */
const DesktopCategoryNav: React.FC = () => {
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuildTree = async () => {
      setLoading(true);
      try {
        const flatCategories = await client.fetch<ExpandedCategory[]>(ALLCATEGORIES_QUERY);
        const treeData = buildCategoryTree(flatCategories || []);
        setCategoryTree(treeData);
      } catch (err) {
        console.error("Failed to load or build category tree", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndBuildTree();
  }, []);

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
    <nav className="hidden lg:flex justify-center" aria-label="Main navigation">
      <ul className="flex items-center space-x-6">
        {/* Render the first level of the tree */}
        {categoryTree.map((rootCategory) => (
          <CategoryTreeItem key={rootCategory._id} category={rootCategory} level={0} />
        ))}
      </ul>
    </nav>
  );
};

export default DesktopCategoryNav;

