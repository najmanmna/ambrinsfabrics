import { defineType, defineField } from "sanity";

export const voucherTemplateType = defineType({
  name: "voucherTemplate",
  title: "Voucher Template",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "amount",
      title: "Voucher Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Voucher Image",
      type: "image",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "amount",
      media: "image",
    },
  },
});
