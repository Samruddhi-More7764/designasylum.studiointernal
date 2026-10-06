import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

const postFields: Field[] = [
  image,
  { name: "title", type: "text", required: true },
  { name: "date", type: "text" },
  {
    name: "category",
    type: "select",
    options: ["Brand", "Digital", "Strategy", "Studio"],
    admin: { description: "Which filter this post appears under. All always shows every post." },
  },
  {
    name: "href",
    label: "URL",
    type: "text",
    admin: { description: "Where the card goes." },
  },
  { name: "badge", label: "Badge", type: "text" },
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
];

/**
 * The blog index at /blogs.
 * Empty fields fall back to the designed page copy.
 */
export const BlogIndex: GlobalConfig = {
  slug: "blog-index",
  label: "Blog",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "titleBefore", label: "Title", type: "text" },
            { name: "titleAccent", label: "Italic word", type: "text" },
            { name: "titleAfter", label: "Title ending", type: "text" },
            { name: "intro", label: "Introduction", type: "textarea" },
            {
              ...image,
              name: "heroImage",
              label: "Image",
              admin: { description: "The wide image under the heading. Leave empty to keep the black block." },
            },
          ],
        },
        {
          label: "Featured",
          fields: [
            { name: "featuredBefore", label: "Heading", type: "text" },
            { name: "featuredAccent", label: "Italic word", type: "text" },
            { name: "featuredAfter", label: "Heading ending", type: "text" },
            {
              name: "featuredPosts",
              label: "Posts",
              type: "array",
              fields: postFields,
            },
          ],
        },
        {
          label: "Listing",
          fields: [
            { name: "listingBefore", label: "Heading", type: "text" },
            { name: "listingAccent", label: "Italic word", type: "text" },
            { name: "listingAfter", label: "Heading ending", type: "text" },
            {
              name: "categories",
              type: "array",
              admin: { description: "Filter labels. Include All first." },
              fields: [{ name: "label", type: "text", required: true }],
            },
            {
              name: "posts",
              type: "array",
              fields: postFields,
            },
          ],
        },
      ],
    },
  ],
};
