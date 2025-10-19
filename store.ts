// src/store/index.ts
/**
 * Cart Store (useCartStore)
 *
 * This file implements a global cart state for the ecommerce app using Zustand with persistence.
 * It manages cart items, product variants, and quantities, and provides actions for adding,
 * updating, and removing items. Toast notifications are used for user feedback on cart actions.
 *
 * Features:
 * - Add, update, and remove products/variants from the cart
 * - Increase/decrease item quantity with stock validation
 * - Persist cart state in localStorage
 * - Show toast notifications for cart actions and errors
 * - Utility to get item count by key
 *
 * Usage:
 * - Import and use `useCartStore` in components to access and modify cart state
 * - Cart state is automatically persisted and restored across sessions
 *
 * Dependencies:
 * - Zustand (state management)
 * - react-hot-toast (notifications)
 * - TypeScript types for products and images
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types";
import type { SanityImage } from "@/types/sanity-helpers";
import toast from "react-hot-toast";

export interface CartVariant {
  _key: string;
  color?: string;
  availableStock?: number;
  images?: SanityImage[];
  variantName?: string;
}

export interface CartItem {
  product: Product;
  variant: CartVariant;
  itemKey: string;
  quantity: number;
  sendAsGift?: boolean;       // checkbox
  fromName?: string;          // buyer's name
  toName?: string;   
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, variant: CartVariant, quantity?: number) => void;

  increaseQuantity: (itemKey: string) => void;
  decreaseQuantity: (itemKey: string) => void;
  deleteCartProduct: (itemKey: string) => void;
  resetCart: () => void;
  updateItemVariant: (itemKey: string, variant: CartVariant) => void;
  getItemCount: (itemKey: string) => number;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) =>
  set((state) => {
    const itemKey = `${product._id}-${variant._key}`;
    const existing = state.items.find((i) => i.itemKey === itemKey);

    const stock = variant.availableStock ?? 0;

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return state;
    }

    // If item exists → replace quantity (not stack add)
    if (existing) {
      const newQuantity = Math.min(quantity, stock);
      return {
        items: state.items.map((i) =>
          i.itemKey === itemKey ? { ...i, quantity: newQuantity } : i
        ),
      };
    }

    // If new item → add fresh
    toast.success(`${product.name} added!`);
    return {
      items: [
        ...state.items,
        {
          product,
          variant,
          itemKey,
          quantity: Math.min(quantity, stock),
        },
      ],
    };
  }),


      increaseQuantity: (itemKey) =>
        set((state) => {
          const item = state.items.find((i) => i.itemKey === itemKey);
          if (!item) return state;
          const stock = item.variant.availableStock ?? 0;
          if (item.quantity < stock) {
            return {
              items: state.items.map((i) =>
                i.itemKey === itemKey ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          } else {
            toast.error("Cannot add more than available stock");
            return state;
          }
        }),

      decreaseQuantity: (itemKey) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.itemKey === itemKey
                ? { ...i, quantity: Math.max(0, i.quantity - 1) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      deleteCartProduct: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemKey !== itemKey),
        })),

      resetCart: () => set({ items: [] }),

      // ✅ Replace the variant completely to ensure fresh stock is used
      updateItemVariant: (itemKey, variant) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.itemKey === itemKey ? { ...i, variant: { ...variant } } : i
          ),
        })),

      getItemCount: (itemKey: string) => {
        const item = get().items.find((i) => i.itemKey === itemKey);
        return item ? item.quantity : 0;
      },
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
