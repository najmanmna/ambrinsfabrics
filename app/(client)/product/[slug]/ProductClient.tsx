"use client";
import React, { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import Container from "@/components/Container";
import Image, { ImageLoaderProps } from "next/image"; // --- ✨ OPTIMIZATION: Added ImageLoaderProps
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import { PortableText } from "@portabletext/react";
import LocalQuantitySelector from "@/components/LocalQuantitySelector";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProductsSection from "@/components/RelatedProductsSection";

// --- ✨ OPTIMIZATION: Sanity Image Loader ---
// Directs image requests to Sanity CDN, saving Netlify bandwidth.
const sanityLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 80}&auto=format&fit=max`;
};

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    shipping: false,
  });
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const rawVariant = product.variants[selectedVariantIndex];
  const selectedVariant = {
    _key: rawVariant._key,
    name:
      rawVariant.variantName ??
      rawVariant.colorName ??
      rawVariant.color ??
      `Option ${selectedVariantIndex + 1}`,
    availableStock: rawVariant.availableStock ?? 0,
    images: rawVariant.images ?? [],
  };

  const [availableStock, setAvailableStock] = useState(
    selectedVariant.availableStock
  );
  useEffect(() => {
    setAvailableStock(rawVariant.availableStock ?? 0);
  }, [rawVariant.availableStock, selectedVariantIndex]);

  const images =
    selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images ?? [];
  const itemKey = `${product._id}-${selectedVariant._key}`;

  const handleBuyNow = async () => {
    if (buying) return;
    if (availableStock < quantity) {
      toast.error("Not enough stock available for the selected quantity.");
      return;
    }
    if (quantity <= 0) {
      toast.error("Please select a valid quantity.");
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

  useEffect(() => {
    const info = {
      name: product?.name ?? null,
      slug: product?.slug?.current ?? null,
    };
    (window as any).__PRODUCT_INFO = info;
    window.dispatchEvent(new Event("productInfo"));
    return () => {
      delete (window as any).__PRODUCT_INFO;
      window.dispatchEvent(new Event("productInfo"));
    };
  }, [product]);

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const accordionHeaderStyle =
    "w-full text-left px-4 py-3 font-semibold text-lg text-[#2C3E50] font-playfair flex justify-between items-center border-b border-gray-200";
  const accordionContentStyle =
    "px-4 py-4 text-gray-700 text-sm space-y-3 leading-relaxed border-b border-gray-200";

  return (
    <>
      {buying && <Loading />}
      <Container className="py-16 sm:py-24">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          {/* Product Images */}
          {/* Note: ImageView likely contains <Image> tags as well. 
              Ensure ImageView also implements the sanityLoader for maximum optimization. */}
          {images.length > 0 && (
            <ImageView images={images} isStock={availableStock} />
          )}

          {/* Info Section */}
          <div className="w-full md:w-3/5 flex flex-col gap-5">
            <div className="space-y-3">
              <p
                className={`inline-block text-xs py-1 px-3 font-semibold rounded-full ${
                  availableStock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {availableStock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-[#2C3E50]">
                {product.name}
              </h1>

              {/* Category / Subcategory */}
              <div className="flex gap-2 text-xs pt-1 flex-wrap">
                {product.category && (
                  <span className="bg-[#A67B5B]/10 text-[#A67B5B] px-3 py-1 rounded-full font-medium">
                    {product.category.name}
                  </span>
                )}
                {product.subcategory && (
                  <span className="bg-[#A67B5B]/10 text-[#A67B5B] px-3 py-1 rounded-full font-medium">
                    {product.subcategory.name}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <PriceView
              price={product.price}
              discount={product.discount}
              className="text-2xl font-bold text-[#2C3E50]"
              unitLabel={
                product.category?.name?.toLowerCase() === "fabrics"
                  ? "/meter"
                  : undefined
              }
            />

            {/* Variant Selection (If applicable) */}
            {product.variants.length > 1 && (
              <div className="mt-2">
                <p className="text-base font-semibold text-gray-700 mb-2">
                  Select Color/Variant:
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any, idx: number) => {
                    const preview = v.images?.[0];
                    const variantName =
                      v.variantName ??
                      v.colorName ??
                      v.color ??
                      `Option ${idx + 1}`;
                    if (!preview) return null;
                    return (
                      <button
                        key={v._key ?? idx}
                        onClick={() => setSelectedVariantIndex(idx)}
                        title={variantName}
                        className={`w-16 h-20 border rounded-md overflow-hidden transition-all duration-200 ${
                          idx === selectedVariantIndex
                            ? "ring-2 ring-offset-2 ring-[#A67B5B]"
                            : "border-gray-300 hover:border-[#A67B5B]"
                        }`}
                      >
                        {/* --- ✨ OPTIMIZATION: Variant Thumbnails --- */}
                        <Image
                          loader={sanityLoader}
                          // Pass the base URL. Loader adds ?w=64/128 automatically
                          src={urlFor(preview).url()} 
                          alt={variantName}
                          width={64}  // Next.js will ask Sanity for 64px (1x)
                          height={80} // and ~128px (2x) automatically
                          className="object-cover w-full h-full"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-base font-semibold text-gray-700">
                {product.category?.name?.toLowerCase() === "fabrics"
                  ? "Quantity (in meters):"
                  : "Quantity:"}
              </p>
              <div className="flex items-center gap-4">
                <LocalQuantitySelector
                  stockAvailable={selectedVariant?.availableStock}
                  isFabric={
                    product.category?.name?.toLowerCase() === "fabrics"
                  }
                  onChange={(q) => setQuantity(q)}
                />
                <p className="text-sm text-gray-500">
                  {`Available: ${availableStock}${
                    product.category?.name?.toLowerCase() === "fabrics"
                      ? " m"
                      : ""
                  }`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-6">
              <AddToCartButton
                product={product}
                variant={selectedVariant}
                selectedQuantity={quantity}
                className="flex-1 bg-[#2C3E50] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#46627f] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={availableStock < quantity || quantity <= 0}
              />
              <button
                onClick={handleBuyNow}
                disabled={buying || availableStock < quantity || quantity <= 0}
                className={`flex-1 bg-[#A67B5B] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                  buying ? "bg-gray-400" : "hover:bg-[#8e6e52]"
                }`}
              >
                {buying ? "Processing..." : "Buy Now"}
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="mt-8 w-full border border-gray-200 rounded-lg">
              {/* Product Details - Always Open */}
              <div>
                <div className={accordionHeaderStyle}>
                  PRODUCT DETAILS
                </div>
                <div className={accordionContentStyle}>
                  {product.material && (
                    <p>
                      <span className="font-semibold">Material:</span>{" "}
                      {product.material}
                    </p>
                  )}
                  {product.width && (
                    <p>
                      <span className="font-semibold">Width:</span>{" "}
                      {product.width}
                    </p>
                  )}
                  {product.useCases && (
                    <p>
                      <span className="font-semibold">Use Cases:</span>{" "}
                      {product.useCases}
                    </p>
                  )}
                  {product.description && (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <span className="font-semibold block mb-1">
                        Description:
                      </span>
                      <PortableText value={product.description} />
                    </div>
                  )}
                  <p>
                    Please see{" "}
                    <Link
                      href="/care-guide"
                      className="text-[#A67B5B] underline hover:text-[#2C3E50]"
                    >
                      Care Guide
                    </Link>
                    .
                  </p>
                  {!product.material &&
                    !product.width &&
                    !product.useCases &&
                    !product.description && (
                      <p className="italic text-gray-500">
                        More details coming soon.
                      </p>
                    )}
                </div>
              </div>

              {/* Shipping & Returns - Toggleable */}
              <div>
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className={accordionHeaderStyle}
                >
                  SHIPPING & RETURNS
                  <motion.span
                    animate={{ rotate: accordionOpen["shipping"] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {accordionOpen["shipping"] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={accordionContentStyle}>
                        <p>
                          <span className="font-semibold">
                            Estimated Delivery:
                          </span>{" "}
                          3–5 working days within Sri Lanka.
                        </p>
                        <p>
                          <span className="font-semibold">
                            Shipping Costs:
                          </span>{" "}
                          Calculated at checkout based on your delivery address.
                        </p>
                        <p>
                          <span className="font-semibold">
                            Returns & Exchanges:
                          </span>{" "}
                          Fabrics cut to order are generally non-returnable
                          unless defective or incorrect. Other items (beddings,
                          clothing, accessories) may be exchanged within 7 days
                          if unused and in original condition.
                        </p>
                        <p>
                          Please see our full{" "}
                          <Link
                            href="/refund-policy"
                            className="text-[#A67B5B] underline hover:text-[#2C3E50]"
                          >
                            Exchange & Return Policy
                          </Link>{" "}
                          for details.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        {product && <RelatedProductsSection currentProduct={product} />}
      </Container>
    </>
  );
}