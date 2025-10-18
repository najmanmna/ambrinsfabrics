"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import { DISTRICTS } from "@/constants/SrilankaDistricts";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

const SHIPPING_QUERY = `*[_type == "settings"][0]{
  deliveryCharges {
    colombo,
    suburbs,
    others
  }
}`;
const colomboCityAreas = [
  "Colombo 01 - Fort",
  "Colombo 02 - Slave Island",
  "Colombo 03 - Kollupitiya",
  "Colombo 04 - Bambalapitiya",
  "Colombo 05 - Havelock Town",
  "Colombo 06 - Wellawatte",
  "Colombo 07 - Cinnamon Gardens",
  "Colombo 08 - Borella",
  "Colombo 09 - Dematagoda",
  "Colombo 10 - Maradana",
  "Colombo 11 - Pettah",
  "Colombo 12 - Hulftsdorp",
  "Colombo 13 - Kotahena",
  "Colombo 14 - Grandpass",
  "Colombo 15 - Modara",
];
const colomboSuburbs = [
  "Sri Jayawardenepura Kotte",
  "Dehiwala",
  "Mount Lavinia",
  "Moratuwa",
  "Kaduwela",
  "Maharagama",
  "Kesbewa",
  "Homagama",
  "Kolonnawa",
  "Rajagiriya",
  "Nugegoda",
  "Pannipitiya",
  "Boralesgamuwa",
  "Malabe",
  "Kottawa",
  "Pelawatta",
  "Ratmalana",
  "Kohuwala",
  "Battaramulla",
  "Thalawathugoda",
  "Nawinna",
  "Piliyandala",
  "Angoda",
  "Athurugiriya",
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const placingRef = useRef(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    phone: "",
    email: "",
    notes: "",
    payment: "COD",
  });

  const [deliveryCharges, setDeliveryCharges] = useState<{
    colombo: number;
    suburbs: number;
    others: number;
  } | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);

  useEffect(() => {
    async function fetchShipping() {
      try {
        const data = await client.fetch(SHIPPING_QUERY);
        setDeliveryCharges(data?.deliveryCharges ?? null);
      } catch (err) {
        console.error("Failed to fetch shipping:", err);
      }
    }
    fetchShipping();
  }, []);

  useEffect(() => {
    if (!deliveryCharges || !form.district || !form.city) return;
    let fee = deliveryCharges.others;
    if (form.district === "Colombo") {
      if (colomboCityAreas.includes(form.city)) fee = deliveryCharges.colombo;
      else if (colomboSuburbs.includes(form.city))
        fee = deliveryCharges.suburbs;
      else fee = deliveryCharges.others;
    }
    setShippingCost(fee);
  }, [form.district, form.city, deliveryCharges]);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  const subtotal = items.reduce((acc, it) => {
    const price = it.product.price ?? 0;
    const discount = ((it.product.discount ?? 0) * price) / 100;
    return acc + (price - discount) * it.quantity;
  }, 0);

  const total = subtotal + shippingCost;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const digits = form.phone.replace(/\D/g, "");
  if (digits.length < 10) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  if (placingRef.current) return;
  placingRef.current = true;
  setIsPlacingOrder(true);

  try {
    const payload = {
      form,
      total,
      shippingCost,
      items: items.map((i) => {
        const price = i.product.price ?? 0;
        const discount = ((i.product.discount ?? 0) * price) / 100;
        const finalPrice = price - discount;

        const isVoucher = (i.product as any).productType === "voucher";

        if (isVoucher) {
          // Create individual voucher entries for each quantity
          const vouchers = Array.from({ length: i.quantity }).map((_, idx) => {
            const key = `${i.itemKey}-${idx}`;
            return {
              productId: i.product._id,
              name: i.product.name,
              price: finalPrice,
              isGift: giftVouchers[key] || false,
              fromName: giftVouchers[key] ? voucherNames[key].fromName : null,
              toName: giftVouchers[key] ? voucherNames[key].toName : null,
              voucherCode: null, // Backend will generate
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
            finalPrice,
          },
          variant: {
            _key: i.variant._key,
            color: i.variant.color,
            availableStock: i.variant.availableStock,
            images: i.variant.images,
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

    if (!res.ok) {
      toast.error(data.error || "Checkout failed.");
      placingRef.current = false;
      setIsPlacingOrder(false);
      return;
    }

    window.scrollTo(0, 0);
    toast.success("Order placed successfully!");
    sessionStorage.setItem("orderPlaced", "true");

    router.replace(
      `/success?orderNumber=${data.orderId}&payment=${form.payment}&total=${total}`
    );
  } catch (err) {
    console.error("❌ Checkout error:", err);
    toast.error("Failed to place order.");
    placingRef.current = false;
    setIsPlacingOrder(false);
  }
};


  // Custom classNames for UI consistency
  const inputStyles =
    "block w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-200/80 rounded-md focus:ring-[#A67B5B] focus:border-[#A67B5B] transition-colors";
  const labelStyles = "text-sm font-medium text-gray-600 mb-2 block";
  const cardStyles = "bg-white rounded-lg shadow-sm border border-gray-200/60";
const vouchersInCart = useMemo(
  () => items.filter((item) => (item.product as any).productType === "voucher"),
  [items]
);

// Initialize voucher names & gift toggles on first render
const initialVoucherNames = useMemo(() => {
  const obj: Record<string, { fromName: string; toName: string }> = {};
  vouchersInCart.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      const key = `${item.itemKey}-${i}`;
      obj[key] = { fromName: "", toName: "" };
    }
  });
  return obj;
}, [vouchersInCart]);

const initialGiftVouchers = useMemo(() => {
  const obj: Record<string, boolean> = {};
  vouchersInCart.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      const key = `${item.itemKey}-${i}`;
      obj[key] = false;
    }
  });
  return obj;
}, [vouchersInCart]);

