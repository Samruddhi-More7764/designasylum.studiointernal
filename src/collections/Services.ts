import type { CollectionConfig } from "payload";

/** Kept in schema so Payload push does not try to drop existing tables.
 *  Hidden from admin — the Services section reads from `src/data/services`. */
export const Services: CollectionConfig = {
  slug: "services",
  defaultSort: "order",
  admin: {
    hidden: true,
    useAsTitle: "name",
    defaultColumns: ["name", "icon", "order"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "tags",
      type: "array",
      required: true,
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "icon",
      type: "select",
      required: true,
      defaultValue: "stack",
      options: [
        { label: "Stack", value: "stack" },
        { label: "Website development", value: "grid" },
      ],
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
