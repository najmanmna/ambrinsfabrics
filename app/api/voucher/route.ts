import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const query = `*[_type == "voucherTemplate"]{
    _id, title, amount, description, image { asset->{url} }
  }`;

  const vouchers = await client.fetch(query);
  return NextResponse.json(vouchers);
}
