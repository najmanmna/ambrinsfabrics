"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { 
  Loader2, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  ArrowDownUp 
} from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

// --- TYPES ---
type SortOption = "newest" | "price-low" | "price-high" | "name-asc" | "name-desc";

const AllProductsGrid = () => {
  // --- STATE ---
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(10); // Pagination: Start with 10

  // Mobile/UI Toggles
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- QUERY: Modified to fetch createdAt for sorting ---
  const query = `*[_type == "product"]{
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
    _createdAt,
    category-> { _id, name, slug },
    subcategory-> { _id, name, slug },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0),
      images[]{asset->{url}}
    }
  }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any[] = await client.fetch(query);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- DERIVED DATA: Unique Categories ---
  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.category?.name).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // --- FILTERING & SORTING LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((p: any) => p.category?.name === selectedCategory);
    }

    // 3. Sorting
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
  }, [products, searchQuery, selectedCategory, sortOption]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery, selectedCategory, sortOption]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOption("newest");
  };

  // --- RENDER HELPERS ---
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 w-full">
        <div className="relative">
           <div className="absolute inset-0 bg-ambrins_secondary/20 rounded-full blur-xl animate-pulse" />
           <Loader2 className="w-10 h-10 text-ambrins_dark animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-20 bg-[#FAFAFA] border-t border-ambrins_dark/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center mb-10">
           <div className="flex items-center gap-2 mb-3">
             <Sparkles className="w-4 h-4 text-ambrins_secondary" />
             <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
               The Full Collection
             </span>
           </div>
           <h2 className="font-heading text-3xl md:text-5xl text-ambrins_dark mb-4">
             All Products
           </h2>
           <p className="font-body text-ambrins_text/70 text-sm max-w-lg">
             {products.length} unique items available.
           </p>
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Left: Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ambrins_secondary/20 focus:border-ambrins_secondary transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>

            {/* Right: Filters & Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              
              {/* Category Dropdown */}
              <div className="relative group min-w-[140px]">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-ambrins_dark hover:border-ambrins_secondary/50 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

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

          {/* Active Filters Display */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 overflow-hidden"
              >
                <span className="text-xs text-gray-400 font-medium">Active:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-ambrins_secondary/10 text-ambrins_secondary text-xs rounded-md font-medium">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-ambrins_secondary/10 text-ambrins_secondary text-xs rounded-md font-medium">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button 
                  onClick={handleClearFilters}
                  className="text-xs text-gray-400 hover:text-ambrins_dark underline ml-auto"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- PRODUCT GRID --- */}
        {filteredProducts.length === 0 ? (
          <div className="py-12">
             <NoProductAvailable selectedTab={selectedCategory === "All" ? "Products" : selectedCategory} />
             <div className="flex justify-center mt-4">
               <button 
                 onClick={handleClearFilters}
                 className="text-ambrins_secondary font-medium hover:underline"
               >
                 Clear filters to see all products
               </button>
             </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <AnimatePresence key={product._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>

            {/* --- LOAD MORE --- */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  className="group relative px-8 py-3 bg-white border border-ambrins_dark/20 text-ambrins_dark font-medium text-sm tracking-wide uppercase hover:bg-ambrins_dark hover:text-white transition-all duration-300 rounded-full overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Show More 
                    <span className="opacity-50">
                      ({filteredProducts.length - visibleCount} remaining)
                    </span>
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllProductsGrid;