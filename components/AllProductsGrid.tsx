"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { Loader2, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

const AllProductsGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

  // --- QUERY: Fetches all products sorted by name ---
  const query = `*[_type == "product"] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
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
        console.error("Error fetching all products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[40vh] bg-ambrins_light w-full mt-10 rounded-sm">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-ambrins_secondary/20 rounded-full blur-xl animate-pulse" />
             <Loader2 className="w-8 h-8 text-ambrins_primary animate-spin relative z-10" />
          </div>
          <span className="font-body text-xs font-bold uppercase tracking-widest text-ambrins_dark">
            Loading Collection...
          </span>
        </motion.div>
      </div>
    );
  }

  // --- 2. EMPTY STATE ---
  if (!loading && products.length === 0) {
    return (
        <div className="mt-12">
            <NoProductAvailable selectedTab="All Products" />
        </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-ambrins_dark/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
        
        {/* --- 3. SECTION HEADER --- */}
        <div className="flex flex-col items-center text-center mb-12">
           <div className="flex items-center gap-2 mb-3">
             <Sparkles className="w-4 h-4 text-ambrins_secondary" />
             <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
               — The Full Collection
             </span>
           </div>
           <h2 className="font-heading text-3xl md:text-5xl text-ambrins_dark mb-4">
             All Products
           </h2>
           <p className="font-body text-ambrins_text/70 text-sm max-w-lg">
             Browse our complete catalogue of premium textiles, from heritage silks to everyday cottons.
           </p>
        </div>

        {/* --- 4. PRODUCT GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {products.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProductsGrid;