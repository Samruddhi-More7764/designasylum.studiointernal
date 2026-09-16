import type { CollectionConfig } from "payload";

const CASE_STUDY_HREF = "/clients/sevenloop/case-study";

export const HomepageCaseStudies: CollectionConfig = {
  slug: "homepage-case-studies",
  defaultSort: "order",
  admin: { useAsTitle: "name", defaultColumns: ["number", "name", "href", "order"] },
  access: { read: () => true },
  fields: [
    { name: "number", type: "text", required: true },
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "tags",
      type: "array",
      required: true,
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "href",
      type: "text",
      required: true,
      defaultValue: CASE_STUDY_HREF,
      admin: {
        description:
          "Where View website goes. Cloudphys should use /clients/sevenloop/case-study. Does not create a new case-study page — edit that under Globals.",
      },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
