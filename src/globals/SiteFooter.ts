import type { GlobalConfig } from "payload";

export const SiteFooter: GlobalConfig = {
  slug: "site-footer",
  access: { read: () => true },
  fields: [
    {
      name: "columns",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [{ name: "label", type: "text", required: true }],
        },
      ],
    },
    {
      name: "aiLinks",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
  ],
};
