import type { CollectionConfig } from "payload";

export const ClientLogos: CollectionConfig = {
  slug: "client-logos",
  defaultSort: "order",
  admin: { useAsTitle: "name", defaultColumns: ["name", "order"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    { name: "width", type: "number", required: true, defaultValue: 192 },
    { name: "height", type: "number", required: true, defaultValue: 49 },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
