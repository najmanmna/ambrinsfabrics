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
  sendAsGift?: boolean;
  fromName?: string;
  toName?: string;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, variant: CartVariant, quantity?: number) => void;
  deleteCartProduct: (itemKey: string) => void;
  resetCart: () => void;
  updateItemVariant: (itemKey: string, variant: CartVariant) => void;
  // ✨ NEW: Direct quantity update for precision (0.25m support)
  updateItemQuantity: (itemKey: string, quantity: number) => void;
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
          
          // Calculate stock (handle missing numbers gracefully)
          const stock = typeof variant.availableStock === 'number' 
            ? variant.availableStock 
            : (variant as any).openingStock - ((variant as any).stockOut || 0);

          if (stock <= 0) {
            toast.error("This product is out of stock");
            return state;
          }

          // If item exists → replace quantity (ensure we don't exceed stock)
          if (existing) {
            const newQuantity = Math.min(quantity, stock);
            return {
              items: state.items.map((i) =>
                i.itemKey === itemKey ? { ...i, quantity: newQuantity } : i
              ),
            };
          }

          // If new item → add fresh
          toast.success("Added to bag");
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

      // ✨ NEW: Handle specific quantity updates (e.g. 1.25m)
      updateItemQuantity: (itemKey, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.itemKey === itemKey);
          if (!item) return state;

          const stock = item.variant.availableStock ?? 0;

          // Prevent going below 0.25 or above stock
          if (quantity > stock) {
            toast.error(`Only ${stock}m available`);
            return state;
          }
          if (quantity <= 0) {
             // Optional: You could delete item here, but safer to stick to 1 or 0.25 min
             return state; 
          }

          return {
            items: state.items.map((i) =>
              i.itemKey === itemKey ? { ...i, quantity } : i
            ),
          };
        }),

      deleteCartProduct: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemKey !== itemKey),
        })),

      resetCart: () => set({ items: [] }),

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