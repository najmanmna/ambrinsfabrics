import React from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { Sparkles, ArrowRight } from "lucide-react";
import Container from "@/components/Container";

// --- FETCH ALL COLLECTIONS ---
async function getCollections() {
  const query = `
    *[_type == "collection"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      "imageUrl": image.asset->url
    }
  `;
  return await client.fetch(query);
}

export default async function CollectionsIndexPage() {
  const collections = await getCollections();

  return (
    <div className=" min-h-screen">
      <Container className="py-20 md:py-28">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Sparkles className="w-4 h-4 text-ambrins_secondary" />
             <span className="font-body text-xs font-bold tracking-[0.2em] text-ambrins_secondary uppercase">
               Curated Series
             </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl text-ambrins_dark mb-6">
            Our Collections
          </h1>
          <p className="font-body text-ambrins_text/70 text-sm md:text-base leading-relaxed">
            Explore our thoughtfully curated edits. Each collection is a narrative of texture, color, and heritage, designed to inspire your next masterpiece.
          </p>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((item: any, idx: number) => (
            <Link 
              key={item._id} 
              href={`/collections/${item.slug.current}`}
              className="group block relative"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-ambrins_dark/5">
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-ambrins_dark/20">No Image</div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-ambrins_dark/0 group-hover:bg-ambrins_dark/10 transition-colors duration-500" />
                
                {/* Floating Label (Bottom Left) */}
                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-ambrins_dark/80 to-transparent">
                   <h2 className="font-heading text-3xl text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                     {item.title}
                   </h2>
                   <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/80 text-sm mt-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2 text-ambrins_secondary text-xs font-bold uppercase tracking-widest mt-4">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </Container>
    </div>
  );
}