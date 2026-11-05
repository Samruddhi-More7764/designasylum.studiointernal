import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

const postFields: Field[] = [
  {
    name: "post",
    label: "Select Blog Post",
    type: "relationship",
    relationTo: "blog-posts",
    admin: {
      description:
        "Select a post from Collections > Blog Posts. Title, date, category, image, and link will auto-fill from the selected post.",
    },
  },
  {
    name: "href",
    label: "Custom Link URL",
    type: "text",
    admin: {
      description:
        "Optional custom route override. Leave empty to automatically link to /blogs/[slug] of the selected post.",
    },
  },
  {
    ...image,
    admin: {
      description: "Leave empty to use the image from the selected blog post.",
    },
  },
  {
    name: "title",
    type: "text",
    admin: {
      description: "Leave empty to use the title from the selected blog post.",
    },
  },
  {
    name: "date",
    type: "text",
    admin: {
      description: "Leave empty to use the date from the selected blog post.",
    },
  },
  {
    name: "category",
    type: "select",
    options: ["Brand", "Digital", "Strategy", "Studio"],
    admin: {
      description:
        "Which filter this post appears under. Leave empty to use the category from the selected blog post.",
    },
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
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data;
        const autofillPosts = async (rows: unknown) => {
          if (!Array.isArray(rows)) return;
          for (const row of rows) {
            if (!row || !row.post) continue;
            const postId = typeof row.post === "object" ? row.post.id : row.post;
            if (!postId) continue;
            try {
              const post = await req.payload.findByID({
                collection: "blog-posts",
                id: postId,
                depth: 0,
              });
              if (post) {
                if (!row.href && post.slug) {
                  const cleanSlug = String(post.slug).replace(/^\/+|\/+$/g, "").trim();
                  row.href = `/blogs/${cleanSlug}`;
                }
                if (!row.title && post.title) row.title = post.title;
                if (!row.date && post.date) row.date = post.date;
                if (!row.category && post.category) row.category = post.category;
                const postImg = post.heroImage || post.image;
                if (!row.image && postImg) row.image = postImg;
                if (!row.badge && post.badge) row.badge = post.badge;
                if (!row.badgeIcon && post.badgeIcon) row.badgeIcon = post.badgeIcon;
              }
            } catch {
              // Ignore lookup errors
            }
          }
        };
        await autofillPosts(data.featuredPosts);
        await autofillPosts(data.posts);
        return data;
      },
    ],
  },
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
