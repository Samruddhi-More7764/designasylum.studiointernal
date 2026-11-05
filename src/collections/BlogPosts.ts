import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import {
  blogArticleAuthorFields,
  blogArticleContentFields,
  blogArticleFaqFields,
  blogArticleHeroFields,
  blogArticleRelatedFields,
  blogArticleTopicFields,
} from "../fields/blogArticleFields";

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

const autofillRelatedHeroImage: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.relatedBlogs || !Array.isArray(data.relatedBlogs)) return data;
  for (const row of data.relatedBlogs) {
    if (!row || !row.post) continue;
    const postId = typeof row.post === "object" ? row.post.id : row.post;
    if (!postId) continue;
    if (!row.image) {
      try {
        const linked = await req.payload.findByID({
          collection: "blog-posts",
          id: postId,
          depth: 0,
        });
        if (linked) {
          const defaultImage = linked.heroImage || linked.image;
          if (defaultImage) {
            row.image = defaultImage;
          }
        }
      } catch {
        // ignore lookup errors
      }
    }
  }
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
    description: "Create and edit complete blog articles with rich blocks, author, FAQs, and related posts.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug, autofillRelatedHeroImage],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Card / Listing",
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
                description:
                  "URL slug, e.g. 'branding-agency-in-pune' (accessible at /blogs/[slug]).",
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
              admin: { description: "Listing card thumbnail image." },
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
        },
        {
          label: "Hero",
          fields: blogArticleHeroFields,
        },
        {
          label: "Article",
          fields: blogArticleContentFields,
        },
        {
          label: "FAQs",
          fields: blogArticleFaqFields,
        },
        {
          label: "Author",
          fields: blogArticleAuthorFields,
        },
        {
          label: "Topics",
          fields: blogArticleTopicFields,
        },
        {
          label: "Related blogs",
          fields: blogArticleRelatedFields,
        },
      ],
    },
  ],
};
