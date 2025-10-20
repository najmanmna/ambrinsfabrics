"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { motion, AnimatePresence } from "framer-motion";

import pinImg from "../public/pin.png";

const RELATED_PRODUCT_FIELDS = groq`
  _id,
  name,
  slug,
  description,
  price,
  discount,
  category->{
    _id,
    name,
    slug
  },
  subcategory->{
    _id,
    name,
    slug
  },
  variants[]{
    _key,
    variantName,
    openingStock,
    stockOut,
    "availableStock": openingStock - coalesce(stockOut, 0),
    images[]{ asset->{url} }
  },
  mainImage {
    asset->{
      _id,
      url,
      metadata {
        lqip
      }
    }
  }
`;

export const relatedProductsQuery = groq`
  *[_type == "product" && category->name == $categoryName && _id != $currentProductId][0...4] {
    ${RELATED_PRODUCT_FIELDS}
  }
`;

type ProductWithVariants = ALL_PRODUCTS_QUERYResult[number];

interface RelatedProductsProps {
  currentProduct: ProductWithVariants;
}

export default function RelatedProductsSection({ currentProduct }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductWithVariants[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Perform comprehensive null check first
    if (!currentProduct || !currentProduct._id || !currentProduct.category?.name) {
      setLoading(false);
      setRelatedProducts([]); // Indicate no related products if essential data is missing
      return;
    }

    // Extract non-nullable values after the check
    const categoryName = currentProduct.category.name;
    const currentProductId = currentProduct._id;

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await client.fetch<ProductWithVariants[]>(relatedProductsQuery, {
          categoryName: categoryName, // Now definitively a string
          currentProductId: currentProductId, // Now definitively a string
        });
        const filteredProducts = products.filter(p => p._id !== currentProductId);
        setRelatedProducts(filteredProducts);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
        setError("Failed to load related products.");
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct._id, currentProduct.category?.name, currentProduct]); // Dependency array: currentProduct.category?.name is important

  if (!loading && (!relatedProducts || relatedProducts.length === 0)) {
    return null;
  }

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-playfair font-bold text-[#2C3E50] mb-8 text-center md:text-left">You May Also Like</h2>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && relatedProducts && relatedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5 px-10">
          {relatedProducts.map((product, index) => {
            const rotation = index % 2 === 0 ? "-rotate-2" : "rotate-2";
            return (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative transition-transform duration-300 ${rotation} hover:rotate-0 hover:scale-105`}
                >
                  <img
                    src={pinImg.src}
                    alt="pin"
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-8 h-8 z-20"
                  />
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      )}
    </div>
  );
}