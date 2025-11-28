// src/components/ProductCard.tsx
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";
import { TagIcon } from "@heroicons/react/24/outline";
import Image, { ImageLoaderProps } from "next/image";
import cardBg from "../public/texture.png";

type ProductWithVariants = ALL_PRODUCTS_QUERYResult[number];

// --- 1. SANITY IMAGE LOADER ---
// This prevents "Double Optimization" (Next.js server processing Sanity images).
// It offloads bandwidth to Sanity's CDN and ensures the exact size requested
// by the browser is what Sanity delivers.
const sanityLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // If the src is already a full URL, we append params
  // If you store raw image references, you might adjust this logic.
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  
  // Sanity API specific parameters:
  // auto=format: Serves AVIF/WebP automatically
  // fit=max: Resizes while maintaining aspect ratio
  return `${src}${separator}w=${width}&q=${quality || 80}&auto=format&fit=max`;
};

const ProductCard = ({
  product,
  priority = false,
}: {
  product: ProductWithVariants;
  priority?: boolean;
}) => {
  const variantImages =
    product?.variants
      ?.map((v) => v?.images?.[0])
      .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [];

  const totalStock =
    product?.variants?.reduce((acc, v) => {
      if (!v) return acc;
      const stock =
        typeof v.availableStock === "number"
          ? v.availableStock
          : (v.openingStock || 0) - (v.stockOut || 0);
      return acc + Math.max(stock, 0);
    }, 0) || 0;

  const [hovered, setHovered] = useState(false);

  const primaryImage = variantImages[0];
  const secondaryImage = variantImages[1];

  // Base URL construction without hardcoded sizes
  // We let the 'loader' and 'sizes' prop handle the pixel density
  const primaryImageUrl = primaryImage ? image(primaryImage).url() : null;
  const secondaryImageUrl = secondaryImage ? image(secondaryImage).url() : null;

  return (
    <div
      className="group relative overflow-hidden text-sm shadow-[2px_4px_8px_rgba(0,0,0,0.08),-2px_3px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12),0_6px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- BACKGROUND TEXTURE OPTIMIZATION --- */}
      {/* Reduced quality to 50 (textures don't need sharp edges) */}
      <Image
        src={cardBg}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 400px" // Provide accurate size estimate
        quality={50}
        placeholder="blur" // Only works for static imports
        className="object-cover object-center z-0"
        style={{ backgroundBlendMode: "multiply" }}
        aria-hidden="true" // Accessibility: Hide purely decorative images
      />

      <div className="relative z-10 py-2 sm:py-4 px-2 sm:px-4 flex flex-col min-h-[375px] sm:min-h-[400px]">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-tech_gold text-white text-xs font-bold px-2 py-0.5 rounded z-20">
            -{product.discount}%
          </div>
        )}

        {/* Stock Overlay */}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold text-lg z-30">
            OUT OF STOCK
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full border-2 border-tech_gold overflow-hidden rounded-lg flex items-center justify-center bg-tech_white z-10 aspect-[620/750]">
          <Link href={`/product/${product?.slug?.current || ""}`} className="w-full h-full relative">
            {primaryImageUrl ? (
              <>
                <Image
                  loader={sanityLoader} // Bypass Next.js server, go straight to Sanity CDN
                  src={primaryImageUrl}
                  alt={product?.name || "Product Image"}
                  fill // Use fill + aspect-ratio parent instead of hardcoded width/height
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                  priority={priority}
                  className="object-cover transition-opacity duration-500"
                />
                
                {/* --- BANDWIDTH OPTIMIZATION: CONDITIONAL RENDERING --- */}
                {/* Only render the <img> tag if the user is hovering. 
                    This prevents downloading the second image for every product on page load. */}
                {hovered && secondaryImageUrl && (
                  <Image
                    loader={sanityLoader}
                    src={secondaryImageUrl}
                    alt="" // Decorative on hover
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                    className="absolute top-0 left-0 w-full h-full object-cover animate-fadeIn"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <TagIcon className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col items-center gap-2 flex-1 text-center relative">
          <Title className="text-xl sm:text-xl font-cormorant line-clamp-2">
            {product?.name}
          </Title>

          <div className="flex gap-1 justify-center mt-1 flex-wrap">
            {product.category && (
              <span className="bg-tech_primary text-white text-xs px-2 py-0.5 rounded">
                {product.category.name}
              </span>
            )}
            {product.subcategory && (
              <span className="bg-tech_gold text-white text-xs px-2 py-0.5 rounded">
                {product.subcategory.name}
              </span>
            )}
          </div>

          <div className="mt-2 relative w-full h-10 flex items-center justify-center">
            {/* Logic: If out of stock, show price (faded?) or keep layout stable. 
                Using absolute positioning here to prevent layout jumps on hover */}
            
            <div className={`transition-opacity duration-300 ${hovered && totalStock > 0 ? 'opacity-0' : 'opacity-100'}`}>
                <PriceView
                  price={product?.price}
                  discount={product.discount}
                  className="text-sm sm:text-lg"
                  unitLabel={
                    product?.category?.name?.toLowerCase() === "fabrics"
                      ? "/meter"
                      : undefined
                  }
                />
            </div>

            {hovered && totalStock > 0 && (
              <Link
                href={`/product/${product?.slug?.current || ""}`}
                className="absolute inset-0 bg-tech_primary text-white px-4 py-2 rounded flex items-center justify-center font-semibold animate-fadeIn"
              >
                SHOP NOW
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;