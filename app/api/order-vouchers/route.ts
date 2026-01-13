// import { NextResponse } from "next/server";
// import { backendClient } from "@/sanity/lib/backendClient";
// import { groq } from "next-sanity"; // Import groq

export const runtime = "edge";

// // This is the correct GROQ query.
// // It fetches the order and "dereferences" (follows) the product
// // reference inside each order item, then follows the category
// // reference to get its name.
// const ORDER_DETAILS_QUERY = groq`{
//   "order": *[_type == "order" && orderNumber == $orderNumber][0]{
//     "items": items[]{
//       product->{ // <-- Follow the product reference
//         "categoryName": category->name // <-- Follow category ref and get its name
//       }
//     }
//   },
//   "vouchers": *[_type == "voucher" && orderNumber == $orderNumber]{
//     code,
//     isGift,
//     fromName,
//     toName,
//     "productName": product->name,
//     price,
//     redeemed,
//     createdAt
//   }
// }`;

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const orderNumber = url.searchParams.get("orderNumber");

//     if (!orderNumber) {
//       return NextResponse.json(
//         { error: "Missing orderNumber" },
//         { status: 400 }
//       );
//     }

//     const data = await backendClient.fetch(
//       ORDER_DETAILS_QUERY,
//       { orderNumber }
//     );

//     // data.order.items will be an array like:
//     // [ { product: { categoryName: 'Fabrics' } }, { product: { categoryName: 'Homeware' } } ]
//     const orderItems = data?.order?.items || [];
//     const vouchers = data?.vouchers || [];

//     // --- Logic to check item types ---

//     // Check if any item's category name is 'Fabrics'
//     // (This assumes your main category is named 'Fabrics' in Sanity)
//     const hasFabrics = orderItems.some(
//       (item: any) => item.product && item.product.categoryName === 'Fabrics'
//     );

//     // Check if any item's category name exists AND is NOT 'Fabrics'
//     const hasOtherItems = orderItems.some(
//       (item: any) => item.product && 
//                      item.product.categoryName && 
//                      item.product.categoryName !== 'Fabrics'
//     );

//     // --- End of logic ---

//     return NextResponse.json(
//       {
//         vouchers,
//         hasFabrics,
//         hasOtherItems
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("Order vouchers API error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }