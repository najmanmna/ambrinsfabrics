"use client";

import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";
import { TagIcon } from "@heroicons/react/24/outline";
import Image, { ImageLoaderProps } from "next/image";

const sanityLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&h=${Math.floor(width * 1.33)}&q=${quality || 80}&fit=crop`;
};

type ProductWithVariants = ALL_PRODUCTS_QUERYResult[number];

const ProductCard = ({
  product,
  priority = false,
}: {
  product: ProductWithVariants;
  priority?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // --- DEBUGGING: Check if slug exists ---
  const slug = product?.slug?.current;
  if (!slug) {
    console.warn("Product missing slug:", product?.name);
  }

  // 1. Extract Images
  const variantImages =
    product?.variants
      ?.map((v) => v?.images?.[0])
      .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [];

  const primaryImage = variantImages[0];
  const secondaryImage = variantImages[1];

  const primaryImageUrl = primaryImage ? image(primaryImage).url() : null;
  const secondaryImageUrl = secondaryImage ? image(secondaryImage).url() : null;

  // 2. Calculate Stock
  const totalStock =
    product?.variants?.reduce((acc, v) => {
      if (!v) return acc;
      const stock =
        typeof v.availableStock === "number"
          ? v.availableStock
          : (v.openingStock || 0) - (v.stockOut || 0);
      return acc + Math.max(stock, 0);
    }, 0) || 0;

  const isOutOfStock = totalStock === 0;

  return (
    <div
      className="group relative flex flex-col bg-white transition-all duration-300 border border-transparent hover:border-ambrins_secondary/30 hover:shadow-xl hover:shadow-ambrins_secondary/5 rounded-sm overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative z-10 flex flex-col h-full">
        
        {/* --- DISCOUNT BADGE (Rani Pink) --- */}
        {product.discount && product.discount > 0 && !isOutOfStock && (
          <div className="absolute top-2 left-2 bg-ambrins_primary text-white text-[10px] font-body font-bold uppercase tracking-widest px-2 py-1 z-30 rounded-sm shadow-sm">
            -{product.discount}%
          </div>
        )}

        {/* --- IMAGE CONTAINER --- */}
        {/* FIX: Only render Link if slug exists to prevent loading errors */}
        {slug ? (
          <Link
            href={`/product/${slug}`}
            className="relative w-full aspect-[3/4] overflow-hidden bg-ambrins_light block"
          >
            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-30 transition-opacity duration-500 group-hover:bg-white/80">
                <span className="text-ambrins_dark font-body text-xs font-bold tracking-[0.25em] uppercase border-b border-ambrins_dark pb-1">
                  Sold Out
                </span>
              </div>
            )}

            {primaryImageUrl ? (
              <>
                {/* Primary Image */}
                <Image
                  loader={sanityLoader}
                  src={primaryImageUrl}
                  alt={product?.name || "Ambrins Fabric"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={priority}
                  onLoad={() => setIsImageLoading(false)}
                  className={`object-cover object-center transition-all duration-700 ease-in-out ${
                    isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  }`}
                />

                {/* Secondary Hover Image */}
                {secondaryImageUrl && (
                  <Image
                    loader={sanityLoader}
                    src={secondaryImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover object-center absolute inset-0 z-10 transition-opacity duration-700 ease-in-out ${
                      hovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </>
            ) : (
              // Fallback for no image
              <div className="w-full h-full flex items-center justify-center text-ambrins_secondary/30">
                <TagIcon className="w-10 h-10" strokeWidth={1} />
              </div>
            )}
          </Link>
        ) : (
            // Fallback if NO SLUG (Prevents broken links)
            <div className="relative w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-xs text-red-500 font-bold">
                Error: No Slug
            </div>
        )}

        {/* --- DETAILS SECTION --- */}
        <div className="pt-4 pb-4 px-3 flex flex-col items-center text-center gap-1 flex-grow">
          
          {/* Category Label (Marigold) */}
          <span className="text-[10px] font-bold text-ambrins_secondary uppercase tracking-widest">
             {product?.category?.name || "Textile"}
          </span>

          {/* Title */}
          {slug ? (
                  <Link href={`/`}>
            {/* // <Link href={`/product/${slug}`}> */}
                <Title className="font-heading text-lg text-ambrins_dark leading-tight line-clamp-2 group-hover:text-ambrins_primary transition-colors duration-300">
                {product?.name}
                </Title>
            </Link>
          ) : (
            <Title className="font-heading text-lg text-gray-400 leading-tight line-clamp-2">
                {product?.name}
            </Title>
          )}


          {/* Price / Action Slider Area */}
          <div className="relative h-9 w-full overflow-hidden mt-2">
            
            {/* 1. Price View (Default State) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out transform ${
                hovered && !isOutOfStock
                  ? "-translate-y-full opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <PriceView
                price={product?.price}
                discount={product.discount}
                className="text-base font-body font-medium text-ambrins_dark"
                // FIX: Force "/ meter" as requested
                unitLabel="/ meter"
              />
            </div>

            {/* 2. Shop Button (Hover State - Rani Pink) */}
            {!isOutOfStock && slug && (
              <Link
                // href={`/product/${slug}`}
                href={`/`}
                className={`absolute inset-0 flex items-center justify-center bg-ambrins_primary text-white font-body text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm transition-all duration-500 ease-in-out transform hover:bg-ambrins_dark ${
                  hovered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;