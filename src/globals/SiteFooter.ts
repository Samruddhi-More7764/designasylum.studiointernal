import type { ArrayField, GlobalConfig } from "payload";

/** One editable link under a footer heading. Blank URL keeps the built-in route. */
function linkList(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    labels: { singular: "Link", plural: label },
    admin: {
      description: `Links under ${label}. Leave URL empty to keep the built-in page, or type a path such as /work.`,
    },
    fields: [
      { name: "label", type: "text", required: true },
      {
        name: "href",
        label: "URL",
        type: "text",
        admin: {
          description: "Optional. Example: /blogs/branding-agency-in-pune",
        },
      },
    ],
  };
}

/**
 * Site-wide footer. Only the six link lists are editable here.
 * Sales numbers, Follow Us, the email and phone, and the Ask AI pills
 * stay in code.
 */
export const SiteFooter: GlobalConfig = {
  slug: "site-footer",
  label: "Footer",
  access: { read: () => true },
  fields: [
    {
      name: "columns",
      type: "array",
      admin: { hidden: true },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [{ name: "label", type: "text", required: true }],
        },
      ],
    },
    {
      name: "aiLinks",
      type: "array",
      admin: { hidden: true },
      fields: [{ name: "label", type: "text", required: true }],
    },
    linkList("work", "Work"),
    linkList("company", "Company"),
    linkList("solutions", "Solutions"),
    linkList("services", "Services"),
    linkList("industries", "Industries"),
    linkList("studio", "Studio"),
  ],
};
