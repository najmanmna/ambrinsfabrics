"use client";
import { Category, Product, ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion"; // Corrected import
import { Loader2, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { useRouter } from "next/navigation";
import { ExpandedCategory } from "./header/MobileMenu"; // Using the path from your code
import Link from "next/link";
import React from "react"; // Added React import

// --- Tree-building Logic (same as Sidebar) ---
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
    if (cat.parent?._id) {
      if (categoryMap[cat.parent._id]) {
        categoryMap[cat.parent._id].children.push(node);
      }
    } else {
      tree.push(node);
    }
  });
  return tree;
}

// --- Helper to find a node and its breadcrumbs ---
function findNodeAndBreadcrumbs(
  slug: string,
  tree: CategoryTreeNode[],
  path: CategoryTreeNode[] = []
): { node: CategoryTreeNode | null; breadcrumbs: CategoryTreeNode[] } {
  for (const node of tree) {
    const currentPath = [...path, node];
    if (node.slug?.current === slug) {
      return { node, breadcrumbs: currentPath };
    }
    const found = findNodeAndBreadcrumbs(slug, node.children, currentPath);
    if (found.node) {
      return found;
    }
  }
  return { node: null, breadcrumbs: [] };
}

// --- Helper to get all descendant IDs ---
function getDescendantIds(node: CategoryTreeNode): string[] {
  let ids = [node._id!];
  for (const child of node.children) {
    ids = [...ids, ...getDescendantIds(child)];
  }
  return ids;
}

// --- Prop Interface ---
interface Props {
  categories: ExpandedCategory[]; // Pass the flat list of all categories
  slug: string; // The slug of the *current* category
}

// --- Mapping Function (Updated) ---
const mapProductToCardType = (
  product: any // Type from the new query
): ALL_PRODUCTS_QUERYResult[number] => {
  const categoryObj = product.category as { _id: string; name: string; slug: any } | undefined;
  const subcategoryObj = product.subcategory as { _id: string; name: string; slug: any } | undefined;
  // Note: We're not explicitly mapping specificCategory to the old type,
  // but it's used in the query. ProductCard should be robust.
  
  return {
    _id: product._id,
    name: product.name ?? null,
    slug: product.slug ?? null,
    price: product.price ?? null,
    discount: product.discount ?? null,
    isFeatured: product.isFeatured ?? null,
    category: categoryObj ? { _id: categoryObj._id, name: categoryObj.name ?? null, slug: categoryObj.slug ?? null } : null,
    subcategory: subcategoryObj ? { _id: subcategoryObj._id, name: subcategoryObj.name ?? null, slug: subcategoryObj.slug ?? null } : null,
    variants:
      product.variants?.map((v: any) => ({
        _key: v._key,
        variantName: v.variantName ?? null,
        openingStock: v.openingStock ?? null,
        stockOut: v.stockOut ?? null,
        availableStock: v.availableStock ?? (v.openingStock ?? 0) - (v.stockOut ?? 0),
        // --- FIX ---
        // Pass the full images array as fetched, which now contains the asset reference
        images: v.images ?? null,
      })) ?? null,
  };
};

// --- Main Component ---
const CategoryProducts = ({ categories, slug }: Props) => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // For pushing new routes

  // Build the tree and find the current category's info
  const categoryTree = useMemo(() => buildCategoryTree(categories || []), [categories]);
  const { node: currentCategory, breadcrumbs } = useMemo(
    () => findNodeAndBreadcrumbs(slug, categoryTree),
    [slug, categoryTree]
  );
  
  // --- NEW NAVIGATION LOGIC ---
  // Row 1: Always show main (L1) categories
  const mainCategories = categoryTree;
  
  // Row 2: Show children of the *active L1 category*
  // Find the active L1 category from breadcrumbs
  const activeMainCategory = breadcrumbs[0];
  const subcategories = activeMainCategory?.children || [];

  // Row 3: Show children of the *active L2 category*
  // Find the active L2 category from breadcrumbs
  const activeSubCategory = breadcrumbs[1];
  const subSubcategories = activeSubCategory?.children || [];
  // --- END NEW NAVIGATION LOGIC ---

  useEffect(() => {
    if (!currentCategory) {
      setLoading(false);
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get the ID of the current category and all its descendants
        const allCategoryIds = getDescendantIds(currentCategory);
        
        // This query finds all products that reference ANY of the categories in the tree
        // It now correctly fetches the full image asset reference
        const query = `
          *[_type == 'product' && (
            category._ref in $allCategoryIds || 
            subcategory._ref in $allCategoryIds || 
            specificCategory._ref in $allCategoryIds
          )] | order(name asc){
            _id,
            name,
            slug,
            price,
            discount,
            isFeatured,
            category-> { _id, name, slug },
            subcategory-> { _id, name, slug },
            specificCategory-> { _id, name, slug }, // Fetch L3
            variants[]{ 
              _key, 
              variantName, 
              openingStock, 
              stockOut, 
              "availableStock": openingStock - coalesce(stockOut, 0), 
              images[]{ ..., asset-> } // <-- CRITICAL FIX for images
            }
          }
        `;
        
        const data: any[] = await client.fetch(query, { allCategoryIds });
        setProducts(data.map(mapProductToCardType));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]); // Re-fetch when the current category changes

  // Helper to handle navigation click
  const handleNavClick = (newSlug: string) => {
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  return (
    <div className="py-5">
      {/* --- REBUILT 3-LEVEL NAVIGATION --- */}
      <div className="flex flex-col sm:items-end gap-2 mb-8">
        
        {/* Row 1: Main Categories */}
        <div className="flex w-full gap-3 border-b border-gray-300 overflow-x-auto pb-2">
          {mainCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleNavClick(cat.slug?.current || "")}
              className={`relative px-4 py-2 font-semibold whitespace-nowrap transition-all duration-200
                ${cat._id === activeMainCategory?._id
                  ? "text-[#A67B5B]" // Active L1
                  : "text-gray-700 hover:text-[#A67B5B]"
              }`}
            >
              {cat.name}
              {cat._id === activeMainCategory?._id && (
                <span className="absolute bottom-[-2px] left-0 w-full h-1 bg-[#A67B5B] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Row 2: Subcategories (L2) */}
        {subcategories.length > 0 && (
          <div className="flex w-full gap-3 border-b border-gray-200 overflow-x-auto pb-2">
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleNavClick(sub.slug?.current || "")}
                className={`relative px-3 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${sub._id === activeSubCategory?._id
                    ? "text-[#2C3E50]" // Active L2
                    : "text-gray-600 hover:text-[#2C3E50]"
                }`}
              >
                {sub.name}
                {sub._id === activeSubCategory?._id && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-[#2C3E50] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Row 3: Sub-subcategories (L3) */}
        {subSubcategories.length > 0 && (
          <div className="flex w-full gap-3 border-b border-gray-200 overflow-x-auto pb-2">
            {subSubcategories.map((subSub) => (
              <button
                key={subSub._id}
                onClick={() => handleNavClick(subSub.slug?.current || "")}
                className={`relative px-3 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200
                  ${subSub.slug?.current === slug
                    ? "text-[#A67B5B] font-semibold" // Active L3
                    : "text-gray-500 hover:text-[#A67B5B]"
                }`}
              >
                {subSub.name}
                {subSub.slug?.current === slug && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-[#A67B5B] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* --- END NAVIGATION --- */}


      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center rounded-lg w-full">
          <motion.div className="flex items-center space-x-2 text-[#2C3E50]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading products...</span>
          </motion.div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <ProductCard product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable
          selectedTab={currentCategory?.name || "this category"}
          className="mt-0 w-full"
        />
      )}
    </div>
  );
};

export default CategoryProducts;

