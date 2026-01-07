"use client";

import React, { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import Image, { ImageLoaderProps } from "next/image";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { ChevronDown, Minus, Plus, ShieldCheck, Truck, Sparkles, Ruler } from "lucide-react";

// --- LOADERS ---
const thumbnailLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 65}&auto=format&fit=max`;
};

// --- SUB-COMPONENT: Custom Quantity Selector ---
const ModernQuantitySelector = ({ 
  quantity, 
  setQuantity, 
  stock, 
  isFabric 
}: { 
  quantity: number; 
  setQuantity: (q: number) => void; 
  stock: number;
  isFabric: boolean;
}) => {
  const increment = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };
  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-ambrins_secondary">
        {isFabric ? "Length (Meters)" : "Quantity"}
      </span>
      <div className="flex items-center w-max border border-ambrins_dark/20 rounded-sm overflow-hidden bg-white">
        <button 
          onClick={decrement}
          disabled={quantity <= 1}
          className="w-12 h-12 flex items-center justify-center hover:bg-ambrins_light disabled:opacity-30 transition-colors text-ambrins_dark"
        >
          <Minus size={16} />
        </button>
        <div className="w-16 h-12 flex items-center justify-center font-heading text-xl font-bold text-ambrins_dark border-x border-ambrins_dark/10">
          {quantity}
        </div>
        <button 
          onClick={increment}
          disabled={quantity >= stock}
          className="w-12 h-12 flex items-center justify-center hover:bg-ambrins_light disabled:opacity-30 transition-colors text-ambrins_dark"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // --- LOGIC: Variant & Stock Handling ---
  
  const rawVariant = product.variants?.[selectedVariantIndex];
  
  const calculateStock = (variant: any) => {
    return typeof variant?.availableStock === 'number' 
      ? variant.availableStock 
      : (variant?.openingStock ?? 0) - (variant?.stockOut ?? 0);
  };

  const currentStock = rawVariant ? calculateStock(rawVariant) : 0;
  
  const selectedVariant = {
    _key: rawVariant?._key,
    name: rawVariant?.variantName ?? rawVariant?.colorName ?? `Option ${selectedVariantIndex + 1}`,
    availableStock: currentStock,
    images: rawVariant?.images ?? [],
  };

  // If variant has no images, fallback to main product images
  const displayImages = selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : product.images ?? [];

  const handleBuyNow = async () => {
    if (buying) return;
    if (currentStock < quantity) {
      toast.error("Not enough stock available.");
      return;
    }
    setBuying(true);
    try {
      addItem(product, selectedVariant, quantity);
      router.push("/checkout");
    } finally {
      setBuying(false);
    }
  };

  const isFabric = product.category?.name?.toLowerCase().includes("fabric");

  return (
    <>
      {buying && <Loading />}
      
      <div className="bg-ambrins_light min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-[1600px] py-12">
          
          {/* --- BREADCRUMBS --- */}
          <nav className="text-[10px] uppercase tracking-[0.2em] font-bold text-ambrins_text/60 mb-8 flex flex-wrap gap-2">
            <Link href="/" className="hover:text-ambrins_primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-ambrins_primary transition-colors">Shop</Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-ambrins_secondary">{product.category.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            
            {/* --- LEFT: STICKY IMAGE GALLERY --- */}
            <div className="w-full lg:w-3/5 lg:sticky lg:top-24 h-fit">
               {/* Pass props to your existing ImageView or use a new one */}
               {/* Ensuring generic fallback if ImageView is strict about types */}
               <ImageView images={displayImages} isStock={currentStock} />
            </div>

            {/* --- RIGHT: DETAILS & ACTIONS --- */}
            <div className="w-full lg:w-2/5 flex flex-col gap-8">
              
              {/* HEADER */}
              <div className="border-b border-ambrins_dark/10 pb-6">
                <h1 className="font-heading text-4xl md:text-5xl text-ambrins_dark leading-tight mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center justify-between">
                   <PriceView
                    price={product.price}
                    discount={product.discount}
                    className="text-3xl font-body font-medium text-ambrins_primary"
                    unitLabel={isFabric ? "/ meter" : undefined}
                  />
                  
                  {/* Stock Badge */}
                  <div className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${
                    currentStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {currentStock > 0 ? (currentStock < 10 ? `Low Stock: Only ${currentStock} Left` : "In Stock") : "Sold Out"}
                  </div>
                </div>
              </div>

              {/* PURCHASE CARD (The "Control Panel") */}
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl shadow-ambrins_secondary/5 border-t-4 border-ambrins_primary relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Sparkles className="text-ambrins_secondary w-20 h-20" />
                </div>

                {/* 1. VARIANTS */}
                {product.variants?.length > 1 && (
                  <div className="mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-ambrins_secondary block mb-3">
                      Select Variant: <span className="text-ambrins_dark">{selectedVariant.name}</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((v: any, idx: number) => {
                         const preview = v.images?.[0];
                         const isActive = idx === selectedVariantIndex;
                         
                         return (
                           <button
                             key={v._key ?? idx}
                             onClick={() => setSelectedVariantIndex(idx)}
                             className={`relative w-14 h-14 rounded-sm overflow-hidden transition-all duration-300 ${
                               isActive 
                                 ? "ring-2 ring-offset-2 ring-ambrins_primary scale-110 shadow-lg" 
                                 : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-ambrins_dark/20"
                             }`}
                           >
                              {preview && (
                                <Image
                                  loader={thumbnailLoader}
                                  src={urlFor(preview).url()}
                                  alt={v.variantName || "Variant"}
                                  fill
                                  className="object-cover"
                                />
                              )}
                           </button>
                         )
                      })}
                    </div>
                  </div>
                )}

                {/* 2. QUANTITY & ADD TO CART */}
                <div className="flex flex-col gap-6">
                   <ModernQuantitySelector 
                      quantity={quantity} 
                      setQuantity={setQuantity} 
                      stock={currentStock}
                      isFabric={!!isFabric}
                   />

                   <div className="flex flex-col sm:flex-row gap-4">
                      <AddToCartButton
                        product={product}
                        variant={selectedVariant}
                        selectedQuantity={quantity}
                        className="flex-1 bg-ambrins_dark text-white font-body text-sm font-bold uppercase tracking-[0.2em] py-4 hover:bg-ambrins_primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        disabled={currentStock < quantity || quantity <= 0}
                      />
                      
                      <button
                        onClick={handleBuyNow}
                        disabled={buying || currentStock < quantity || quantity <= 0}
                        className="flex-1 border border-ambrins_dark text-ambrins_dark font-body text-sm font-bold uppercase tracking-[0.2em] py-4 hover:bg-ambrins_dark hover:text-white transition-colors disabled:opacity-50"
                      >
                        {buying ? "Processing..." : "Buy Now"}
                      </button>
                   </div>
                </div>
              </div>

              {/* ACCORDION INFO (Description, Shipping, etc.) */}
              <div className="border-t border-ambrins_dark/10">
                
                {/* Item 1: Description */}
                <div className="border-b border-ambrins_dark/10">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === "description" ? null : "description")}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-heading text-xl text-ambrins_dark group-hover:text-ambrins_primary transition-colors">Description & Details</span>
                    <ChevronDown className={`w-5 h-5 text-ambrins_secondary transition-transform duration-300 ${expandedSection === "description" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "description" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-ambrins_text/80 text-sm leading-relaxed space-y-4">
                           {/* Quick Specs Grid */}
                           <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-sm border border-ambrins_dark/5 mb-4">
                              {product.material && (
                                <div><span className="block text-[10px] uppercase text-ambrins_secondary font-bold">Material</span> {product.material}</div>
                              )}
                              {product.width && (
                                <div><span className="block text-[10px] uppercase text-ambrins_secondary font-bold">Width</span> {product.width}</div>
                              )}
                           </div>
                           
                           {/* Rich Text */}
                           {product.description ? (
                              <div className="prose prose-sm prose-headings:font-heading prose-a:text-ambrins_primary">
                                <PortableText value={product.description} />
                              </div>
                           ) : (
                             <p>Experience the luxury of {product.name}. Perfect for your next creation.</p>
                           )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Item 2: Shipping & Care */}
                <div className="border-b border-ambrins_dark/10">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-heading text-xl text-ambrins_dark group-hover:text-ambrins_primary transition-colors">Shipping & Care</span>
                    <ChevronDown className={`w-5 h-5 text-ambrins_secondary transition-transform duration-300 ${expandedSection === "shipping" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "shipping" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-ambrins_text/80 text-sm leading-relaxed space-y-4">
                           <div className="flex items-start gap-3">
                              <Truck className="w-5 h-5 text-ambrins_primary mt-1" />
                              <div>
                                <h4 className="font-bold text-ambrins_dark">Fast Delivery</h4>
                                <p>Island-wide delivery within 3-5 working days. Next day delivery available for Colombo.</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-3">
                              <ShieldCheck className="w-5 h-5 text-ambrins_primary mt-1" />
                              <div>
                                <h4 className="font-bold text-ambrins_dark">Quality Guarantee</h4>
                                <p>We inspect every inch before cutting. Returns accepted for defects only on cut fabrics.</p>
                              </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-ambrins_dark/5">
                             <Link href="/care-guide" className="text-xs font-bold uppercase tracking-widest text-ambrins_secondary hover:text-ambrins_dark flex items-center gap-2">
                               <Ruler className="w-4 h-4" /> View Full Care Guide
                             </Link>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
              
            </div>
          </div>

          {/* --- BOTTOM: RELATED PRODUCTS --- */}
          <div className="mt-24 pt-12 border-t border-ambrins_dark/10">
             <RelatedProductsSection currentProduct={product} />
          </div>

        </div>
      </div>
    </>
  );
}