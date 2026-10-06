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
                  ...image,
                  admin: {
                    description: "The picture on the card. Leave empty to keep the DirectMeds cover.",
                  },
                },
                { name: "name", type: "text", required: true },
                { name: "service", label: "Service line", type: "text" },
                {
                  name: "href",
                  label: "URL",
                  type: "text",
                  admin: {
                    description: "Where the card goes. Leave empty until that page exists.",
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
