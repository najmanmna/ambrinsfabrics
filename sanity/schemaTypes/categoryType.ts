import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Categories & Subcategories",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    // --- NEW IMAGE FIELD ---
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      description: "This image will be used on the homepage 'Shop by Category' grid and as header backgrounds for category pages.",
      options: {
        hotspot: true, // Enables the UI to select the focal point of the image
      },
      fields: [
        // Good practice for SEO and accessibility
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe what is in the image (e.g., 'Pile of folded silk fabrics')",
        }),
      ],
    }),
    // -----------------------
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Leave empty for a main category. Assign a parent to make this a subcategory (or sub-subcategory).",
    }),
  ],
  preview: {
    select: {
      title: "name",
      parent: "parent.name",
      // Select the image for the preview thumbnail in Sanity Studio
      media: "image",
    },
    prepare({ title, parent, media }) {
      return {
        title,
        subtitle: parent ? `Subcategory of: ${parent}` : "Main Category",
        // Pass the media to the preview
        media: media,
      };
    },
  },
});