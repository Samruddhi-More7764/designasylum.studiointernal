import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

/**
 * The clients index at /clients.
 * Empty fields fall back to the designed page.
 * The "Want to be the next case study?" line and Book an intro stay in code.
 */
export const ClientsIndex: GlobalConfig = {
  slug: "clients-index",
  label: "Clients page",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "heading", label: "Heading", type: "textarea" },
          ],
        },
        {
          label: "Cards",
          fields: [
            {
              name: "cards",
              type: "array",
              fields: [
                {
                  name: "client",
                  label: "Select Client",
                  type: "relationship",
                  relationTo: "clients",
                  admin: {
                    description:
                      "Select a client from Collections > Clients. Link (/clients/[slug]), name, and image will auto-populate if left empty.",
                  },
                },
                {
                  ...image,
                  admin: {
                    description: "Leave empty to use client hero image.",
                  },
                },
                {
                  name: "name",
                  type: "text",
                  admin: {
                    description: "Leave empty to use client name.",
                  },
                },
                { name: "service", label: "Service line", type: "text" },
                {
                  name: "order",
                  label: "Display order",
                  type: "number",
                  defaultValue: 0,
                  admin: {
                    description: "Card position order (lower numbers appear first).",
                  },
                },
              ],
            },

          ],
        },
      ],
    },
  ],
};
