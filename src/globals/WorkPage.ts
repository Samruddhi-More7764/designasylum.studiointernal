import type { Field, GlobalConfig } from "payload";
import { seoTab } from "../fields/seoFields";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (Array.isArray(data.filters)) {
          data.filters = data.filters.map((filter: Record<string, unknown>) => {
            if (!filter) return filter;
            const label = typeof filter.label === "string" ? filter.label.trim() : "";
            const rawId = typeof filter.filterId === "string" ? filter.filterId.trim() : "";
            const filterId = rawId ? slugify(rawId) : slugify(label);
            return {
              ...filter,
              filterId,
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
              admin: { description: "Include All first (ID: 'all'). Filter ID is used to match project categories." },
              fields: [
                {
                  name: "filterId",
                  label: "Filter ID / Slug",
                  type: "text",
                  admin: {
                    description:
                      "Unique identifier used to match project categories (e.g. 'all', 'fashion', 'health', 'technology'). Leave empty to automatically generate from the label.",
                    placeholder: "e.g. technology (or leave blank to auto-generate)",
                  },
                },
                { name: "label", label: "Display Label", type: "text", required: true },
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
                {
                  name: "client",
                  label: "Select Client",
                  type: "relationship",
                  relationTo: "clients",
                  admin: {
                    description:
                      "Select a client from Collections > Clients. Link (/clients/[slug]), name, and image will auto-populate if left empty.",
                  },
                },
                {
                  ...image,
                  admin: {
                    description: "Leave empty to use client hero image.",
                  },
                },
                {
                  name: "name",
                  type: "text",
                  admin: {
                    description: "Leave empty to use client name.",
                  },
                },
                { name: "service", label: "Service line", type: "text" },
                {
                  name: "category",
                  label: "Filter / Category ID",
                  type: "text",
                  admin: {
                    description:
                      "Filter ID this project appears under (e.g. 'fashion', 'health', 'technology', 'finance', 'home', 'industry', or any custom filter ID defined under Filters). 'All' always shows every project.",
                    placeholder: "e.g. technology",
                  },
                },
                {
                  name: "order",
                  label: "Display order",
                  type: "number",
                  defaultValue: 0,
                  admin: { description: "Card position order (lower numbers appear first)." },
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
