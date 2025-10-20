"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion"; // Corrected framer-motion import
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react"; // Keeping this if you still want a general loader for other parts
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import Link from "next/link";
import sectionBreak from "../public/sectionBreak.png";


// Import pin & background textures
import pinImg from "../public/pin.png";
import boardBg from "../public/texture.png";

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

  const query = `*[_type == "product" && isFeatured == true] | order(name asc)[0...10]{
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
    }
  }`;


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: ALL_PRODUCTS_QUERYResult = await client.fetch(query);
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Determine how many skeletons to show (e.g., up to the query limit)
  const numberOfSkeletons = 10; // Matches your query limit [0...10]

  return (
    <div className="relative my-15">
      <div className="absolute -top-6 w-full overflow-hidden">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>
      <div className="absolute -bottom-4 w-full overflow-hidden">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>
      <div
        className="flex flex-col lg:px-20 py-24 rounded-xl"
        style={{
          backgroundImage: `url(${boardBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Heading */}
        <div className="text-center mb-12 mx-10">
          <h2 className="text-3xl uppercase sm:text-4xl font-playfair font-semibold text-tech_primary">
            This Month’s Heritage Edit
          </h2>
          <p className="text-tech_gold mt-2 text-lg sm:text-xl">
            Handpicked For Everyday Elegance.
          </p>
        </div>

        {/* Conditional Rendering for Loading, Products, or NoProductAvailable */}
        {loading ? (
          // LOADING SKELETONS GO HERE
          <div className="grid grid-cols-1 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5">
            {[...Array(numberOfSkeletons)].map((_, i) => {
              const rotation = i % 2 === 0 ? "-rotate-2" : "rotate-2";
              return (
                <div key={i}
                  className={`relative transition-transform duration-300 ${rotation}`} // No hover effect on skeleton
                >
                  {/* Pin Image for skeleton */}
                  <img
                    src={pinImg.src}
                    alt="pin"
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-8 h-8 z-20"
                  />
                  {/* Skeleton Card Structure (similar to ProductCard) */}
                  <div className="shadow-[0_8px_20px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden bg-gray-50 p-4 animate-pulse min-h-[375px] sm:min-h-[400px] flex flex-col justify-between">
                    {/* Image placeholder */}
                    <div className="w-full h-56 bg-gray-200 rounded-md mb-4 border-2 border-gray-300"></div>
                    <div className="flex flex-col items-center gap-2">
                      {/* Title placeholder */}
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      {/* Category placeholders */}
                      <div className="flex gap-2 justify-center mt-2">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                      {/* Price/Button placeholder */}
                      <div className="h-6 bg-gray-200 rounded w-1/2 mt-4"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : products?.length ? (
          <>
            {/* Grid with pinned style */}
            <div className="grid grid-cols-1 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5">
              {products.map((product, index) => {
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
                      {/* Pin Image */}
                      <img
                        src={pinImg.src}
                        alt="pin"
                        className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-8 h-8 z-20"
                      />
                      {/* Card */}
                      {/* ProductCard already has its own shadow and background logic */}
                      <ProductCard product={product} />
                    </motion.div>
                  </AnimatePresence>
                );
              })}
            </div>

            {/* Button below the grid */}
            <div className="flex justify-center mt-15">
              <Link href="/shop">
                <button
                  className="
                    bg-tech_primary text-white px-6 py-3 font-semibold border border-tech_gold
                    transition-all duration-300 ease-in-out
                    hover:bg-tech_gold hover:text-primary
                    hover:scale-105
                  "
                >
                  VIEW COLLECTION
                </button>
              </Link>
            </div>
          </>
        ) : (
          <NoProductAvailable />
        )}
      </div>
    </div>
  );
};

export default ProductGrid;