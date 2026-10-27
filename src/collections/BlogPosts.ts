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
  const source = String(data.slug || data.title || "");
  if (source) data.slug = slugify(source);
  return data;
};

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  labels: {
    singular: "Blog Post",
    plural: "Blog Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date", "slug"],
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL slug, e.g. 'branding-agency-in-pune' (accessible at /blogs/[slug]).",
      },
    },
    {
      name: "date",
      type: "text",
      admin: { description: "e.g. 'September 7, 2026'" },
    },
    {
      name: "readTime",
      label: "Read time",
      type: "text",
      admin: { description: "e.g. '10 min read'" },
    },
    {
      name: "category",
      type: "select",
      options: ["Brand", "Digital", "Strategy", "Studio"],
      admin: { description: "Category filter." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image/" } },
    },
    {
      name: "href",
      label: "Custom URL override",
      type: "text",
      admin: {
        description: "Optional. Leave empty to automatically use /blogs/[slug].",
      },
    },
    {
      name: "badge",
      label: "Badge",
      type: "text",
      admin: { description: "Optional card badge, e.g. 'Hot Right Now'" },
    },
    {
      name: "badgeIcon",
      label: "Badge icon",
      type: "select",
      options: [
        { label: "Rocket", value: "rocket" },
        { label: "Fire", value: "fire" },
        { label: "Medal", value: "medal" },
        { label: "Smile", value: "smile" },
        { label: "Timer", value: "timer" },
      ],
    },
  ],
};
