import type { GlobalConfig } from "payload";

/**
 * The FAQ answer page at /faq/defense-tech.
 * Empty fields fall back to the designed page copy.
 */
export const FaqDetail: GlobalConfig = {
  slug: "faq-detail",
  label: "FAQ detail",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "slug",
              label: "URL slug",
              type: "text",
              admin: { description: "Matches the address, for example defense-tech." },
            },
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "question", label: "Title", type: "textarea" },
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
                { name: "anchor", label: "Id", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
