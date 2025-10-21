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
      name: "voucherTemplate", // Changed from 'product' to 'voucherTemplate'
      title: "Voucher Template", // Updated title
      type: "reference",
      to: [{ type: "voucherTemplate" }], // Corrected reference type
      description: "Links to the voucher template this was purchased from (e.g., 'Rs. 5000 Voucher')."
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
      price: 'price',
      templateTitle: 'voucherTemplate.title'
    },
    prepare({ title, subtitle, price, templateTitle }) {
        return {
            title: title || 'No Code',
            subtitle: `${templateTitle || `Rs. ${price}`} ${subtitle ? `(To: ${subtitle})` : ''}`
        }
    }
  },
});
