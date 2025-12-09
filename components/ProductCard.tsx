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

// --- SANITY IMAGE LOADER ---
const sanityLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
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

  // State for hover effect
  const [hovered, setHovered] = useState(false);
  // ✨ NEW: State for loading skeleton
  const [isImageLoading, setIsImageLoading] = useState(true);

  const primaryImage = variantImages[0];
  const secondaryImage = variantImages[1];

  const primaryImageUrl = primaryImage ? image(primaryImage).url() : null;
  const secondaryImageUrl = secondaryImage ? image(secondaryImage).url() : null;

  return (
    <div
      className="group relative overflow-hidden text-sm shadow-[2px_4px_8px_rgba(0,0,0,0.08),-2px_3px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12),0_6px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300 bg-tech_white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- BACKGROUND TEXTURE --- */}
      <Image
        src={cardBg}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 400px"
        quality={50}
        placeholder="blur"
        className="object-cover object-center z-0 pointer-events-none"
        style={{ backgroundBlendMode: "multiply" }}
        aria-hidden="true"
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
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold text-lg z-30 pointer-events-none">
            OUT OF STOCK
          </div>
        )}

        {/* Product Image Container */}
        {/* ✨ MODIFIED: Added conditional classes for skeleton loader */}
        <div 
          className={`relative w-full border-2 border-tech_gold overflow-hidden rounded-lg flex items-center justify-center z-10 aspect-[620/750] transition-colors duration-300
          ${isImageLoading ? 'bg-gray-200 animate-pulse' : 'bg-tech_white'}`}
        >
          <Link
            href={`/product/${product?.slug?.current || ""}`}
            className="w-full h-full relative"
          >
            {primaryImageUrl ? (
              <>
                {/* ✨ MODIFIED: Added onLoadingComplete and dynamic opacity */}
                <Image
                  loader={sanityLoader}
                  src={primaryImageUrl}
                  alt={product?.name || "Product Image"}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                  priority={priority}
                  // When loading is done, set state to false
                  onLoadingComplete={() => setIsImageLoading(false)}
                  // Start with opacity-0, fade to opacity-100 when loading finishes
                  className={`object-cover transition-opacity duration-500 ${
                     isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Secondary Hover Image (Kept as is) */}
                {hovered && secondaryImageUrl && (
                  <Image
                    loader={sanityLoader}
                    src={secondaryImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                    className="absolute top-0 left-0 w-full h-full object-cover animate-fadeIn z-20"
                  />
                )}
              </>
            ) : (
              // Fallback for missing image
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
            <div
              className={`transition-opacity duration-300 ${
                hovered && totalStock > 0 ? "opacity-0" : "opacity-100"
              }`}
            >
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