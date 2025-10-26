import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      description: "E.g., 'Cotton Indigo Block Print' or 'Jaipur Kantha Quilt'",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ✨ UPDATED: This dropdown will ONLY show main categories.
    defineField({
      name: "category",
      title: "Main Category",
      type: "reference",
      to: [{ type: "category" }],
      // This filter ensures only documents that DO NOT have a parent are shown.
      options: {
        filter: "!defined(parent)",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ✨ UPDATED: This dropdown will be filtered based on the main category selection.
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: ({ document }) => {
          // Get the selected category's ID safely using optional chaining
           const categoryId = (document?.category as { _ref: string })?._ref;

          // If no category is selected, return an empty list
          if (!categoryId) {
            return { filter: "false" };
          }

          // Return the filter to find subcategories of the selected main category
          return {
            filter: `parent._ref == $categoryId`,
            params: { categoryId },
          };
        },
      },
      // ✅ Use optional chaining here as well for safety
      readOnly: ({ document }) => !document?.category,
    }),

    // 🔹 Variants: Each pattern/style has its own stock and images.
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      description:
        "Add at least one variant. For products without different patterns, the variant name can be the same as the product name.",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "variantName",
              title: "Variant Name / Pattern",
              type: "string",
              description: "E.g., 'Maroon Leaf Pattern' or 'Blue Floral Motif'",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "openingStock",
              title: "Opening Stock",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "stockOut",
              title: "Stock Out",
              type: "number",
              initialValue: 0,
              readOnly: false, // Should be managed by your order logic, not manually.
            }),
            defineField({
              name: "images",
              title: "Images for this Variant",
              type: "array",
              of: [{ type: "image", options: { hotspot: true,accept: "image/jpeg, image/png, image/webp, image/heic, image/heif, .heic" } }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "variantName",
              opening: "openingStock",
              out: "stockOut",
              media: "images.0.asset",
            },
            prepare({ title, opening, out, media }) {
              const available = (opening || 0) - (out || 0);
              return {
                title,
                subtitle: `Available: ${available}`,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "price",
      title: "Price (LKR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount Percentage (%)",
      type: "number",
      description: "This is applied on the base price. E.g., enter 10 for 10% off.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "material",
      title: "Material",
      type: "string",
      description: "E.g., '100% Cotton', 'Silk Blend'",
    }),

    defineField({
      name: "width",
      title: "Width (inches)",
      type: "number",
      description: "Only applicable for fabrics sold by the meter.",
    }),

    defineField({
      name: "useCases",
      title: "Suggested Use Cases",
      type: "text",
      description: "E.g., 'Great for Sarees, Tunics, Kurtas, Dresses, and Tops...'",
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to feature this product on the homepage.",
      initialValue: false,
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "blockContent", // Use blockContent for rich text
      description: "Tell the story behind this product, its craft, and details.",
    }),
  ],

  preview: {
    select: {
      title: "name",
      category: "category.name",
      media: "variants.0.images.0.asset",
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category ? `in ${category}` : "Product",
        media: media || TrolleyIcon,
      };
    },
  },
});