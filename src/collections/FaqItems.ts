import type { CollectionConfig } from "payload";

export const FaqItems: CollectionConfig = {
  slug: "faq-items",
  defaultSort: "order",
  admin: { useAsTitle: "question", defaultColumns: ["question", "order"] },
  access: { read: () => true },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea" },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
