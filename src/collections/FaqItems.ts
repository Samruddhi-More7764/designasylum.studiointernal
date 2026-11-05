import type { CollectionConfig } from "payload";

export const FaqItems: CollectionConfig = {
  slug: "faq-items",
  defaultSort: "createdAt",
  admin: { useAsTitle: "question", defaultColumns: ["question", "createdAt"] },
  access: {
    read: () => true,
    create: () => false,
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea" },
  ],
};
