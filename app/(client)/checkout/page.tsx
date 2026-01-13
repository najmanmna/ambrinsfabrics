"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image, { ImageLoaderProps } from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import { DISTRICTS } from "@/constants/SrilankaDistricts";
import Loading from "@/components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Lock, 
  Truck, 
  Banknote, 
  Gift, 
  AlertCircle, 
  Sparkles 
} from "lucide-react";

// --- QUERY: Matches your Sanity Schema ---
const SHIPPING_QUERY = `*[_type == "settings"][0]{
  deliveryCharges {
    colombo,
    suburbs,
    others
  }
}`;

// --- ZONES ---
const colomboCityAreas = [
  "Colombo 01 - Fort", "Colombo 02 - Slave Island", "Colombo 03 - Kollupitiya",
  "Colombo 04 - Bambalapitiya", "Colombo 05 - Havelock Town", "Colombo 06 - Wellawatte",
  "Colombo 07 - Cinnamon Gardens", "Colombo 08 - Borella", "Colombo 09 - Dematagoda",
  "Colombo 10 - Maradana", "Colombo 11 - Pettah", "Colombo 12 - Hulftsdorp",
  "Colombo 13 - Kotahena", "Colombo 14 - Grandpass", "Colombo 15 - Modara",
];

const colomboSuburbs = [
  "Sri Jayawardenepura Kotte", "Dehiwala", "Mount Lavinia", "Moratuwa", "Kaduwela",
  "Maharagama", "Kesbewa", "Homagama", "Kolonnawa", "Rajagiriya", "Nugegoda",
  "Pannipitiya", "Boralesgamuwa", "Malabe", "Kottawa", "Pelawatta", "Ratmalana",
  "Kohuwala", "Battaramulla", "Thalawathugoda", "Nawinna", "Piliyandala",
  "Angoda", "Athurugiriya",
];

const thumbnailLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const hasParams = src.includes("?");
  const separator = hasParams ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality || 65}&auto=format&fit=max`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const placingRef = useRef(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", district: "", city: "",
    phone: "", email: "", notes: "", payment: "COD",
  });

  // Default values until Sanity loads
  const [deliveryCharges, setDeliveryCharges] = useState<{
    colombo: number; suburbs: number; others: number;
  } | null>(null);
  
  const [shippingCost, setShippingCost] = useState<number>(0);

  const vouchersInCart = useMemo(() => items.filter((item) => (item.product as any).productType === "voucher"), [items]);
  const hasPhysicalProduct = useMemo(() => items.some((item) => (item.product as any).productType !== "voucher"), [items]);
  const hasVoucher = vouchersInCart.length > 0;

  const [voucherNames, setVoucherNames] = useState<Record<string, { fromName: string; toName: string }>>({});
  const [giftVouchers, setGiftVouchers] = useState<Record<string, boolean>>({});

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Setup Vouchers
    const vNames: Record<string, { fromName: string; toName: string }> = {};
    const vGifts: Record<string, boolean> = {};
    
    vouchersInCart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.itemKey}-${i}`;
        if (!voucherNames[key]) vNames[key] = { fromName: "", toName: "" };
        if (giftVouchers[key] === undefined) vGifts[key] = false;
      }
    });
    
    if (Object.keys(vNames).length > 0) setVoucherNames(prev => ({ ...prev, ...vNames }));
    if (Object.keys(vGifts).length > 0) setGiftVouchers(prev => ({ ...prev, ...vGifts }));

    // 2. Fetch Shipping Rates
    async function fetchShipping() {
      try {
        const data = await client.fetch(SHIPPING_QUERY);
        if (data?.deliveryCharges) {
          setDeliveryCharges(data.deliveryCharges);
        }
      } catch (err) {
        console.error("Failed to fetch shipping:", err);
      }
    }
    fetchShipping();
  }, [vouchersInCart]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- DYNAMIC SHIPPING LOGIC ---
  useEffect(() => {
    // A. No physical items? Free shipping.
    if (!hasPhysicalProduct) { 
      setShippingCost(0); 
      return; 
    }

    // B. Wait for rates to load
    if (!deliveryCharges) return;

    // C. Reset if district is cleared
    if (!form.district) {
      setShippingCost(0);
      return;
    }

    // D. CALCULATE
    if (form.district === "Colombo") {
      // For Colombo, we wait for the City to decide between City vs Suburb
      if (!form.city) {
        setShippingCost(0); // Waiting for city selection
      } else if (colomboCityAreas.includes(form.city)) {
        setShippingCost(deliveryCharges.colombo);
      } else {
        // Any other city in Colombo district is a Suburb
        setShippingCost(deliveryCharges.suburbs);
      }
    } else {
      // For ALL other districts (Galle, Kandy, etc.), calculate IMMEDIATELY
      // This uses the 'others' rate from your Sanity schema
      setShippingCost(deliveryCharges.others);
    }

  }, [form.district, form.city, deliveryCharges, hasPhysicalProduct]);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
    if (hasVoucher) setForm(prev => ({ ...prev, payment: "CARD" }));
  }, [items, router, hasVoucher]);

  const subtotal = items.reduce((acc, it) => {
    const price = it.product.price ?? 0;
    const discount = ((it.product.discount ?? 0) * price) / 100;
    return acc + (price - discount) * it.quantity;
  }, 0);

  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10) { toast.error("Please enter a valid phone number."); return; }
    if (placingRef.current) return;
    
    placingRef.current = true;
    setIsPlacingOrder(true);

    try {
      const payload = {
        form, total, shippingCost,
        items: items.map((i) => {
          const price = i.product.price ?? 0;
          const discount = ((i.product.discount ?? 0) * price) / 100;
          const finalPrice = price - discount;
          const isVoucher = (i.product as any).productType === "voucher";

          if (isVoucher) {
            const vouchers = Array.from({ length: i.quantity }).map((_, idx) => {
              const key = `${i.itemKey}-${idx}`;
              return {
                productId: i.product._id,
                name: i.product.name,
                price: finalPrice,
                isGift: giftVouchers[key] || false,
                fromName: giftVouchers[key] ? voucherNames[key]?.fromName : null,
                toName: giftVouchers[key] ? voucherNames[key]?.toName : null,
                voucherCode: null,
              };
            });
            return { type: "voucher", vouchers };
          }

          return {
            product: {
              _id: i.product._id,
              name: i.product.name,
              slug: i.product.slug?.current,
              price,
              discount: i.product.discount ?? 0,
              finalPrice: finalPrice,
            },
            variant: {
              _key: i.variant._key,
              color: i.variant.color,
              availableStock: i.variant.availableStock,
              images: i.variant.images,
              variantName: i.variant?.variantName,
            },
            quantity: i.quantity,
            total: finalPrice * i.quantity,
          };
        }),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      window.scrollTo(0, 0);
      toast.success("Order placed successfully!");
      sessionStorage.setItem("orderPlaced", "true");
      router.replace(`/success?orderNumber=${data.orderId}&payment=${form.payment}&total=${total}`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Failed to place order.");
      placingRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  const inputClass = "h-12 bg-white border-ambrins_dark/20 focus:border-ambrins_secondary focus:ring-1 focus:ring-ambrins_secondary rounded-sm transition-all text-ambrins_dark placeholder:text-ambrins_text/40";
  const labelClass = "text-xs font-bold uppercase tracking-widest text-ambrins_secondary mb-2 block";
  const sectionTitleClass = "font-heading text-2xl text-ambrins_dark mb-6 flex items-center gap-3 pb-4 border-b border-ambrins_dark/10";

  return (
    <div className="bg-ambrins_light min-h-screen">
      <Container className="py-12 md:py-20">
        {isPlacingOrder && <Loading />}
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ambrins_secondary block mb-3">
              Secure Concierge Checkout
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-ambrins_dark">
              Finalize Your Order
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* 1. CONTACT INFO */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-ambrins_dark/5">
                <h2 className={sectionTitleClass}>
                  <Banknote className="w-5 h-5 text-ambrins_secondary" /> Billing Details
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className={labelClass}>First Name</Label>
                    <Input required className={inputClass} value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelClass}>Last Name</Label>
                    <Input required className={inputClass} value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelClass}>Phone Number</Label>
                    <Input type="tel" required className={inputClass} placeholder="077..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelClass}>Email Address</Label>
                    <Input type="email" className={inputClass} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING ADDRESS (Conditional) */}
              <AnimatePresence>
                {hasPhysicalProduct && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white p-8 rounded-sm shadow-sm border border-ambrins_dark/5"
                  >
                    <h2 className={sectionTitleClass}>
                      <Truck className="w-5 h-5 text-ambrins_secondary" /> Delivery Address
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <Label className={labelClass}>Street Address</Label>
                        <Input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={inputClass} placeholder="House number and street name" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className={labelClass}>District</Label>
                          <select 
                            required 
                            className={`${inputClass} w-full`} 
                            value={form.district}
                            onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value, city: "" }))}
                          >
                            <option value="">Select District</option>
                            {Object.keys(DISTRICTS).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className={labelClass}>City / Town</Label>
                          <select 
                            required 
                            className={`${inputClass} w-full`} 
                            value={form.city}
                            onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!form.district}
                          >
                            <option value="">Select City</option>
                            {form.district && DISTRICTS[form.district]?.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3. PAYMENT METHOD */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-ambrins_dark/5">
                <h2 className={sectionTitleClass}>
                  <Lock className="w-5 h-5 text-ambrins_secondary" /> Payment Method
                </h2>
                
                {hasVoucher && (
                  <div className="flex items-start gap-3 bg-yellow-50 text-yellow-800 p-4 rounded-sm mb-6 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Digital Vouchers require instant payment. Cash on Delivery is disabled.</p>
                  </div>
                )}

                <RadioGroup value={form.payment} onValueChange={v => setForm({...form, payment: v})} className="space-y-4">
                  <label className={`relative flex items-center p-4 border rounded-sm cursor-pointer transition-all ${form.payment === "BANK" ? "border-ambrins_secondary bg-ambrins_light/50" : "border-ambrins_dark/10 hover:border-ambrins_dark/30"} ${hasVoucher ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <RadioGroupItem value="BANK" id="bank" className="sr-only" disabled={hasVoucher} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${form.payment === "BANK" ? "border-ambrins_secondary" : "border-gray-300"}`}>
                      {form.payment === "BANK" && <div className="w-2.5 h-2.5 bg-ambrins_secondary rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-heading text-lg text-ambrins_dark block">Bank Transfer</span>
                      <span className="text-xs text-ambrins_text/60">Transfer manually. Details shown after order.</span>
                    </div>
                    <Banknote className="w-6 h-6 text-ambrins_text/40" />
                  </label>

                  <label className={`relative flex items-center p-4 border rounded-sm cursor-pointer transition-all ${form.payment === "COD" ? "border-ambrins_secondary bg-ambrins_light/50" : "border-ambrins_dark/10 hover:border-ambrins_dark/30"} ${hasVoucher ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <RadioGroupItem value="COD" id="cod" className="sr-only" disabled={hasVoucher} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${form.payment === "COD" ? "border-ambrins_secondary" : "border-gray-300"}`}>
                      {form.payment === "COD" && <div className="w-2.5 h-2.5 bg-ambrins_secondary rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-heading text-lg text-ambrins_dark block">Cash on Delivery</span>
                      <span className="text-xs text-ambrins_text/60">Pay in cash when you receive your fabrics.</span>
                    </div>
                    <Truck className="w-6 h-6 text-ambrins_text/40" />
                  </label>
                </RadioGroup>
              </div>

              <div>
                <Label className={labelClass}>Additional Notes</Label>
                <Textarea className={inputClass} placeholder="Any special instructions?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>

            {/* --- RIGHT COLUMN: SUMMARY --- */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-white p-8 rounded-sm shadow-xl shadow-ambrins_dark/5 border-t-4 border-ambrins_dark">
                <h3 className="font-heading text-2xl text-ambrins_dark mb-6">Order Summary</h3>
                
                {/* Product List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-ambrins_secondary/20 mb-6">
                  {items.map(({ product, variant, quantity, itemKey }) => {
                    const isVoucher = (product as any).productType === "voucher";
                    const imgUrl = isVoucher 
                      ? (product as any).image || "/voucher-placeholder.jpg"
                      : variant?.images?.[0] ? urlFor(variant.images[0]).url() : "/fallback.png";
                    const price = (product.price ?? 0) - (((product.discount ?? 0) * (product.price ?? 0)) / 100);

                    return (
                      <div key={itemKey} className="flex gap-4 py-2 border-b border-dashed border-ambrins_dark/10 last:border-0">
                        <div className="relative w-14 h-16 bg-ambrins_light flex-shrink-0 border border-ambrins_dark/10 rounded-sm overflow-hidden">
                          <Image loader={thumbnailLoader} src={imgUrl} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-heading text-sm text-ambrins_dark line-clamp-1">{product.name}</p>
                          <p className="text-[10px] uppercase tracking-wide text-ambrins_text/60">
                            Qty: {quantity} {isVoucher ? "" : "m"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-ambrins_dark"><PriceFormatter amount={price * quantity} /></p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculations */}
                <div className="space-y-3 pt-4 border-t border-ambrins_dark/10 mb-8">
                  <div className="flex justify-between text-sm text-ambrins_text/70">
                    <span>Subtotal</span>
                    <span><PriceFormatter amount={subtotal} /></span>
                  </div>
                  <div className="flex justify-between text-sm text-ambrins_text/70">
                    <span>Shipping</span>
                    <span>
                      {!hasPhysicalProduct 
                        ? "Digital Delivery" 
                        : shippingCost > 0 
                          ? <PriceFormatter amount={shippingCost} /> 
                          : form.district === "Colombo" && !form.city 
                            ? "Select City" 
                            : form.district 
                              ? "Calculating..." 
                              : "Enter address"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-ambrins_dark/10 mt-4">
                    <span className="font-heading text-xl text-ambrins_dark">Total</span>
                    <span className="font-heading text-2xl font-bold text-ambrins_primary">
                      <PriceFormatter amount={total} />
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isPlacingOrder}
                  className="w-full bg-ambrins_dark hover:bg-ambrins_primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] py-6 shadow-lg transition-all transform hover:-translate-y-0.5 mb-4"
                >
                  {isPlacingOrder ? "Processing..." : "Confirm Purchase"}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-ambrins_text/40 uppercase tracking-wider text-center">
                  <Sparkles className="w-3 h-3" /> 
                  <Lock className="w-3 h-3" />
                  Secure SSL Encrypted Checkout
                </div>

              </div>
            </div>

          </form>
        </motion.div>
      </Container>
    </div>
  );
}