"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { 
  Loader2, Search, Filter, X, ChevronDown, SlidersHorizontal 
} from "lucide-react";
import ProductCard from "./ProductCard";
import PriceFormatter from "./PriceFormatter";
import Container from "./Container";

// --- TYPES ---
type SortOption = "newest" | "price-low" | "price-high" | "name-asc";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount?: number;
  _createdAt: string;
  category?: { name: string };
  material?: string;
  variants?: any[];
  [key: string]: any;
}

const ShopInterface = () => {
  // --- DATA STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]); 
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  
  // --- UI STATE ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // --- FETCH ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // ✅ UPDATED QUERY: Fetches ALL products with your Stock/Image fixes
        const query = `*[_type == "product"] | order(_createdAt desc) {
          _id,
          name,
          slug,
          price,
          discount,
          isFeatured,
          _createdAt,
          material, 
          category-> { name, slug },
          subcategory-> { name, slug },
          variants[]{
            _key,
            variantName,
            openingStock,
            stockOut,
            // 👇 CORRECT STOCK CALCULATION
            "availableStock": openingStock - coalesce(stockOut, 0),
            // 👇 CORRECT IMAGE OBJECT (Fixes Builder)
            images[] 
          },
          images[]
        }`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- DYNAMIC FILTER OPTIONS ---
  const facets = useMemo(() => {
    const categories = new Set<string>();
    const materials = new Set<string>();
    let maxPrice = 0;

    products.forEach(p => {
      if (p.category?.name) categories.add(p.category.name);
      if (p.material) materials.add(p.material);
      if (p.price > maxPrice) maxPrice = p.price;
    });

    return {
      categories: Array.from(categories).sort(),
      materials: Array.from(materials).sort(),
      maxPrice: Math.ceil(maxPrice / 1000) * 1000 
    };
  }, [products]);

  // --- FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // 2. Category
      if (selectedCategory && p.category?.name !== selectedCategory) return false;
      // 3. Material
      if (selectedMaterial && p.material !== selectedMaterial) return false;
      // 4. Price
      const finalPrice = p.price - (p.price * (p.discount || 0) / 100);
      if (finalPrice < priceRange[0] || finalPrice > priceRange[1]) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.price - (a.price * (a.discount || 0) / 100);
      const priceB = b.price - (b.price * (b.discount || 0) / 100);
      
      switch (sortOption) {
        case "price-low": return priceA - priceB;
        case "price-high": return priceB - priceA;
        case "name-asc": return a.name.localeCompare(b.name);
        default: return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      }
    });
  }, [products, searchQuery, selectedCategory, selectedMaterial, priceRange, sortOption]);

  // --- HANDLERS ---
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedMaterial(null);
    setPriceRange([0, facets.maxPrice || 50000]);
    setSearchQuery("");
  };

  // --- SUB-COMPONENT: Filter Sidebar ---
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search fabrics..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-3 pr-10 py-2 bg-transparent border-b border-ambrins_dark/20 focus:border-ambrins_dark focus:outline-none text-sm placeholder:text-ambrins_text/40"
        />
        <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ambrins_dark/40" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-heading text-lg text-ambrins_dark mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border border-ambrins_dark/30 flex items-center justify-center transition-colors ${!selectedCategory ? 'bg-ambrins_dark border-ambrins_dark' : 'group-hover:border-ambrins_secondary'}`}>
              {!selectedCategory && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <input type="radio" checked={!selectedCategory} onChange={() => setSelectedCategory(null)} className="hidden" />
            <span className={`text-sm ${!selectedCategory ? 'text-ambrins_dark font-bold' : 'text-ambrins_text/70 group-hover:text-ambrins_secondary'}`}>All Categories</span>
          </label>
          {facets.categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border border-ambrins_dark/30 flex items-center justify-center transition-colors ${selectedCategory === cat ? 'bg-ambrins_dark border-ambrins_dark' : 'group-hover:border-ambrins_secondary'}`}>
                {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <input type="radio" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="hidden" />
              <span className={`text-sm ${selectedCategory === cat ? 'text-ambrins_dark font-bold' : 'text-ambrins_text/70 group-hover:text-ambrins_secondary'}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      {facets.materials.length > 0 && (
        <div>
          <h3 className="font-heading text-lg text-ambrins_dark mb-3">Material</h3>
          <div className="flex flex-wrap gap-2">
            {facets.materials.map(mat => (
              <button
                key={mat}
                onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  selectedMaterial === mat 
                    ? 'bg-ambrins_dark text-white border-ambrins_dark' 
                    : 'bg-white text-ambrins_text/70 border-ambrins_dark/10 hover:border-ambrins_secondary hover:text-ambrins_secondary'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-heading text-lg text-ambrins_dark mb-3">Price Range</h3>
        <div className="flex items-center gap-2 text-sm text-ambrins_text/80 mb-4">
           <PriceFormatter amount={priceRange[0]} className="font-bold" />
           <span>-</span>
           <PriceFormatter amount={priceRange[1]} className="font-bold" />
        </div>
        <input 
          type="range" 
          min={0} 
          max={facets.maxPrice || 50000} 
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full accent-ambrins_dark h-1 bg-ambrins_dark/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <section className="pt-24 pb-20">
      <Container>
        
        {/* --- PAGE HEADER --- */}
        <div className="mb-12 border-b border-ambrins_dark/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-ambrins_dark mb-2">The Collection</h1>
            <p className="text-ambrins_text/60 text-sm md:text-base max-w-xl">
              Showing {filteredProducts.length} results 
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-ambrins_dark/20 rounded-sm text-sm font-medium uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b border-ambrins_dark/20 text-sm font-medium text-ambrins_dark focus:outline-none cursor-pointer hover:border-ambrins_dark transition-colors"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A - Z</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ambrins_dark/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- ACTIVE FILTERS BAR --- */}
        {(selectedCategory || selectedMaterial || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-ambrins_secondary/10 text-ambrins_secondary text-xs font-bold uppercase tracking-wider rounded-full hover:bg-ambrins_secondary/20 transition-colors">
                {selectedCategory} <X className="w-3 h-3" />
              </button>
            )}
            {selectedMaterial && (
              <button onClick={() => setSelectedMaterial(null)} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-ambrins_secondary/10 text-ambrins_secondary text-xs font-bold uppercase tracking-wider rounded-full hover:bg-ambrins_secondary/20 transition-colors">
                {selectedMaterial} <X className="w-3 h-3" />
              </button>
            )}
            <button onClick={clearFilters} className="text-xs underline text-ambrins_text/50 hover:text-ambrins_dark ml-2">
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
          
          {/* --- DESKTOP SIDEBAR --- */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <FilterContent />
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-ambrins_secondary animate-spin" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="mt-16 text-center">
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 9)}
                      className="inline-block border-b border-ambrins_dark pb-1 font-body text-xs font-bold uppercase tracking-[0.2em] text-ambrins_dark hover:text-ambrins_primary hover:border-ambrins_primary transition-colors"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center bg-white border border-ambrins_dark/5 rounded-sm">
                <Filter className="w-12 h-12 text-ambrins_dark/20 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-ambrins_dark mb-2">No fabrics found</h3>
                <p className="text-ambrins_text/60 text-sm mb-6">
                  Try adjusting your price range or filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-ambrins_dark text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ambrins_primary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </Container>

      {/* --- MOBILE FILTER DRAWER --- */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl text-ambrins_dark">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-6 h-6 text-ambrins_dark/50" />
                  </button>
                </div>
                
                <FilterContent />

                <div className="mt-8 pt-6 border-t border-ambrins_dark/10">
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-ambrins_dark text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-ambrins_primary"
                  >
                    View {filteredProducts.length} Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
};

export default ShopInterface;