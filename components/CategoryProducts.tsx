"use client";

import React, { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Filter, 
  ChevronDown, 
  X, 
  ArrowDownUp, 
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { ExpandedCategory } from "./header/MobileMenu";

// --- TYPES ---
interface CategoryProductsProps {
  slug: string;
  categories: ExpandedCategory[]; // Passed from parent, used for sidebar/context if needed
}

type SortOption = "newest" | "price-low" | "price-high" | "name-asc" | "name-desc";

const CategoryProducts: React.FC<CategoryProductsProps> = ({ slug }) => {
  // --- STATE ---
  const [products, setProducts] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(10);

  // --- QUERIES ---
  
  // 1. Fetch Category Details (Name, Description)
  const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{
    _id,
    name,
    description
  }`;

  // 2. Fetch Products (Matches Category OR Subcategory)
  // 2. Fetch Products (Matches Category OR Subcategory)
  const productsQuery = `*[_type == "product" && (category->slug.current == $slug || subcategory->slug.current == $slug)]{
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
    _createdAt,
    category-> { name, slug },
    subcategory-> { name, slug },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      // 👇 THIS CALCULATES THE STOCK CORRECTLY IN GROQ
      "availableStock": openingStock - coalesce(stockOut, 0),
      
      // 👇 THIS FIXES THE IMAGE BUILDER ISSUE
      images[] 
    }
  }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both category info and products in parallel
        const [catData, prodData] = await Promise.all([
          client.fetch(categoryQuery, { slug }),
          client.fetch(productsQuery, { slug })
        ]);

        setCategoryInfo(catData);
        setProducts(prodData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // --- DERIVED DATA: Unique Subcategories for Filter ---
  const subcategories = useMemo(() => {
    // Extract unique subcategory names from the fetched products
    const subs = new Set(
      products
        .map((p: any) => p.subcategory?.name)
        .filter(Boolean) // Remove nulls
    );
    return ["All", ...Array.from(subs)];
  }, [products]);

  // --- FILTERING & SORTING LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Subcategory Filter
    if (selectedSubcategory !== "All") {
      result = result.filter((p: any) => p.subcategory?.name === selectedSubcategory);
    }

    // 2. Sorting
    result.sort((a: any, b: any) => {
      switch (sortOption) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "newest": default: return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      }
    });

    return result;
  }, [products, selectedSubcategory, sortOption]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  // --- RENDER ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
           <div className="absolute inset-0 bg-ambrins_secondary/20 rounded-full blur-xl animate-pulse" />
           <Loader2 className="w-10 h-10 text-ambrins_dark animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  // Handle case where category doesn't exist or fetch failed
  if (!categoryInfo && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-heading text-ambrins_dark">Category Not Found</h2>
        <Link href="/shop" className="flex items-center gap-2 text-ambrins_secondary hover:underline">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      
      {/* --- 1. HERO HEADER --- */}
      <div className="bg-[#FAFAFA] border-b border-ambrins_dark/5 py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-4 text-ambrins_text/60 text-xs font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-ambrins_primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-ambrins_primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-ambrins_secondary">{categoryInfo?.name || slug}</span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl text-ambrins_dark mb-6"
          >
            {categoryInfo?.name || "Collection"}
          </motion.h1>
          
          {categoryInfo?.description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-body text-ambrins_text/70 max-w-2xl mx-auto leading-relaxed"
            >
              {categoryInfo.description}
            </motion.p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
        
        {/* --- 2. TOOLBAR (Filter & Sort) --- */}
        {products.length > 0 && (
          <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm mb-10 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="text-sm font-medium text-ambrins_text/60">
              Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              
              {/* Subcategory Filter (Only show if subcategories exist) */}
              {subcategories.length > 2 && (
                <div className="relative group min-w-[150px]">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Filter className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <select 
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-ambrins_dark hover:border-ambrins_secondary/50 focus:outline-none cursor-pointer"
                  >
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub === "All" ? "All Types" : sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="relative group min-w-[160px]">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <ArrowDownUp className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-ambrins_dark hover:border-ambrins_secondary/50 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A - Z</option>
                  <option value="name-desc">Name: Z - A</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* --- 3. PRODUCTS GRID --- */}
        {filteredProducts.length === 0 ? (
          <div className="py-12">
             <NoProductAvailable selectedTab={selectedSubcategory === "All" ? "Products" : selectedSubcategory} />
             {selectedSubcategory !== "All" && (
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => setSelectedSubcategory("All")}
                    className="text-ambrins_secondary font-medium hover:underline flex items-center gap-2"
                  >
                    <X size={14} /> Clear filters
                  </button>
                </div>
             )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              <AnimatePresence>
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  className="group relative px-8 py-3 bg-white border border-ambrins_dark/20 text-ambrins_dark font-medium text-sm tracking-wide uppercase hover:bg-ambrins_dark hover:text-white transition-all duration-300 rounded-full overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Show More 
                    <span className="opacity-50">
                      ({filteredProducts.length - visibleCount})
                    </span>
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;