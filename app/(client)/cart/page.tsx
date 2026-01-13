"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image, { ImageLoaderProps } from "next/image";
import toast from "react-hot-toast";
import { urlFor } from "@/sanity/lib/image";
import useCartStore, { CartItem as CartItemType } from "@/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import { ArrowLeft, Lock, Trash2, Minus, Plus, Sparkles } from "lucide-react";

// --- LOADER ---
const thumbnailLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 65}&auto=format&fit=max`;
};

// --- SUB-COMPONENT: Cart Quantity Selector ---
const CartQuantitySelector = ({ item }: { item: CartItemType }) => {
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  
  // LOGIC UPDATE: No category check. Everything is 0.25m increments.
  const step = 0.25;
  const min = 1; // Enforcing Minimum 1 Meter (as per previous request)
  const stock = item.variant.availableStock ?? 0;

  const handleUpdate = (newVal: number) => {
    // Round to avoid floating point errors (1.2500004)
    const rounded = Math.round(newVal * 100) / 100;
    if (rounded <= stock && rounded >= min) {
      updateItemQuantity(item.itemKey, rounded);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
        <div className="flex items-center w-max border border-ambrins_dark/20 rounded-sm overflow-hidden bg-white h-8">
            <button 
                onClick={() => handleUpdate(item.quantity - step)}
                disabled={item.quantity <= min}
                className="w-8 h-full flex items-center justify-center hover:bg-ambrins_light disabled:opacity-30 transition-colors text-ambrins_dark"
            >
                <Minus size={14} />
            </button>
            <div className="min-w-[3.5rem] px-2 h-full flex items-center justify-center font-heading text-sm font-bold text-ambrins_dark border-x border-ambrins_dark/10">
                {/* Always show 2 decimals (e.g. 1.25) */}
                {item.quantity.toFixed(2)}
                <span className="text-[10px] font-normal ml-0.5 text-gray-500">m</span>
            </div>
            <button 
                onClick={() => handleUpdate(item.quantity + step)}
                disabled={item.quantity >= stock}
                className="w-8 h-full flex items-center justify-center hover:bg-ambrins_light disabled:opacity-30 transition-colors text-ambrins_dark"
            >
                <Plus size={14} />
            </button>
        </div>
        {item.quantity >= stock && (
            <span className="text-[10px] text-red-500 font-medium">Max stock reached</span>
        )}
    </div>
  );
};


// --- SUB-COMPONENT: Cart Item Row ---
const CartItemRow = ({ item }: { item: CartItemType }) => {
  const { product, variant, itemKey, quantity } = item;
  const deleteCartProduct = useCartStore((s) => s.deleteCartProduct);

  const handleDelete = () => {
    deleteCartProduct(itemKey);
    toast.success("Removed from bag");
  };

  // Safe data handling
  const productImages: any[] = (product as any)?.images ?? [];
  const thumbnail = variant?.images?.[0] ?? productImages?.[0];
  const basePrice = typeof product?.price === "number" ? product.price : 0;
  const discountPercent = typeof product?.discount === "number" ? product.discount : 0;
  const discountedPrice = basePrice - (discountPercent * basePrice) / 100;

  const isVoucher = (product as any)?.productType === "voucher";
  const sanityImageSource = isVoucher
    ? ((product as any)?.image || (product as any)?.voucherImage?.asset?.url)
    : (thumbnail ? urlFor(thumbnail).url() : null);

  return (
    <div className="flex gap-4 py-6 group bg-white p-4 rounded-sm border border-transparent hover:border-ambrins_dark/5 transition-all mb-2">
      
      {/* 1. Image */}
      <div className="flex-shrink-0 relative w-20 h-24 sm:w-24 sm:h-32 bg-ambrins_light rounded-sm overflow-hidden border border-ambrins_dark/10">
        {sanityImageSource ? (
            <Link href={isVoucher ? "#" : `/product/${product?.slug?.current || ""}`}>
              <Image
                loader={thumbnailLoader}
                src={sanityImageSource}
                alt={product?.name || "Product image"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100px"
              />
            </Link>
        ) : (
           <div className="w-full h-full flex items-center justify-center text-ambrins_secondary/30">
               <Sparkles className="w-6 h-6" />
           </div>
        )}
      </div>

      {/* 2. Content Grid */}
      <div className="flex-1 flex flex-col justify-between">
        
        <div className="flex justify-between items-start gap-2">
            <div>
                <Link
                    href={`/product/${product?.slug?.current || ""}`}
                    className="font-heading text-lg text-ambrins_dark hover:text-ambrins_primary transition-colors leading-tight line-clamp-2"
                >
                    {product?.name ?? "Item"}
                </Link>
                {variant?.variantName && (
                    <p className="text-xs text-ambrins_text/60 mt-1 font-body uppercase tracking-wider">
                        Variant: <span className="font-bold text-ambrins_dark">{variant.variantName}</span>
                    </p>
                )}
            </div>
            
            {/* Price (Top Right on Mobile) */}
            <div className="text-right">
                <p className="font-heading text-lg font-bold text-ambrins_dark">
                    <PriceFormatter amount={discountedPrice * quantity} />
                </p>
                {discountPercent > 0 && (
                    <p className="text-xs text-ambrins_primary font-bold">-{discountPercent}% OFF</p>
                )}
            </div>
        </div>

        {/* 3. Bottom Actions: Qty & Delete */}
        <div className="flex items-end justify-between mt-4">
             <CartQuantitySelector item={item} />

             <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                        onClick={handleDelete} 
                        className="text-xs text-ambrins_text/50 hover:text-red-600 flex items-center gap-1 transition-colors underline decoration-transparent hover:decoration-red-600 underline-offset-4"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove item</p>
                  </TooltipContent>
                </Tooltip>
             </TooltipProvider>
        </div>

      </div>
    </div>
  );
};

// --- MAIN CART PAGE ---
const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const resetCart = useCartStore((s) => s.resetCart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResetCart = () => {
    resetCart();
    toast.success("Bag cleared");
  };

  const handleProceedToCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    // Simulate slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/checkout");
    setLoading(false);
  };

  const subtotal = items.reduce((acc, it) => acc + (it.product.price ?? 0) * it.quantity, 0);
  const total = items.reduce((acc, it) => {
    const price = it.product.price ?? 0;
    const discount = ((it.product.discount ?? 0) * price) / 100;
    return acc + (price - discount) * it.quantity;
  }, 0);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      {loading && <Loading />}
      <div className="bg-ambrins_light min-h-screen border-t border-ambrins_dark/5">
        <Container className="py-12 md:py-20">
          
          <h1 className="font-heading text-4xl md:text-5xl text-ambrins_dark mb-2">
            Your Selection
          </h1>
          <p className="font-body text-ambrins_text/60 mb-10">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
          </p>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* LEFT: Cart Items List */}
            <div className="flex-1 w-full">
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItemRow key={item.itemKey} item={item} />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-ambrins_dark/10">
                <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-ambrins_secondary hover:text-ambrins_primary flex items-center gap-2 transition-colors">
                   <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-xs text-red-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors">
                      Clear Bag
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-heading text-2xl text-ambrins_dark">Clear your bag?</AlertDialogTitle>
                      <AlertDialogDescription className="text-ambrins_text/70">
                        This will remove all selected items. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-body text-xs font-bold uppercase tracking-widest border-none hover:bg-ambrins_light">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetCart} className="bg-red-600 hover:bg-red-700 font-body text-xs font-bold uppercase tracking-widest">
                        Yes, Clear It
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* RIGHT: Order Summary (Sticky) */}
            <div className="w-full lg:w-96 lg:sticky lg:top-24">
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl shadow-ambrins_secondary/5 border-t-4 border-ambrins_dark">
                <h2 className="font-heading text-2xl text-ambrins_dark mb-6">Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-ambrins_text/80 text-sm">
                    <span>Subtotal</span>
                    <PriceFormatter amount={subtotal} className="font-medium text-ambrins_dark" />
                  </div>
                  
                  {subtotal - total > 0 && (
                      <div className="flex justify-between text-ambrins_primary text-sm font-medium">
                        <span>Savings</span>
                        <span>- <PriceFormatter amount={subtotal - total} /></span>
                      </div>
                  )}

                  <div className="flex justify-between text-ambrins_text/60 text-xs">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-ambrins_dark/10 pt-4 mb-8">
                  <div className="flex justify-between items-baseline">
                    <span className="font-heading text-lg text-ambrins_dark">Total</span>
                    <span className="font-heading text-2xl font-bold text-ambrins_dark">
                        <PriceFormatter amount={total} />
                    </span>
                  </div>
                  <p className="text-right text-[10px] text-ambrins_text/50 mt-1">Include taxes where applicable</p>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  disabled={loading}
                  className="w-full bg-ambrins_dark hover:bg-ambrins_primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] py-6 shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Lock className="h-3 w-3 mr-2" />
                      Secure Checkout
                    </>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-ambrins_text/40 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Secure SSL Encryption
                </div>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </>
  );
};

export default CartPage;