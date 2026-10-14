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
    {
      name: "section",
      type: "select",
      options: [
        { label: "Logo strip under the hero", value: "hero" },
        { label: "8 in 10 clients", value: "clients" },
      ],
      admin: { hidden: true },
    },
    { name: "width", type: "number", required: true, defaultValue: 192 },
    { name: "height", type: "number", required: true, defaultValue: 49 },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
