import type { ArrayField, GlobalConfig, Payload } from "payload";

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
      {
        name: "href",
        label: "Custom URL (optional)",
        type: "text",
        admin: {
          description: "Optional destination URL (e.g. /why-design-asylum).",
        },
      },
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
      {
        name: "href",
        label: "Custom URL (optional)",
        type: "text",
        admin: {
          description:
            "Auto-filled with /industries/[slug] when an Industry Page is selected. Can also be customized.",
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
      {
        name: "href",
        label: "Custom URL (optional)",
        type: "text",
        admin: {
          description:
            "Auto-filled with /services/[slug] when a Service Page is selected. Can also be customized.",
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
      {
        name: "href",
        label: "Custom URL (optional)",
        type: "text",
        admin: {
          description:
            "Auto-filled with /solutions/[slug] when a Solution Page is selected. Can also be customized.",
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
      {
        name: "href",
        label: "Custom URL (optional)",
        type: "text",
        admin: {
          description:
            "Auto-filled with /work/[slug] when a Work Service Page is selected. Can also be customized.",
        },
      },
    ],
  };
}

/** Helper to auto-populate label and href from selected page relationship. */
async function autofillRow(
  row: Record<string, unknown>,
  relField: string,
  collection: "industry-pages" | "service-pages" | "solution-pages" | "work-service-pages",
  prefix: string,
  payload: Payload,
) {
  const rel = row[relField];

  let docId: string | number | null = null;
  let title: string | undefined;
  let slug: string | undefined;

  if (typeof rel === "object" && rel !== null) {
    if ("slug" in rel && typeof (rel as { slug?: unknown }).slug === "string") {
      slug = (rel as { slug: string }).slug;
      title = (rel as { title?: string }).title;
    } else if ("id" in rel) {
      docId = (rel as { id: string | number }).id;
    }
  } else if (typeof rel === "string" || typeof rel === "number") {
    docId = rel;
  }

  // If no relation was explicitly selected, attempt to match by label
  if (!docId && !slug && row.label && typeof row.label === "string" && row.label.trim()) {
    const candidate = row.label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    try {
      const match = await payload.find({
        collection,
        where: {
          or: [
            { slug: { equals: candidate } },
            { slug: { equals: `/${candidate}` } },
            { title: { equals: row.label.trim() } },
          ],
        },
        limit: 1,
        depth: 0,
      });
      if (match.docs.length > 0 && match.docs[0]) {
        docId = match.docs[0].id;
        slug = match.docs[0].slug;
        title = match.docs[0].title;
        row[relField] = match.docs[0].id;
      }
    } catch {}
  }

  if ((!slug || !title) && docId !== null) {
    try {
      const found = await payload.findByID({
        collection,
        id: docId,
        depth: 0,
      });
      if (found) {
        if (!slug && typeof found.slug === "string") slug = found.slug;
        if (!title && typeof found.title === "string") title = found.title;
      }
    } catch {
      // ignore lookup error
    }
  }

  const cleanSlug = slug
    ? slug.replace(/^\/+|\/+$/g, "").trim()
    : row.label && typeof row.label === "string"
      ? row.label
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";

  if (cleanSlug && (!row.href || typeof row.href !== "string" || !row.href.trim() || row.href.trim() === "#")) {
    row.href = `${prefix}/${cleanSlug}`;
  }
  if (title && (!row.label || typeof row.label !== "string" || !row.label.trim())) {
    row.label = title.trim();
  }
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
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data || !req?.payload) return data;

        if (Array.isArray(data.industries)) {
          for (const row of data.industries) {
            if (row && typeof row === "object") {
              await autofillRow(row, "industryPage", "industry-pages", "/industries", req.payload);
            }
          }
        }

        if (Array.isArray(data.services)) {
          for (const row of data.services) {
            if (row && typeof row === "object") {
              await autofillRow(row, "servicePage", "service-pages", "/services", req.payload);
            }
          }
        }

        if (Array.isArray(data.solutions)) {
          for (const row of data.solutions) {
            if (row && typeof row === "object") {
              await autofillRow(row, "solutionPage", "solution-pages", "/solutions", req.payload);
            }
          }
        }

        if (Array.isArray(data.work)) {
          for (const row of data.work) {
            if (row && typeof row === "object") {
              await autofillRow(row, "workServicePage", "work-service-pages", "/work", req.payload);
            }
          }
        }

        return data;
      },
    ],
  },
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
