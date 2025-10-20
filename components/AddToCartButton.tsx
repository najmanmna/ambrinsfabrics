"use client";
import { useState } from "react";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import useCartStore from "@/store";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { SanityImage } from "@/types/sanity-helpers";

interface VariantShape {
  _key: string;
  color?: string;
  availableStock?: number;
  images?: SanityImage[];
  // Assuming variantName is also a possibility based on ProductClient
  variantName?: string;
  colorName?: string;
}

interface Props {
  product: Product;
  variant: VariantShape;
  className?: string;
  selectedQuantity?: number;
  displayMode?: "default" | "overlay";
  disabled?: boolean; // <--- ADD THIS LINE: Explicitly define the disabled prop
}

export default function AddToCartButton({
  product,
  variant,
  className,
  selectedQuantity = 1,
  displayMode = "default",
  disabled: externalDisabled = false, // <--- Add a default and rename to avoid conflict
}: Props) {
  const { addItem, getItemCount } = useCartStore();

  const stockAvailable = variant.availableStock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  // Combine external disabled state with internal logic
  const isDisabled = externalDisabled || isOutOfStock || selectedQuantity <= 0 || stockAvailable < selectedQuantity;


  const handleAddToCart = () => {
    if (isDisabled) { // Check the combined disabled state
      if (isOutOfStock) {
        toast.error("This product is out of stock.");
      } else if (selectedQuantity <= 0) {
        toast.error("Please select a valid quantity.");
      } else if (stockAvailable < selectedQuantity) {
        toast.error(`Only ${stockAvailable} available. Please adjust quantity.`);
      }
      return;
    }

    // Add with the selected quantity
    addItem(
      product,
      {
        _key: variant._key,
        color: variant.color,
        images: variant.images,
        availableStock: variant.availableStock,
        variantName: variant.variantName, // Ensure these are passed if they exist
    
      },
      selectedQuantity
    );

    const variantDisplayName = variant.variantName || variant.colorName || variant.color || "variant";
    toast.success(`${selectedQuantity} x ${product.name} (${variantDisplayName}) added to cart!`);
  };

  const buttonStyle = cn(
    "py-3 px-6 rounded-lg flex items-center justify-center font-semibold transition-colors", // Adjusted padding for consistency with Buy Now
    displayMode === "overlay"
      ? "bg-tech_primary text-white hover:bg-white/90" // This may need adjustment if tech_primary is dark and text is white for overlay
      : "bg-tech_primary text-white hover:bg-tech_dark_color", // Use tech_dark_color from ProductClient for consistency
    isDisabled && "bg-gray-400 cursor-not-allowed", // Use combined isDisabled
    className
  );

  return (
    <button
      className={buttonStyle}
      onClick={handleAddToCart}
      disabled={isDisabled} // <--- Use the combined isDisabled variable here
    >
      <ShoppingCart size={16} className="mr-2" />
      Add to Cart
    </button>
  );
}