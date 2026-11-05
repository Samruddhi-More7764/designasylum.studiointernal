import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import {
  blogArticleAuthorFields,
  blogArticleContentFields,
  blogArticleFaqFields,
  blogArticleHeroFields,
  blogArticleRelatedFields,
  blogArticleTopicFields,
} from "../fields/blogArticleFields";
import {
  autofillBlogAuthor,
  autofillBlueprintRelatedBlogs,
} from "../cms/sharedBlueprintAutofill";

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

const autofillBlogRelated: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (data?.relatedBlogs && req?.payload) {
    await autofillBlueprintRelatedBlogs(data.relatedBlogs, req.payload);
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
    beforeValidate: [ensureSlug, autofillBlogAuthor, autofillBlogRelated],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Post title (used for admin listing, SEO, and card display).",
      },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "URL slug, e.g. 'sevenloop-brand-website-redesign' (accessible at /blogs/[slug]).",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            ...blogArticleHeroFields,
            {
              name: "date",
              type: "text",
              admin: { description: "Publish date, e.g. 'September 7, 2026'" },
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
              label: "Card Image",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image/" } },
              admin: { description: "Listing card thumbnail image. Leave empty to use the Hero Image." },
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
