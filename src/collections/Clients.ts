import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { clientHubFields } from "../fields/clientHubFields";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.name || "");
  if (source) data.slug = slugify(source);
  return data;
};

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    group: "Work",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "projectType"],
    description:
      "One record per brand. Hub = 2+ projects (library). Direct = one project, skip hub.",
  },
  access: { read: () => true },
  hooks: { beforeValidate: [ensureSlug] },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL: /clients/{slug}. Example: sevenloop, puma.",
      },
    },
    {
      name: "projectType",
      type: "radio",
      required: true,
      defaultValue: "direct",
      options: [
        {
          label:
            "Client hub — 2+ projects; homepage opens the library; hub sections open case studies",
          value: "hub",
        },
        {
          label:
            "Direct case study — one project; homepage skips the hub and opens the study",
          value: "direct",
        },
      ],
      admin: {
        description:
          "Homepage cards follow this. Hub = library. Direct = one study. If creating from a Case study, save the Client first — Featured study fills in after the study is saved.",
      },
    },
    {
      name: "featuredStudy",
      type: "relationship",
      relationTo: "case-studies",
      admin: {
        condition: (_data, siblingData: { projectType?: string }) =>
          siblingData?.projectType === "direct",
        allowCreate: false,
        description:
          "Homepage opens this study when Project type is Direct. Create the Case study first (or save this Client, then the study) — do not create a study from this field.",
      },
      // No filterOptions: CaseStudies.afterChange sets this in the same
      // transaction; Payload filter validation cannot see the new study yet.
    },
    ...clientHubFields,
  ],
};