const [voucherNames, setVoucherNames] = useState(initialVoucherNames);
const [giftVouchers, setGiftVouchers] = useState(initialGiftVouchers);


useEffect(() => {
  // Update voucher names only for new keys
  setVoucherNames((prev) => {
    const updated: Record<string, { fromName: string; toName: string }> = { ...prev };
    vouchersInCart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.itemKey}-${i}`;
        if (!updated[key]) updated[key] = { fromName: "", toName: "" };
      }
    });
    return updated;
  });

  // Update gift toggle only for new keys
  setGiftVouchers((prev) => {
    const updated: Record<string, boolean> = { ...prev };
    vouchersInCart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.itemKey}-${i}`;
        if (prev[key] === undefined) updated[key] = false;
      }
    });
    return updated;
  });
}, [vouchersInCart]);


  return (
    <div className="bg-[#FDFBF6]">
      <Container className="py-24 sm:py-32">
        {isPlacingOrder && <Loading />}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3E50]">
              Complete Your Order
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-8 lg:space-y-0 grid grid-cols-1 lg:grid-cols-2 lg:gap-12"
          >
            {/* LEFT: Billing Details */}
            <div className="space-y-6">
              <Card className={cardStyles}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[#2C3E50] font-medium">
                    Billing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={labelStyles}>First Name *</Label>
                      <Input
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        required
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <Label className={labelStyles}>Last Name *</Label>
                      <Input
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        required
                        className={inputStyles}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className={labelStyles}>Address *</Label>
                    <Input
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      required
                      className={inputStyles}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district" className={labelStyles}>
                      District *
                    </Label>
                    <select
                      id="district"
                      className={inputStyles}
                      value={form.district}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          district: e.target.value,
                          city: "",
                        }))
                      }
                      required
                    >
                      <option value="">Select District</option>
                      {Object.keys(DISTRICTS).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="city" className={labelStyles}>
                      Town / City *
                    </Label>
                    <select
                      id="city"
                      className={inputStyles}
                      value={form.city}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      disabled={!form.district}
                      required
                    >
                      <option value="">Select City</option>
                      {form.district &&
                        DISTRICTS[form.district]?.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <Label className={labelStyles}>Phone *</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      placeholder="e.g., 0771234567"
                      className={inputStyles}
                    />
                  </div>
                  <div>
                    <Label className={labelStyles}>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={inputStyles}
                    />
                  </div>
                  <div>
                    <Label className={labelStyles}>
                      Order Notes (optional)
                    </Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className={inputStyles}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="space-y-6">
              <Card className={cardStyles}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[#2C3E50] font-medium">
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(({ product, variant, quantity, itemKey }) => {
                    const imageUrl = variant?.images?.[0]
                      ? urlFor(variant.images[0]).url()
                      : "/fallback.png";
                    const price = product.price ?? 0;
                    const discount = ((product.discount ?? 0) * price) / 100;
                    const finalPrice = price - discount;
                    return (
                      <div
                        key={itemKey}
                        className="flex justify-between items-center border-b border-gray-200/80 pb-3"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={imageUrl}
                            alt={product?.name || "Product"}
                            width={60}
                            height={75}
                            className="rounded-md border border-gray-200/60 object-cover aspect-[4/5]"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              x {quantity}
                            </p>
                          </div>
                        </div>
                        <PriceFormatter amount={finalPrice * quantity} />
                      </div>
                    );
                  })}
                  <div className="space-y-3 pt-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 && form.city
                          ? "FREE"
                          : shippingCost > 0
                            ? `Rs. ${shippingCost}`
                            : "Select city"}
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold text-lg text-[#2C3E50]">
                      <span>Total</span>
                      <PriceFormatter amount={total} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cardStyles}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[#2C3E50] font-medium">
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    defaultValue="COD"
                    onValueChange={(v) => setForm({ ...form, payment: v })}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="COD" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="BANK" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                  {form.payment === "BANK" && (
                    <div className="mt-4 p-4 rounded-md border bg-[#FBF8F2] text-sm text-[#A67B5B]">
                      <p>
                        You will receive bank account details on the
                        confirmation page after placing your order.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="p-6 space-y-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-4 w-4 mt-1 accent-[#A67B5B]"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I have read and agree to the website's{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-[#A67B5B] underline hover:text-[#2C3E50]"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>
                    .
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Your personal data will be used to process your order and
                  support your experience, as described in our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#A67B5B] underline hover:text-[#2C3E50]"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              {vouchersInCart.map((item) =>
                Array.from({ length: item.quantity }).map((_, i) => {
                  const key = `${item.itemKey}-${i}`;
                  return (
                    <div key={key} className="space-y-2 border-b pb-3">
                      <div className="flex items-center space-x-2">
                     <input
  type="checkbox"
  id={`gift-${key}`}
  checked={giftVouchers[key]}
  onChange={(e) =>
    setGiftVouchers((prev) => ({
      ...prev,
      [key]: e.target.checked,
    }))
  }
  className="accent-[#A67B5B]"
/>

                        <Label
                          htmlFor={`gift-${key}`}
                          className="text-sm text-gray-600"
                        >
                          Gift this voucher? (Get the names printed on the
                          voucher)
                        </Label>
                      </div>

                      {giftVouchers[key] && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label
                              htmlFor={`from-${key}`}
                              className={labelStyles}
                            >
                              From Name *
                            </Label>
                           <Input
  id={`from-${key}`}
  value={voucherNames[key].fromName}
  onChange={(e) =>
    setVoucherNames((prev) => ({
      ...prev,
      [key]: { ...prev[key], fromName: e.target.value },
    }))
  }
  required
  className={inputStyles}
/>
                          </div>
                          <div>
                            <Label
                              htmlFor={`to-${key}`}
                              className={labelStyles}
                            >
                              To Name *
                            </Label>
                           <Input
  id={`to-${key}`}
  value={voucherNames[key].toName}
  onChange={(e) =>
    setVoucherNames((prev) => ({
      ...prev,
      [key]: { ...prev[key], toName: e.target.value },
    }))
  }
  required
  className={inputStyles}
/>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              <Button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full font-semibold text-lg py-6 bg-[#2C3E50] text-white rounded-full hover:bg-[#46627f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
              </Button>
            </div>
          </form>
        </motion.div>
      </Container>
    </div>
  );
}
