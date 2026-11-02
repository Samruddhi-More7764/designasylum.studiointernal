import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.question || "");
  if (source) data.slug = slugify(source);
  return data;
};

export const FaqDetails: CollectionConfig = {
  slug: "faq-details",
  labels: {
    singular: "FAQ Detail Page",
    plural: "FAQ Details",
  },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "slug"],
    description: "Create and edit full answer pages for FAQs (accessible at /faq/[slug]).",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "slug",
              label: "URL Slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description: "Matches the URL address, for example defense-tech (accessible at /faq/defense-tech).",
              },
            },
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "question", label: "Title / Question", type: "textarea", required: true },
            { name: "lead", label: "Introduction", type: "textarea" },
          ],
        },
        {
          label: "Sections",
          fields: [
            {
              name: "sections",
              type: "array",
              admin: {
                description: "Each section is a heading, its paragraph, and a table-of-contents item.",
              },
              fields: [
                { name: "anchor", label: "Anchor / Id", type: "text", required: true },
                { name: "title", label: "Heading", type: "text", required: true },
                { name: "body", label: "Content", type: "textarea", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

