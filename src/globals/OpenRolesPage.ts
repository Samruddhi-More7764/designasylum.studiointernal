import type { GlobalConfig } from "payload";
import { seoTab } from "../fields/seoFields";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Job openings at /open-roles.
 * Empty fields fall back to the designed page copy.
 * Category counts are counted from the roles list.
 */
export const OpenRolesPage: GlobalConfig = {
  slug: "open-roles-page",
  label: "Open roles",
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (Array.isArray(data.categories)) {
          data.categories = data.categories.map((cat: Record<string, unknown>) => {
            if (!cat) return cat;
            const label = typeof cat.label === "string" ? cat.label.trim() : "";
            const rawId = typeof cat.categoryId === "string" ? cat.categoryId.trim() : "";
            const categoryId = rawId ? slugify(rawId) : slugify(label);
            return {
              ...cat,
              categoryId,
            };
          });
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Heading",
          fields: [
            { name: "titleBefore", label: "Title", type: "text" },
            { name: "titleAccent", label: "Italic word", type: "text" },
            { name: "titleAfter", label: "Title ending", type: "text" },
          ],
        },
        {
          label: "Categories",
          fields: [
            {
              name: "categories",
              type: "array",
              admin: { description: "Category filters shown on /open-roles. Put 'All roles' first (ID: 'all'). Counts are automatically calculated from the roles list." },
              fields: [
                {
                  name: "categoryId",
                  label: "Category ID / Slug",
                  type: "text",
                  admin: {
                    description:
                      "Unique identifier used to match roles (e.g. 'all', 'ui-ux', 'brand', 'web', 'engineering'). Leave empty to automatically generate from the label.",
                    placeholder: "e.g. engineering (or leave blank to auto-generate)",
                  },
                },
                { name: "label", label: "Display Label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Roles",
          fields: [
            { name: "dutiesHeading", label: "“What you’ll do” heading", type: "text" },
            { name: "lookingHeading", label: "“What we’re looking for” heading", type: "text" },
            {
              name: "roles",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "slug",
                  type: "text",
                  admin: { description: "URL for this role, after /open-roles/. Apply on the list opens this page." },
                },
                { name: "breadcrumb", label: "Breadcrumb", type: "text" },
                { name: "summary", type: "textarea", required: true },
                {
                  name: "category",
                  label: "Category ID",
                  type: "text",
                  required: true,
                  admin: {
                    description:
                      "Category ID this role belongs to (e.g. 'ui-ux', 'brand', 'web', 'video', 'content', 'project', 'marketing', or any custom category ID defined under Categories).",
                    placeholder: "e.g. ui-ux",
                  },
                },
                { name: "location", label: "Card location", type: "text" },
                { name: "employment", label: "Card employment type", type: "text" },
                { name: "experience", label: "Card experience", type: "text" },
                { name: "applyLabel", label: "List button", type: "text" },
                { name: "detailLocation", label: "Detail location", type: "text" },
                { name: "detailExperience", label: "Detail experience", type: "text" },
                { name: "detailType", label: "Detail type", type: "text" },
                {
                  name: "responsibilities",
                  label: "What you’ll do",
                  type: "textarea",
                  admin: {
                    description: "Single container for all pointers and texts. Enter one pointer per line.",
                  },
                },
                {
                  name: "requirements",
                  label: "What we’re looking for",
                  type: "textarea",
                  admin: {
                    description: "Single container for all pointers and texts. Enter one pointer per line.",
                  },
                },
                {
                  name: "content",
                  label: "Additional role details / text",
                  type: "textarea",
                  admin: {
                    description: "Optional: Single container to add any extra pointers or paragraphs for this role.",
                  },
                },
                { name: "applyNowLabel", label: "Apply now label", type: "text" },
                {
                  name: "applyNowHref",
                  label: "Apply now link",
                  type: "text",
                  admin: { description: "Where Apply now goes. Defaults to the careers form." },
                },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
};
