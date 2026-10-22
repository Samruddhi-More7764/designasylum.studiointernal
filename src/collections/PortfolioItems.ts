import type { CollectionConfig } from "payload";
import { homepageClientLink } from "../fields/homepageClientLink";
import {
  syncPortfolioItemToClient,
  syncPortfolioItemDeleteToClient,
} from "../cms/hooks/syncClientPlacements";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolio-items",
  defaultSort: "order",
  admin: {
    hidden: true,
    useAsTitle: "name",
    defaultColumns: ["name", "category", "client", "order"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [syncPortfolioItemToClient],
    afterDelete: [syncPortfolioItemDeleteToClient],
  },
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
