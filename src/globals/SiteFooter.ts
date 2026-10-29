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

/** Solutions link list with direct Solution Page selection. */
function solutionLinkList(): ArrayField {
  return {
    name: "solutions",
    label: "Solutions",
    type: "array",
    labels: { singular: "Solution Link", plural: "Solutions" },
    admin: {
      description:
        "Links under Solutions. Select a Solution Page created in CMS (auto-routes to /solutions/[slug] and uses page name).",
    },
    fields: [
      {
        name: "solutionPage",
        label: "Select Solution Page",
        type: "relationship",
        relationTo: "solution-pages",
        admin: {
          description:
            "Select a solution page created in CMS. Routing and name are managed automatically.",
        },
      },
      {
        name: "label",
        label: "Label",
        type: "text",
        admin: {
          description:
            "Link name. If a Solution Page is selected above, leave empty to automatically use the page's name.",
        },
      },
    ],
  };
}

/** Work link list with direct Work Service Page selection. */
function workServiceLinkList(): ArrayField {
  return {
    name: "work",
    label: "Work",
    type: "array",
    labels: { singular: "Work Link", plural: "Work" },
    admin: {
      description:
        "Links under Work. Select a Work Service Page created in CMS (auto-routes to /work/[slug] and uses page name).",
    },
    fields: [
      {
        name: "workServicePage",
        label: "Select Work Service Page",
        type: "relationship",
        relationTo: "work-service-pages",
        admin: {
          description:
            "Select a work service page created in CMS. Routing and name are managed automatically.",
        },
      },
      {
        name: "label",
        label: "Label",
        type: "text",
        admin: {
          description:
            "Link name. If a Work Service Page is selected above, leave empty to automatically use the page's name.",
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
    workServiceLinkList(),
    linkList("company", "Company"),
    solutionLinkList(),
    serviceLinkList(),
    industryLinkList(),
    linkList("studio", "Studio"),
  ],
};
