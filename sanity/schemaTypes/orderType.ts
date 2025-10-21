// schemas/order.ts (Updated)
import { BasketIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";
// Assuming orderItem.ts is in the same directory or accessible
import { orderItemType } from './orderItem';
// Import your existing voucher schema
import { giftVoucherType } from '../schemaTypes/giftVoucher'; // <-- Import your existing voucher type

export const orderType = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  icon: BasketIcon,
  fields: [
    // 🔹 Order basics
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
      readOnly: ({ parent }) => parent?.status === "cancelled", // This is commented out to allow status changes
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Customer details
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    // 🔹 Address
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "district", title: "District", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "line1", title: "Address Line", type: "string" }),
        defineField({ name: "notes", title: "Notes", type: "text" }),
      ],
      // Make address optional if an order can be purely digital (vouchers)
      // hidden: ({ document }) => !document?.items || document?.items?.length === 0,
    }),

    // 🔹 Payment
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Cash on Delivery", value: "COD" },
          { title: "Bank Transfer", value: "BANK" },
          { title: "Online Payment", value: "CARD" }, // Added for vouchers
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Physical Products
    defineField({
      name: "items",
      title: "Ordered Items (Products)",
      type: "array",
      of: [{ type: orderItemType.name }],
      // Optional: Add a custom input component or hidden condition if you want to enforce
      // an order to be either physical OR vouchers, but not both at the schema level.
      // If an order can contain BOTH, then this is fine as is.
    }),

    // 🔹 Purchased Vouchers (NEW FIELD)
    defineField({
      name: "purchasedVouchers",
      title: "Purchased Vouchers",
      type: "array",
      of: [{ type: "reference", to: [{ type: giftVoucherType.name }] }], // Reference existing voucher documents
      description: "References to individual voucher documents purchased in this order.",
      // Optional: Condition to hide if `items` array has products, if you want mutually exclusive.
      // hidden: ({ document }) => document?.items?.length > 0,
    }),

    // 🔹 Totals
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      // Make shipping cost conditional if no physical items are purchased
      // hidden: ({ document }) => !document?.items || document?.items?.length === 0,
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],

  preview: {
    select: {
      name: "customerName",
      total: "total",
      orderId: "orderNumber",
      status: "status",
      firstProductName: "items.0.productName",     // product snapshot name
      firstProductImage: "items.0.productImage",   // product snapshot image
      firstVoucherCode: "purchasedVouchers.0.code", // voucher reference code
      firstVoucherValue: "purchasedVouchers.0.price", // voucher reference value
      firstVoucherFromName: "purchasedVouchers.0.fromName", // voucher reference fromName
    },
    prepare({ name, total, orderId, status, firstProductName, firstProductImage, firstVoucherCode, firstVoucherValue, firstVoucherFromName }) {
      let mainTitle = `${name} (${orderId || "No ID"})`;
      let subTitleParts: string[] = [`Total: Rs. ${total}`, status];
      let media = firstProductImage || undefined; // Start with product image

      // If no product image, but there's a voucher
      if (!media && firstVoucherCode) {
        // You'll need to fetch the voucher document's product image in a custom component,
        // or ensure `firstVoucherImage` is selected if your voucher schema had one.
        // For now, let's just indicate it's a voucher.
        subTitleParts.push(`Voucher: ${firstVoucherCode}`);
        // If your voucher product (from the `product` schema) has an image, you could try to get it here.
        // Or if the voucher itself has a dedicated display image field.
      } else if (firstProductName) {
        subTitleParts.push(`Item: ${firstProductName}`);
      }


      return {
        title: mainTitle,
        subtitle: subTitleParts.join(' — '),
        media: media, // This will be the image of the first physical product, or undefined if only vouchers.
      };
    },
  },
});