import React from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

// --- FETCH DATA (Top 30 Items) ---
async function getFeaturedProducts() {
  const query = `
    *[_type == "product" && isFeatured == true] | order(_createdAt desc)[0...30] {
      _id,
      name,
      slug,
      price,
      discount,
      category->{name},
      subcategory->{name},
      variants[]{
        availableStock,
        openingStock,
        // Fetch raw images array so the sanity-image-url builder works in ProductCard
        images[] 
      }
    }
  `;
  return await client.fetch(query);
}

const FeaturedFabrics = async () => {
  const products: ALL_PRODUCTS_QUERYResult = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24  border-b border-ambrins_dark/5">
      <div className="container mx-auto max-w-[1920px]"> {/* Wide container for maximum visibility */}
        
        {/* --- 1. Vibrant Header --- */}
        <div className="px-4 md:px-12 mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-ambrins_secondary animate-pulse" />
               <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
                 — Fresh off the Loom
               </span>
            </div>
            
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-ambrins_dark leading-[0.9] tracking-tight mb-4">
              Choose from <span className="text-ambrins_primary italic">100+ Fabric Designs</span>
            </h2>
            
            <p className="font-body text-ambrins_text/70 text-sm md:text-base leading-relaxed max-w-xl">
              Dive into our extensive library of prints, weaves, and textures. From heritage hand-blocks to contemporary silks, find the perfect match for your next creation.
            </p>
          </div>

          {/* Desktop "View All" Link */}
          <Link 
            href="/shop" 
            className="group hidden md:flex items-center gap-2 font-body text-sm font-bold uppercase tracking-[0.15em] text-ambrins_dark hover:text-ambrins_primary transition-colors"
          >
            <span className="border-b-2 border-ambrins_dark/20 group-hover:border-ambrins_primary pb-1 transition-colors">
                Explore Full Catalogue
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-ambrins_primary" />
          </Link>
        </div>

        {/* --- 2. Horizontal Discovery Rail (The "30 Items" Showcase) --- */}
        <div className="relative w-full">
            {/* SCROLL CONTAINER:
                - overflow-x-auto: Enables horizontal scrolling
                - snap-x: Makes items snap into place cleanly
                - scrollbar-hide: Hides the ugly browser scrollbar (ensure utility exists in globals.css)
            */}
            <div className="flex overflow-x-auto gap-4 md:gap-6 px-4 md:px-12 pb-12 snap-x snap-mandatory scrollbar-hide">
                {products.map((product) => (
                    // Fixed Width Card ensures they line up perfectly
                    <div 
                        key={product._id} 
                        className="min-w-[260px] md:min-w-[300px] snap-start"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}

                {/* "See More" Card at the end of the scroll */}
                <div className="min-w-[260px] md:min-w-[300px] snap-start flex items-center justify-center">
                    <Link 
                        href="/shop" 
                        className="group flex flex-col items-center justify-center w-full aspect-[3/4] bg-white border-2 border-dashed border-ambrins_dark/20 rounded-lg hover:border-ambrins_primary hover:bg-ambrins_primary/5 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-full bg-ambrins_light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <ArrowRight className="w-6 h-6 text-ambrins_primary" />
                        </div>
                        <span className="font-heading text-xl text-ambrins_dark group-hover:text-ambrins_primary">
                            View All Designs
                        </span>
                        <span className="font-body text-xs text-ambrins_muted mt-1">
                            +70 more styles
                        </span>
                    </Link>
                </div>
            </div>
            
            {/* Visual fade on the right edge to indicate scrolling */}
            <div className="absolute right-0 top-0 bottom-12 w-24 bg-gradient-to-l from-ambrins_light to-transparent pointer-events-none md:block hidden" />
        </div>

        {/* --- 3. Mobile 'View All' Button (Bottom) --- */}
        <div className="text-center md:hidden px-4">
            <Link 
                href="/shop" 
                className="w-full inline-block bg-ambrins_dark text-white px-8 py-4 rounded-md font-body text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-ambrins_primary transition-colors duration-300"
            >
                Browse All Fabrics
            </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedFabrics;