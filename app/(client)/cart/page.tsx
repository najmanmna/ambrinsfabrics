"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { urlFor } from "@/sanity/lib/image";
import useCartStore, { CartItem as CartItemType } from "@/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import QuantityButtons from "@/components/QuantityButtons";
import { ArrowLeft, Lock, ShoppingBag, Trash2 } from "lucide-react";

// --- Sub-component for a single Cart Item for better structure and readability ---
const CartItem = ({ item }: { item: CartItemType }) => {
  const { product, variant, itemKey, quantity } = item;
  const deleteCartProduct = useCartStore((s) => s.deleteCartProduct);

  const handleDelete = () => {
    deleteCartProduct(itemKey);
    toast.success("Product removed from cart.");
  };

  // Safe data handling
  const productImages: any[] = (product as any)?.images ?? [];
  const thumbnail = variant?.images?.[0] ?? productImages?.[0];
  const basePrice = typeof product?.price === "number" ? product.price : 0;
  const discountPercent = typeof product?.discount === "number" ? product.discount : 0;
  const discountedPrice = basePrice - (discountPercent * basePrice) / 100;

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Product Image */}
     {/* Product Image */}
{(product?.productType === "voucher" || thumbnail) && (
  <div className="flex-shrink-0">
    {product?.productType === "voucher" ? (
      <Image
        src={
          product?.image ||
          product?.voucherImage?.asset?.url ||
          "/gift.png" // default local image
        }
        alt={product?.name || "Voucher image"}
        width={100}
        height={125}
        className="rounded-lg border object-cover aspect-[4/5]"
      />
    ) : (
      <Link href={`/product/${product?.slug?.current || ""}`}>
        <Image
          src={urlFor(thumbnail).url()}
          alt={product?.name || "Product image"}
          width={100}
          height={125}
          className="rounded-lg border object-cover aspect-[4/5]"
        />
      </Link>
    )}
  </div>
)}

      {/* Product Info & Actions */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name and Price */}
        <div className="md:col-span-1 space-y-1">
          <Link
            href={`/product/${product?.slug?.current || ""}`}
            className="font-semibold text-lg hover:text-tech_primary transition-colors"
          >
            {product?.name ?? "Unnamed Product"}
          </Link>
          <div className="text-md text-gray-600">
            {discountPercent > 0 ? (
              <div className="flex items-center gap-2">
                <PriceFormatter amount={discountedPrice} className="font-medium" />
                <PriceFormatter amount={basePrice} className="text-gray-400 line-through text-sm" />
              </div>
            ) : (
              <PriceFormatter amount={basePrice} />
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="md:col-span-1 flex items-center justify-start md:justify-center">
          <QuantityButtons product={product} itemKey={itemKey} />
        </div>

        {/* Total and Delete Button */}
        <div className="md:col-span-1 flex items-center justify-between md:justify-end gap-4">
          <p className="font-semibold text-lg">
            <PriceFormatter amount={discountedPrice * quantity} />
          </p>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};


// --- Main Cart Page Component ---
const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const resetCart = useCartStore((s) => s.resetCart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResetCart = () => {
    resetCart();
    toast.success("Cart has been emptied!");
  };

  const handleProceedToCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    // Simulate API call for stock check if needed
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
      <Container className="py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          {/* LEFT: Cart Items */}
          <div className="flex-1 w-full">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            <Separator />
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem key={item.itemKey} item={item} />
              ))}
            </div>

            <Separator className="mt-4" />

            {/* Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/shop" className="flex-1">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300">
                    Empty Cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently remove all items from your shopping cart.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetCart} className="bg-red-600 hover:bg-red-700">
                      Yes, empty my cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* RIGHT: Order Summary (Sticky) */}
          <div className="w-full lg:w-96 lg:sticky lg:top-24">
            <Card className="bg-gray-50/50 shadow-sm border">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <PriceFormatter amount={subtotal} />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600">
                     <PriceFormatter amount={subtotal - total} />
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <PriceFormatter amount={total} />
                </div>
                <Button
                  onClick={handleProceedToCheckout}
                  disabled={loading}
                  className="w-full bg-tech_primary font-semibold tracking-wide mt-4"
                  size="lg"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CartPage;