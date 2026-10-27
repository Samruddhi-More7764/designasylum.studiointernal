import type { ArrayField, GlobalConfig } from "payload";

/** Standard editable link under a footer heading. */
function linkList(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    labels: { singular: "Link", plural: label },
    admin: {
      description: `Links under ${label}.`,
    },
    fields: [
      { name: "label", type: "text", required: true },
    ],
  };
}

/** Industries link list with direct Industry Page selection. */
function industryLinkList(): ArrayField {
  return {
    name: "industries",
    label: "Industries",
    type: "array",
    labels: { singular: "Industry Link", plural: "Industries" },
    admin: {
      description:
        "Links under Industries. Select an Industry Page created in CMS (auto-routes to /industries/[slug] and uses page name).",
    },
    fields: [
      {
        name: "industryPage",
        label: "Select Industry Page",
        type: "relationship",
        relationTo: "industry-pages",
        admin: {
          description:
            "Select an industry page created in CMS. Routing and name are managed automatically.",
        },
      },
      {
        name: "label",
        label: "Label",
        type: "text",
        admin: {
          description:
            "Link name. If an Industry Page is selected above, leave empty to automatically use the page's name.",
        },
      },
    ],
  };
}

/** Services link list with direct Service Page selection. */
function serviceLinkList(): ArrayField {
  return {
    name: "services",
    label: "Services",
    type: "array",
    labels: { singular: "Service Link", plural: "Services" },
    admin: {
      description:
        "Links under Services. Select a Service Page created in CMS (auto-routes to /services/[slug] and uses page name).",
    },
    fields: [
      {
        name: "servicePage",
        label: "Select Service Page",
        type: "relationship",
        relationTo: "service-pages",
        admin: {
          description:
            "Select a service page created in CMS. Routing and name are managed automatically.",
        },
      },
      {
        name: "label",
        label: "Label",
        type: "text",
        admin: {
          description:
            "Link name. If a Service Page is selected above, leave empty to automatically use the page's name.",
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
    serviceLinkList(),
    industryLinkList(),
    linkList("studio", "Studio"),
  ],
};
