import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
export const runtime = 'edge';

export async function GET() {
  // Updated query to order by the creation timestamp (newest first)
  const query = `*[_type == "voucherTemplate"] | order(_createdAt desc) {
    _id,
    title,
    amount,
    description,
    image { asset->{url} }
  }`;

  const vouchers = await client.fetch(query);
  return NextResponse.json(vouchers);
}