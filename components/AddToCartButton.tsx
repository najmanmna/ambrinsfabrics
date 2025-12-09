"use client";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { SanityImage } from "@/types/sanity-helpers";

interface VariantShape {
  _key: string;
  // 👇 ADD 'name' here because ProductClient passes it!
  name?: string; 
  color?: string;
  availableStock?: number;
  images?: SanityImage[];
  variantName?: string;
  colorName?: string;
}

interface Props {
  product: Product;
  variant: VariantShape;
  className?: string;
  selectedQuantity?: number;
  displayMode?: "default" | "overlay";
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variant,
  className,
  selectedQuantity = 1,
  displayMode = "default",
  disabled: externalDisabled = false,
}: Props) {
  const { addItem } = useCartStore();

  const stockAvailable = variant.availableStock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  const isDisabled = externalDisabled || isOutOfStock || selectedQuantity <= 0 || stockAvailable < selectedQuantity;

  // 👇 LOGIC FIX: Check 'variant.name' first
  const variantDisplayName = 
    variant.name || 
    variant.variantName || 
    variant.colorName || 
    variant.color || 
    "Option";

  const handleAddToCart = () => {
    if (isDisabled) {
      if (isOutOfStock) {
        toast.error("This product is out of stock.");
      } else if (selectedQuantity <= 0) {
        toast.error("Please select a valid quantity.");
      } else if (stockAvailable < selectedQuantity) {
        toast.error(`Only ${stockAvailable} available. Please adjust quantity.`);
      }
      return;
    }

    addItem(
      product,
      {
        _key: variant._key,
        color: variant.color,
        images: variant.images,
        availableStock: variant.availableStock,
        // 👇 FIX: Normalize the name so it saves correctly in the Cart Store
        variantName: variantDisplayName, 
      },
      selectedQuantity
    );

    // 👇 This will now show the correct name
    toast.success(`${selectedQuantity} x ${product.name} (${variantDisplayName}) added to cart!`);
  };

  const buttonStyle = cn(
    "py-3 px-6 rounded-lg flex items-center justify-center font-semibold transition-colors",
    displayMode === "overlay"
      ? "bg-tech_primary text-white hover:bg-white/90"
      : "bg-tech_primary text-white hover:bg-tech_dark_color",
    isDisabled && "bg-gray-400 cursor-not-allowed",
    className
  );

  return (
    <button
      className={buttonStyle}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      <ShoppingCart size={16} className="mr-2" />
      Add to Cart
    </button>
  );
}