import type { Field, Tab } from "payload";

export const seoFields: Field[] = [
  {
    name: "metaTitle",
    label: "Meta Title",
    type: "text",
    admin: {
      description:
        "Page title for search engines and social shares (50–60 characters recommended). If left empty, falls back to the page headline.",
    },
  },
  {
    name: "metaDescription",
    label: "Meta Description",
    type: "textarea",
    admin: {
      description:
        "Snippet shown in search engine results and social cards (120–160 characters recommended). If left empty, falls back to the intro or lead text.",
    },
  },
  {
    name: "ogImage",
    label: "Open Graph (Social Share) Image",
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image/" } },
    admin: {
      description:
        "Preview image when this page is shared on LinkedIn, Twitter/X, WhatsApp, Slack, etc. Recommended dimensions: 1200 × 630 px.",
    },
  },
  {
    name: "noIndex",
    label: "Hide from Search Engines (noindex)",
    type: "checkbox",
    defaultValue: false,
    admin: {
      description:
        "Instructs search engine crawlers not to index this page (useful for drafts, unlaunched offerings, or internal testing).",
    },
  },
];

export const seoTab: Tab = {
  label: "SEO",
  fields: seoFields,
};

