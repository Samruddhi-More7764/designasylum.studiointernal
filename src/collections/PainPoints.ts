import type { CollectionConfig } from "payload";
import { homepageClientLink } from "../fields/homepageClientLink";

export const PainPoints: CollectionConfig = {
  slug: "pain-points",
  defaultSort: "order",
  admin: { useAsTitle: "tag", defaultColumns: ["tag", "client", "order"] },
  access: { read: () => true },
  fields: [
    { name: "tag", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    { name: "resolution", type: "textarea", required: true },
    homepageClientLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
