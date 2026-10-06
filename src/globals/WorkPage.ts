import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

/**
 * The work index at /work.
 * Empty fields fall back to the designed page copy.
 */
export const WorkPage: GlobalConfig = {
  slug: "work-page",
  label: "Work",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "heading", label: "Heading", type: "textarea" },
          ],
        },
        {
          label: "Filters",
          fields: [
            {
              name: "filters",
              type: "array",
              admin: { description: "Include All first. Chip counts are not used here." },
              fields: [
                {
                  name: "filterId",
                  label: "Id",
                  type: "select",
                  required: true,
                  options: [
                    { label: "All", value: "all" },
                    { label: "Fashion & Beauty", value: "fashion" },
                    { label: "Health & Wellness", value: "health" },
                    { label: "Technology & Innovation", value: "technology" },
                    { label: "Finance & Business", value: "finance" },
                    { label: "Home & Living", value: "home" },
                    { label: "Industry & Sustainability", value: "industry" },
                  ],
                },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Projects",
          fields: [
            {
              name: "projects",
              type: "array",
              fields: [
                image,
                { name: "name", type: "text", required: true },
                { name: "service", label: "Service line", type: "text" },
                {
                  name: "category",
                  type: "select",
                  options: [
                    { label: "Fashion & Beauty", value: "fashion" },
                    { label: "Health & Wellness", value: "health" },
                    { label: "Technology & Innovation", value: "technology" },
                    { label: "Finance & Business", value: "finance" },
                    { label: "Home & Living", value: "home" },
                    { label: "Industry & Sustainability", value: "industry" },
                  ],
                  admin: { description: "Which filter this project appears under. All always shows every project." },
                },
                {
                  name: "href",
                  label: "URL",
                  type: "text",
                  admin: { description: "Where the card goes. Leave empty until that page exists." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
