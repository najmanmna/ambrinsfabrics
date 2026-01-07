import React from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { Sparkles } from "lucide-react";
import PatternBackground from "./ui/PatternBackground";

// --- FETCH CATEGORIES (Increased to 20) ---
async function getCategories() {
  const query = `
    *[_type == "category"] | order(name asc)[0...20] {
      _id,
      name,
      slug,
      "imageUrl": image.asset->url
    }
  `;
  return await client.fetch(query);
}

// --- SVG: Background Decor (Static) ---
const BackgroundMandala = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
     <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-75c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 60c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" opacity="0.03"/>
  </svg>
);

const ShopByCategory = async () => {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative w-full py-20  overflow-hidden">
      {/* <PatternBackground /> */}
      
      {/* --- Background Decor --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] text-ambrins_secondary pointer-events-none z-0 opacity-20">
        <BackgroundMandala className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1920px] relative z-10">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-12">
           <div className="flex items-center justify-center gap-2 mb-3">
             <Sparkles className="w-4 h-4 text-ambrins_secondary" />
             <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
               — The Material Library
             </span>
           </div>
          <h2 className="font-heading text-4xl md:text-5xl text-ambrins_dark">
            Shop by Material
          </h2>
          <p className="mt-4 font-body text-ambrins_text/70 text-sm max-w-lg mx-auto">
            Explore our extensive range of 20+ fabric types. From everyday cottons to ceremonial silks, we stock it all.
          </p>
        </div>

        {/* --- Categories Grid (High Density) --- */}
        {/* Grid Logic:
            - Mobile: 3 columns (Small, dense icons to show variety quickly)
            - Tablet: 4 columns
            - Desktop: 6 columns (Spreads them out elegantly)
        */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-4 md:gap-x-8 justify-center">
          {categories.map((cat: any) => (
            <Link 
              key={cat._id} 
              href={`/shop?category=${cat.slug.current}`}
              className="group flex flex-col items-center text-center gap-3"
            >
              {/* Circular Image Container (Clean & Simple) */}
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                
                {/* 1. Static Border Ring (Replaces Spinning Border) */}
                <div className="absolute inset-0 rounded-full border border-ambrins_dark/10 group-hover:border-ambrins_primary/50 transition-colors duration-300" />
                
                {/* 2. White Gap */}
                <div className="absolute inset-[4px] rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300" />

                {/* 3. The Image */}
                <div className="absolute inset-[8px] rounded-full overflow-hidden bg-ambrins_neutral">
                   {cat.imageUrl ? (
                     <Image 
                       src={cat.imageUrl} 
                       alt={cat.name} 
                       fill 
                       className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-ambrins_muted text-[9px]">
                       No Img
                     </div>
                   )}
                   
                   {/* Hover Tint */}
                   <div className="absolute inset-0 bg-ambrins_dark/0 group-hover:bg-ambrins_dark/10 transition-colors duration-300" />
                </div>
              </div>

              {/* Category Name */}
              <div>
                <h3 className="font-heading text-base md:text-lg font-bold text-ambrins_dark group-hover:text-ambrins_primary transition-colors duration-300 leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
        {/* "View Full Catalogue" Link at bottom if they want more */}
        <div className="text-center mt-12">
            <Link 
                href="/shop" 
                className="inline-block border-b border-ambrins_secondary text-ambrins_secondary text-xs font-bold uppercase tracking-widest hover:text-ambrins_dark hover:border-ambrins_dark transition-colors"
            >
                View Full Catalogue
            </Link>
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;