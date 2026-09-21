import type { CollectionConfig } from "payload";
import { homepageClientLink } from "../fields/homepageClientLink";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolio-items",
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "client", "order"],
  },
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
    homepageClientLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
