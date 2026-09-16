import type { CollectionConfig } from "payload";

const HUB_HREF = "/clients/sevenloop";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolio-items",
  defaultSort: "order",
  admin: { useAsTitle: "name", defaultColumns: ["name", "category", "href", "order"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "category", type: "text", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: { mimeType: { contains: "image" } },
    },
    { name: "alt", type: "text", required: true },
    {
      name: "href",
      type: "text",
      required: true,
      defaultValue: HUB_HREF,
      admin: {
        description:
          "Where this card links. Does not create a new page — edit Client Hub under Globals. Example: /clients/sevenloop",
      },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
