import type { GlobalConfig } from "payload";

/**
 * The FAQ index at /faq.
 * Chip counts are counted from the questions. Empty fields fall back to the page.
 * Do not add answers that are not already on the page.
 */
export const FaqPage: GlobalConfig = {
  slug: "faq-page",
  label: "FAQ",
  access: { read: () => true },
  fields: [
    { name: "titleBefore", type: "text", admin: { hidden: true } },
    { name: "titleAccent", type: "text", admin: { hidden: true } },
    { name: "titleAfter", type: "text", admin: { hidden: true } },
    {
      type: "tabs",
      tabs: [
        {
          label: "Categories",
          fields: [
            {
              name: "categories",
              type: "array",
              fields: [
                {
                  name: "categoryId",
                  label: "Id",
                  type: "select",
                  required: true,
                  options: [
                    { label: "All", value: "all" },
                    { label: "About us", value: "about" },
                    { label: "Branding & strategy", value: "branding" },
                    { label: "Website & development", value: "website" },
                    { label: "Marketing", value: "marketing" },
                  ],
                },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Questions",
          fields: [
            {
              name: "entries",
              type: "array",
              fields: [
                { name: "entryId", label: "Id", type: "text", required: true },
                { name: "question", type: "text", required: true },
                {
                  name: "category",
                  type: "select",
                  required: true,
                  options: [
                    { label: "About us", value: "about" },
                    { label: "Branding & strategy", value: "branding" },
                    { label: "Website & development", value: "website" },
                    { label: "Marketing", value: "marketing" },
                  ],
                },
                {
                  name: "answer",
                  type: "textarea",
                  admin: { description: "Leave empty to keep the question closed." },
                },
                {
                  name: "detailSlug",
                  label: "Full answer URL",
                  type: "text",
                  admin: {
                    description:
                      "Slug for Read full answer, for example defense-tech. Leave empty to hide the link.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
