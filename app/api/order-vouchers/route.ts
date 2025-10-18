// /app/api/order-vouchers/route.ts
import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderNumber = url.searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
    }

    // Fetch vouchers linked to this order
    const vouchers = await backendClient.fetch(
      `*[_type == "voucher" && orderNumber == $orderNumber]{
        code,
        isGift,
        fromName,
        toName,
        "productName": product->name,
        price,
        redeemed,
        createdAt
      }`,
      { orderNumber }
    );

    return NextResponse.json({ vouchers }, { status: 200 });
  } catch (err) {
    console.error("Order vouchers API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
