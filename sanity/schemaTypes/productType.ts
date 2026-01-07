import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  groups: [
    { name: "main", title: "Main Info" },
    { name: "sensory", title: "Sensory Profile" },
    { name: "inventory", title: "Stock & Variants" },
  ],
  fields: [
    // --- 1. CORE INFO ---
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // --- 2. CATEGORIZATION ---
    // Mandatory Level 1
    defineField({
      name: "category",
      title: "Main Category",
      type: "reference",
      group: "main",
      to: [{ type: "category" }],
      options: { filter: "!defined(parent)" }, 
      validation: (Rule) => Rule.required(),
    }),

    // Optional Level 2
    defineField({
      name: "subcategory",
      title: "Subcategory (Optional)",
      type: "reference",
      group: "main",
      to: [{ type: "category" }],
      description: "Leave empty if not needed.",
      options: {
        filter: ({ document }) => {
          const categoryId = (document?.category as { _ref: string })?._ref;
          return categoryId
            ? { filter: `parent._ref == $categoryId`, params: { categoryId } }
            : { filter: "false" };
        },
      },
      readOnly: ({ document }) => !document?.category,
    }),

    // Flexible Marketing Collections
    defineField({
      name: "collections",
      title: "Marketing Collections",
      type: "array",
      group: "main",
      description: "E.g. 'Bridal Edit', 'New Arrivals'",
      of: [{ type: "reference", to: [{ type: "collection" }] }], 
    }),

    // --- 3. PRICING ---
    defineField({
      name: "price",
      title: "Price per Meter (LKR)",
      type: "number",
      group: "main",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount %",
      type: "number",
      group: "main",
    }),

    // --- 4. SENSORY PROFILE ---
    defineField({
      name: "handFeel",
      title: "Hand-Feel",
      type: "string",
      group: "sensory",
      options: {
        list: [
          { title: "Silky & Smooth", value: "Silky & Smooth" },
          { title: "Crisp & Structured", value: "Crisp & Structured" },
          { title: "Soft & Airy", value: "Soft & Airy" },
          { title: "Textured & Grainy", value: "Textured & Grainy" },
          { title: "Heavy & Rich", value: "Heavy & Rich" },
        ],
      },
    }),
    defineField({
      name: "drape",
      title: "Drape",
      type: "string",
      group: "sensory",
      options: {
        list: [
          { title: "Fluid", value: "Fluid" },
          { title: "Structured", value: "Structured" },
          { title: "Voluminous", value: "Voluminous" },
          { title: "Stiff", value: "Stiff" },
        ],
      },
    }),
    defineField({
      name: "translucency",
      title: "Translucency",
      type: "string",
      group: "sensory",
      options: {
        list: [
          { title: "Opaque", value: "Opaque" },
          { title: "Semi-Sheer", value: "Semi-Sheer" },
          { title: "Sheer", value: "Sheer" },
        ],
      },
    }),

    // --- 5. VARIANTS ---
    defineField({
      name: "variants",
      title: "Color Variants",
      type: "array",
      group: "inventory",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "variantName",
              title: "Color Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "openingStock",
              title: "Stock (Meters)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "variantName",
              stock: "openingStock",
              media: "images.0.asset",
            },
            prepare({ title, stock, media }) {
              return {
                title,
                subtitle: `${stock} Meters`,
                media,
              };
            },
          },
        },
      ],
    }),

    // --- 6. DESCRIPTION ---
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent", 
      group: "main",
    }),

    defineField({
      name: "isFeatured",
      title: "Feature on Homepage",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      media: "variants.0.images.0.asset",
    },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: `LKR ${price} / m`,
        media: media || TrolleyIcon,
      };
    },
  },
});