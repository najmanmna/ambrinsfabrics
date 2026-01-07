"use client";

import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { Input } from "../ui/input";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  color?: "black" | "white";
}

const SearchBar: React.FC<SearchBarProps> = ({ color = "black" }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Sanity Fetch Logic ---
  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      // Adjusted query to match name or description
      const query = `*[_type == "product" && (name match $search || description match $search)] | order(name asc)[0...5]`;
      const params = { search: `${search}*` };
      const response = await client.fetch(query, params);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        if (!search) setShowSearch(false); // Only collapse if empty
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [search]);

  // Auto-focus input when opened
  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  // Color Logic for Transparent Header
  const iconColor = color === "white" ? "text-white" : "text-ambrins_black";
  const iconHoverColor = color === "white" ? "hover:text-ambrins_gold" : "hover:text-ambrins_gold";

  return (
    <div ref={searchRef} className="relative z-50">
      
      {/* --- DESKTOP SEARCH TOGGLE --- */}
      <div className="hidden lg:flex items-center justify-end relative h-10">
        
        {/* The Toggle Button (Visible when closed) */}
        {!showSearch && (
          <motion.button
            type="button"
            onClick={() => {
              setShowSearch(true);
              setShowResults(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center p-2 transition-colors duration-300 ${iconColor} ${iconHoverColor}`}
          >
            <Search strokeWidth={1.5} size={20} />
          </motion.button>
        )}

        {/* The Expanding Input (Visible when open) */}
        <AnimatePresence>
          {showSearch && (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={(e) => e.preventDefault()}
              className="absolute right-0 top-0 bottom-0 flex items-center"
            >
              <div className="relative w-full">
                <Input
                  ref={inputRef}
                  placeholder="Search fabrics..."
                  className="w-full h-10 rounded-none border border-ambrins_gold/30 bg-white text-ambrins_black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-ambrins_gold pr-10 font-body text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowResults(true)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowResults(false);
                    setShowSearch(false);
                    setSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ambrins_black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* --- MOBILE SEARCH (Always visible in mobile menu context) --- */}
      <div className="block lg:hidden w-full">
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
            placeholder="Search..."
            className="w-full h-10 pl-10 rounded-none border border-gray-200 focus-visible:border-ambrins_gold focus-visible:ring-0 bg-white/50 text-ambrins_black font-body text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            />
            {search && (
                <button
                    onClick={() => {
                        setShowResults(false);
                        setSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            )}
        </div>
      </div>

      {/* --- RESULTS DROPDOWN (Luxury Style) --- */}
      <AnimatePresence>
        {showResults && (search || loading) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 w-[300px] lg:w-[350px] bg-white border border-ambrins_gold/20 shadow-xl z-50 overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center py-8 gap-3 text-ambrins_gold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-body text-sm tracking-wide">Curating results...</span>
              </div>
            ) : products?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {products.map((product) => (
                  <Link
                    key={product?._id}
                    href={`/product/${product?.slug?.current}`}
                    onClick={() => {
                      setShowResults(false);
                      setShowSearch(false);
                      setSearch("");
                    }}
                    className="flex items-start gap-4 p-4 hover:bg-ambrins_linen transition-colors group"
                  >
                    {/* Product Image (4:5 Ratio) */}
                    <div className="w-12 shrink-0 overflow-hidden bg-gray-100">
                      {product.variants?.[0]?.images?.[0]?.asset ? (
                        <Image
                          width={48}
                          height={60}
                          src={urlFor(product.variants[0].images[0].asset).url()}
                          alt={product.name ?? "fabric"}
                          className="object-cover w-full aspect-[4/5] group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            Img
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body text-sm font-medium text-ambrins_black truncate group-hover:text-ambrins_gold transition-colors">
                        {product.name}
                      </h3>
                 
                      {product.price && (
                        <p className="font-body text-xs font-semibold text-ambrins_gold mt-2">
                          LKR {product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                
                {/* View All Link */}
                <Link href="/shop" className="block p-3 text-center text-xs font-medium uppercase tracking-widest text-ambrins_black hover:text-ambrins_gold hover:bg-gray-50 transition-colors">
                    View All Results
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="font-body text-sm text-gray-500">
                  No fabrics found for "<span className="text-ambrins_black font-medium">{search}</span>"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;