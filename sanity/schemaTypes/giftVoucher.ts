// schemas/voucher.ts
import { defineType, defineField } from "sanity";

export const giftVoucherType = defineType({
  name: "voucher",
  title: "Vouchers Purchased",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Voucher Code",
      type: "string",
      description: "Unique voucher code",
    }),
    defineField({
      name: "isGift",
      title: "Is Gift",
      type: "boolean",
      description: "Whether this voucher is a gift",
      initialValue: false,
    }),
    defineField({
      name: "fromName",
      title: "From Name",
      type: "string",
      hidden: ({ parent }) => !parent?.isGift,
    }),
    defineField({
      name: "toName",
      title: "To Name",
      type: "string",
      hidden: ({ parent }) => !parent?.isGift,
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      description: "The order this voucher belongs to",
    }),
    defineField({
      name: "redeemed",
      title: "Redeemed",
      type: "boolean",
      initialValue: false,
      description: "Whether the voucher has been used",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "code",
      subtitle: "toName",
    },
  },
});
