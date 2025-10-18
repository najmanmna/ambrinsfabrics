import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

export const runtime = "nodejs";

const bankDetails = `M.J.M IFHAM
0110290723001
Amana Bank Dehiwala`;

// ------------------ MAIN HANDLER ------------------ //
export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN)
      return NextResponse.json({ error: "Missing SANITY_API_TOKEN" }, { status: 500 });

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.address ||
      !form?.district ||
      !form?.city ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
      return NextResponse.json({ error: "Duplicate order detected" }, { status: 429 });

    // Separate normal products vs vouchers
    const normalItems = items.filter((it: any) => !it.type || it.type !== "voucher");
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
        return NextResponse.json({ error: `Product not found: ${it.product?._id}` }, { status: 404 });

      const variant = fresh.variants?.find((v: any) => v._key === it.variant?._key) || fresh.variants?.[0];

      if (!variant)
        return NextResponse.json({ error: `Variant missing for ${fresh.name}` }, { status: 400 });

      if (variant.availableStock < it.quantity)
        return NextResponse.json(
          { error: `Insufficient stock for ${fresh.name} (${variant.variantName})` },
          { status: 409 }
        );

      it.product._rev = fresh._rev;
    }

    // ✅ Construct order doc
    const order = {
      _type: "order",
      orderNumber: orderId,
      status: "pending",
      orderDate: new Date().toISOString(),
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email || "",
      address: {
        district: form.district,
        city: form.city,
        line1: form.address,
        notes: form.notes || "",
      },
      paymentMethod: form.payment || "COD",
      items: normalItems.map((it: any) => {
        const fresh = freshProducts.find((p: any) => p._id === it.product._id);
        const matchedVariant = fresh?.variants?.find((v: any) => v._key === it.variant?._key);

        return {
          _type: "orderItem",
          _key: uuidv4(),
          product: { _type: "reference", _ref: it.product._id },
          variant: {
            variantKey: matchedVariant?._key || it.variant?._key,
            variantName: matchedVariant?.variantName || it.variant?.variantName || "",
          },
          quantity: it.quantity,
          price: it.finalPrice ?? it.product?.finalPrice ?? it.product?.price ?? 0,
          productName: fresh?.name || "Unknown",
          productImage:
            matchedVariant?.images?.[0]
              ? { _type: "image", asset: { _type: "reference", _ref: matchedVariant.images[0].asset._ref } }
              : undefined,
        };
      }),
      vouchers: voucherItems.map((v: any) => ({
        _type: "voucher",
        _key: v._id,
        code: v.voucherCode,
        isGift: v.isGift,
        fromName: v.fromName || "",
        toName: v.toName || "",
        product: v.product,
        price: v.price,
        redeemed: false,
      })),
      subtotal: normalItems.reduce(
        (acc: number, it: any) =>
          acc + (it.finalPrice ?? it.product?.finalPrice ?? it.product?.price ?? 0) * it.quantity,
        0
      ),
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
        orderNumber: orderId,
        redeemed: false,
        createdAt: v.createdAt,
      });
    });

    await tx.commit();

    // ✅ Send emails asynchronously
    if (form.email) {
      sendSubscribeEmail({
        to: form.email,
        subject: `Your Elvyn Order ${orderId}`,
        html: `Your order has been placed successfully. Your vouchers: ${voucherItems
          .map((v) => `${v.code} (to: ${v.toName || "Self"})`)
          .join(", ")}`,
      }).catch(console.error);
    }

    sendSubscribeEmail({
      to: "mnanajman@gmail.com",
      subject: `New Order ${orderId} Placed`,
      html: `Order #${orderId} placed by ${form.firstName} ${form.lastName}. Vouchers: ${voucherItems
        .map((v) => `${v.code} (to: ${v.toName || "Self"})`)
        .join(", ")}`,
    }).catch(console.error);

    return NextResponse.json(
      { message: "Order placed successfully", orderId, vouchers: voucherItems },
      { status: 200 }
    );
  } catch (err) {
    console.error("Checkout API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
