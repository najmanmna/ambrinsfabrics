// /app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

// --- REMOVED STRIPE IMPORTS ---
// Add this near your imports
interface VoucherItem {
  code: string;
  toName: string;
  // Add other properties if needed by the map
}
export const runtime = "nodejs";

// ------------------ MAIN HANDLER ------------------ //
export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN)
      return NextResponse.json(
        { error: "Missing SANITY_API_TOKEN" },
        { status: 500 }
      );

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    // --- Logic for validation ---
    const normalItems = items.filter(
      (it: any) => !it.type || it.type !== "voucher"
    );
    const hasPhysicalProducts = normalItems.length > 0;

    const voucherItems = items
      .filter((it: any) => it.type === "voucher")
      .flatMap((it: any) =>
        it.vouchers.map((v: any) => ({
          ...v,
          voucherCode: `VCHR-${uuidv4().split("-")[0].toUpperCase()}`,
          _id: uuidv4(),
          createdAt: new Date().toISOString(),
          product: { _type: "reference", _ref: v.productId },
        }))
      );

    // --- Updated Validation ---
    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required customer details" },
        { status: 400 }
      );
    }

    // Only validate address if there are physical products
    if (
      hasPhysicalProducts &&
      (!form?.address || !form?.district || !form?.city)
    ) {
      return NextResponse.json(
        { error: "Missing required shipping fields for physical items" },
        { status: 400 }
      );
    }

    // ✅ Fetch fresh product data for normal items
    const productIds = normalItems.map((it: any) => it.product._id);
    const freshProducts = await backendClient.fetch(
      `*[_type == "product" && _id in $ids]{
        _id, _rev, name,
        variants[] {
          _key, variantName, openingStock, stockOut,
          "availableStock": openingStock - coalesce(stockOut, 0),
          images
        }
      }`,
      { ids: productIds }
    );

    // ✅ Validate stock for normal items
    for (const it of normalItems) {
      const fresh = freshProducts.find((p: any) => p._id === it.product._id);
      if (!fresh)
        return NextResponse.json(
          { error: `Product not found: ${it.product?._id}` },
          { status: 404 }
        );

      const variant =
        fresh.variants?.find((v: any) => v._key === it.variant?._key) ||
        fresh.variants?.[0];

      if (!variant)
        return NextResponse.json(
          { error: `Variant missing for ${fresh.name}` },
          { status: 400 }
        );

      if (variant.availableStock < it.quantity)
        return NextResponse.json(
          {
            error: `Insufficient stock for ${fresh.name} (${variant.variantName})`,
          },
          { status: 409 }
        );

      it.product._rev = fresh._rev;
    }

    // --- REMOVED PAYMENT LOGIC SPLIT ---
    // All payment methods are now handled the same way.

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ✅ Duplicate check
    const recentOrder = await backendClient.fetch(
      `*[_type == "order" && phone == $phone && total == $total && orderDate > $recent][0]`,
      {
        phone: form.phone,
        total,
        recent: new Date(Date.now() - 30 * 1000).toISOString(),
      }
    );
    if (recentOrder)
      return NextResponse.json(
        { error: "Duplicate order detected" },
        { status: 429 }
      );
      
    // --- Smart Status (for future use) ---
    // For now, CARD payments are treated as "processing" since we are simulating success.
    // COD/BANK are "pending" confirmation.
    let orderStatus = "pending";
    if (form.payment === "CARD") {
      orderStatus = "processing"; 
    }

    // ✅ Construct order doc
    const order = {
      _type: "order",
      orderNumber: orderId,
      status: orderStatus, // Use the smart status
      orderDate: new Date().toISOString(),
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email || "",
      // Only add address if physical products were ordered
      address: hasPhysicalProducts
        ? {
            district: form.district,
            city: form.city,
            line1: form.address,
            notes: form.notes || "",
          }
        : undefined,
      paymentMethod: form.payment, // This will correctly save "CARD", "COD", or "BANK"
      items: normalItems.map((it: any) => {
        const fresh = freshProducts.find((p: any) => p._id === it.product._id);
        const matchedVariant = fresh?.variants?.find(
          (v: any) => v._key === it.variant?._key
        );

        return {
          _type: "orderItem",
          _key: uuidv4(),
          product: { _type: "reference", _ref: it.product._id },
          variant: {
            variantKey: matchedVariant?._key || it.variant?._key,
            variantName:
              matchedVariant?.variantName || it.variant?.variantName || "",
          },
          quantity: it.quantity,
          price: it.product.finalPrice ?? it.product.price ?? 0,
          productName: fresh?.name || "Unknown",
          productImage:
            matchedVariant?.images?.[0]
              ? {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: matchedVariant.images[0].asset._ref,
                  },
                }
              : undefined,
        };
      }),
      vouchers: voucherItems.map((v: any) => ({
        _type: "voucher", // This assumes 'vouchers' is an array of 'voucher' types in your 'order' schema
        _key: v._id,
        code: v.voucherCode,
        isGift: v.isGift,
        fromName: v.fromName || "",
        toName: v.toName || "",
        product: v.product,
        price: v.price,
        redeemed: false,
      })),
      subtotal: items.reduce((acc: number, it: any) => {
        if (it.type === "voucher") {
          return (
            acc + it.vouchers.reduce((vAcc: number, v: any) => vAcc + v.price, 0)
          );
        }
        return (
          acc + (it.product.finalPrice ?? it.product.price ?? 0) * it.quantity
        );
      }, 0),
      shippingCost: shippingCost ?? 0,
      total,
    };

    // ✅ Transaction — Create order + update stock
    const tx = backendClient.transaction().create(order);

    normalItems.forEach((it: any) => {
      const variantKey = it.variant?._key;
      if (!variantKey) throw new Error("Variant key missing for stock update");

      tx.patch(it.product._id, (p) =>
        p
          .inc({ [`variants[_key=="${variantKey}"].stockOut`]: it.quantity })
          .ifRevisionId(it.product._rev)
      );
    });

    // Create voucher docs separately
    voucherItems.forEach((v: any) => {
      tx.create({
        _type: "voucher",
        code: v.voucherCode,
        isGift: v.isGift,
        fromName: v.fromName || "",
        toName: v.toName || "",
        product: v.product,
        price: v.price,
        orderNumber: orderId, // Link to the order
        redeemed: false,
        createdAt: v.createdAt,
      });
    });

    await tx.commit();

    // ✅ Send emails asynchronously
   // ... inside your API's try block ...

  // ✅ Send emails asynchronously
  if (form.email) {
    sendSubscribeEmail({
      to: form.email,
      subject: `Your Order ${orderId} is Confirmed`,
      // --- FIX IS HERE ---
      html: `Your order has been placed successfully. ${
        voucherItems.length > 0
          ? `Your vouchers: ${voucherItems
              .map((v: VoucherItem) => `${v.code} (to: ${v.toName || "Self"})`)
              .join(", ")}`
          : ""
      }`,
    }).catch(console.error);
  }

  sendSubscribeEmail({
    to: "mnanajman@gmail.com", // This should be an env variable
    subject: `New Order ${orderId} Placed (${form.payment})`,
    // --- FIX IS HERE ---
    html: `Order #${orderId} placed by ${form.firstName} ${
      form.lastName
    }. Vouchers: ${voucherItems
      .map((v: VoucherItem) => `${v.code} (to: ${v.toName || "Self"})`)
      .join(", ")}`,
  }).catch(console.error);

  // ... rest of your function ...

    // This response is now the same for all payment methods
    return NextResponse.json(
      { message: "Order placed successfully", orderId, vouchers: voucherItems },
      { status: 200 }
    );
  } catch (err) {
    console.error("Checkout API Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}