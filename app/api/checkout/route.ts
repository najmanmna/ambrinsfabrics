// /app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

// Add this near your imports
interface VoucherItemForEmail { // Renamed to avoid confusion with internal Sanity types
  code: string;
  toName: string;
  // Add other properties if needed by the map
}

interface IncomingCartVoucher {
  productId: string; // The _id of the product that represents the voucher
  isGift: boolean;
  fromName?: string;
  toName?: string;
  price: number; // The value of the voucher
}

interface ProcessedVoucherForSanity {
  _id: string; // Will be the _id of the new voucher document
  _type: "voucher";
  code: string;
  isGift: boolean;
  fromName?: string;
  toName?: string;
  product: { _type: "reference", _ref: string }; // Reference to the product document (e.g., "Gift Voucher")
  price: number; // The value of the voucher
  orderNumber?: string; // Will be added later
  redeemed: boolean;
  createdAt: string;
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

    // ✅ IMPORTANT: Generate _id for each voucher document NOW
    const processedVouchers: ProcessedVoucherForSanity[] = items
      .filter((it: any) => it.type === "voucher")
      .flatMap((it: { vouchers: IncomingCartVoucher[] }) =>
        it.vouchers.map((v: IncomingCartVoucher) => {
          const voucherDocId = uuidv4(); // Generate unique _id for the Sanity voucher document
          return {
            _id: voucherDocId, // Use this for Sanity document
            _type: "voucher",
            code: `VCHR-${uuidv4().split("-")[0].toUpperCase()}`, // Generate unique code
            isGift: v.isGift,
            fromName: v.fromName || "",
            toName: v.toName || "",
            product: { _type: "reference", _ref: v.productId }, // Reference to the "Gift Voucher" product
            price: v.price, // Value of the voucher
            redeemed: false,
            createdAt: new Date().toISOString(),
            // orderNumber will be added when creating the order document
          };
        })
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
        { error: "Missing required customer details or empty cart" },
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

    // --- Smart Status ---
    // For now, assume "CARD" is processed, others are pending.
    let orderStatus = "pending";
    if (form.payment === "CARD") {
      orderStatus = "processing";
    }

    // ✅ Construct order doc
    const orderDoc = { // Renamed to avoid conflict with `order` in tx.create
      _type: "order",
      orderNumber: orderId,
      status: orderStatus,
      orderDate: new Date().toISOString(),
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email || "",
      address: hasPhysicalProducts
        ? {
            district: form.district,
            city: form.city,
            line1: form.address,
            notes: form.notes || "",
          }
        : undefined,
      paymentMethod: form.payment,
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
      // ✅ CORRECTED: References to the created voucher documents
      purchasedVouchers: processedVouchers.map((v) => ({
        _type: "reference",
        _ref: v._id, // This is the _id we generated for the voucher document
        _key: uuidv4(), // Each item in an array needs a _key
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

    // ✅ Transaction — Create order + update stock + create vouchers
    const tx = backendClient.transaction();

    // 1. Create the order document (with references to vouchers)
    tx.create(orderDoc); // Use the renamed orderDoc

    // 2. Patch stock for normal items
    normalItems.forEach((it: any) => {
      const variantKey = it.variant?._key;
      if (!variantKey) throw new Error("Variant key missing for stock update");

    // ✅ FIXED CODE
tx.patch(it.product._id, (p) =>
  p
    // 1. If stockOut is blank, set it to 0 first
    .setIfMissing({ [`variants[_key=="${variantKey}"].stockOut`]: 0 }) 
    // 2. THEN increment it
    .inc({ [`variants[_key=="${variantKey}"].stockOut`]: it.quantity })
    .ifRevisionId(it.product._rev)
);
    });

    // 3. Create individual voucher documents
    processedVouchers.forEach((v: ProcessedVoucherForSanity) => {
      tx.create({
        ...v, // Use the pre-constructed voucher object
        orderNumber: orderId, // Link to the order
      });
    });

    await tx.commit();

    // ✅ Send emails asynchronously
    if (form.email) {
      sendSubscribeEmail({
        to: form.email,
        subject: `Your Order ${orderId} is Confirmed`,
        html: `Your order has been placed successfully. ${
          processedVouchers.length > 0
            ? `Your vouchers: ${processedVouchers // Changed to processedVouchers
                .map((v: ProcessedVoucherForSanity) => `${v.code} (to: ${v.toName || "Self"})`)
                .join(", ")}`
            : ""
        }`,
      }).catch(console.error);
    }

    sendSubscribeEmail({
      to: "mnanajman@gmail.com", // This should be an env variable
      subject: `New Order ${orderId} Placed (${form.payment})`,
      html: `Order #${orderId} placed by ${form.firstName} ${
        form.lastName
      }. Vouchers: ${processedVouchers // Changed to processedVouchers
        .map((v: ProcessedVoucherForSanity) => `${v.code} (to: ${v.toName || "Self"})`)
        .join(", ")}`,
    }).catch(console.error);

    // This response is now the same for all payment methods
    return NextResponse.json(
      { message: "Order placed successfully", orderId, vouchers: processedVouchers }, // Return processedVouchers
      { status: 200 }
    );
  } catch (err) {
    console.error("Checkout API Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}