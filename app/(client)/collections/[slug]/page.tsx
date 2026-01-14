import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard"; // Assuming you have this
import { Sparkles } from "lucide-react";

// --- FETCH DATA ---
async function getCollectionData(slug: string) {
  // 1. Get Collection Details
  // 2. Get Products that reference this collection (using the 'collections' array in product schema)
  const query = `
    {
      "collection": *[_type == "collection" && slug.current == $slug][0] {
         title,
         description,
         "imageUrl": image.asset->url
      },
      "products": *[_type == "product" && $slug in collections[]->slug.current] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        discount,
        "images": images[].asset->url,
        "categoryName": category->name,
        variants
      }
    }
  `;
  return await client.fetch(query, { slug });
}

export default async function SingleCollectionPage({ params }: { params: { slug: string } }) {
  const { collection, products } = await getCollectionData(params.slug);

  if (!collection) return notFound();

  return (
    <div className=" min-h-screen">
      
      {/* --- HERO BANNER --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
         {/* Background Image */}
         {collection.imageUrl && (
            <Image 
              src={collection.imageUrl} 
              alt={collection.title} 
              fill 
              className="object-cover"
              priority
            />
         )}
         {/* Dark Overlay for Text Readability */}
         <div className="absolute inset-0 bg-ambrins_dark/40" />

         {/* Content */}
         <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
                   <Sparkles className="w-3 h-3 text-ambrins_secondary" />
                   <span className="font-body text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                     Exclusive Collection
                   </span>
                </div>
                <h1 className="font-heading text-5xl md:text-7xl text-white mb-6 drop-shadow-lg">
                  {collection.title}
                </h1>
                <p className="font-body text-white/90 text-lg md:text-xl leading-relaxed max-w-xl mx-auto drop-shadow-md">
                  {collection.description}
                </p>
            </div>
         </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <Container className="py-20">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-ambrins_dark/10">
           <p className="font-body text-ambrins_text/60 text-sm">
             Showing {products.length} Items
           </p>
           {/* You can add a Sort Dropdown here later */}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
             <h3 className="font-heading text-2xl text-ambrins_dark/40">
               Coming Soon
             </h3>
             <p className="text-ambrins_text/40 mt-2">
               We are currently curating products for this collection.
             </p>
          </div>
        )}
      </Container>

    </div>
  );
}