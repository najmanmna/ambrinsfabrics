import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const collectionType = defineType({
  name: "collection",
  title: "Collections",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Collection Name",
      type: "string",
      description: "E.g., 'The Bridal Edit', 'Summer Linens', 'Eid 2026'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A short blurb for the Collection page header or SEO.",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      description: "The main banner image for this collection's page.",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});