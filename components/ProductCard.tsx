// src/components/ProductCard.tsx
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";
import { TagIcon } from "@heroicons/react/24/outline";

// --- ✨ OPTIMIZATION: Import next/image ---
import Image from "next/image";

// ✅ Background texture
import cardBg from "../public/texture.png";

type ProductWithVariants = ALL_PRODUCTS_QUERYResult[number];

const ProductCard = ({
  product,
  priority = false, // --- ✨ OPTIMIZATION: Add priority prop ---
}: {
  product: ProductWithVariants;
  priority?: boolean; // Pass in `true` for above-the-fold items
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

  return (
    <div
      className="group relative overflow-hidden text-sm shadow-[2px_4px_8px_rgba(0,0,0,0.08),-2px_3px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12),0_6px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- ✨ OPTIMIZATION: Optimized background texture --- */}
      <Image
        src={cardBg}
        alt="texture background"
        fill
        sizes="100vw" // Covers the container
        className="object-cover object-center z-0"
        style={{ backgroundBlendMode: "multiply" }}
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
        <div className="relative w-full border-2 border-tech_gold overflow-hidden rounded-lg flex items-center justify-center bg-tech_white z-10">
          <Link href={`/product/${product?.slug?.current || ""}`}>
            {primaryImage ? (
              // If primaryImage exists, render it
              <>
                {/* --- ✨ OPTIMIZATION: Use next/image --- */}
                <Image
                  src={image(primaryImage).width(620).height(750).quality(85).url()}
                  alt={product?.name || "productImage"}
                  width={620}
                  height={750}
                  // --- This is the most important prop for optimization ---
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={priority} // Load LCP images first
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    hovered && secondaryImage ? "opacity-0" : "opacity-100"
                  }`}
                />
                {secondaryImage && (
                  <Image
                    src={image(secondaryImage).width(620).height(750).quality(85).url()}
                    alt={product?.name || "productImage"}
                    width={620}
                    height={750}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </>
            ) : (
              // If no primaryImage, render a placeholder
              // --- ✨ OPTIMIZATION: Added aspect-ratio to prevent layout shift ---
              <div className="w-full h-full bg-gray-100 flex items-center justify-center aspect-[620/750]">
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

          {/* Category/Subcategory Badges */}
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

          {/* Price / Shop Now container */}
          {/* --- ✨ LAYOUT FIX: Changed h-6 to h-10 (40px) to fit button --- */}
          <div className="mt-2 relative w-full h-10 flex items-center justify-center">
            {!hovered && totalStock > 0 && (
              <PriceView
                price={product?.price}
                // --- ✨ BUG FIX: Pass the discount prop ---
                discount={product.discount}
                className="text-sm sm:text-lg"
                unitLabel={
                  product?.category?.name?.toLowerCase() === "fabrics"
                    ? "/meter"
                    : undefined
                }
              />
            )}

            {hovered && totalStock > 0 && (
              <Link
                href={`/product/${product?.slug?.current || ""}`}
                // --- ✨ LAYOUT FIX: Changed py-4 to py-2 to fit in h-10 ---
                className="absolute inset-0 bg-tech_primary text-white px-4 py-2 rounded flex items-center justify-center font-semibold transition-opacity duration-300"
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