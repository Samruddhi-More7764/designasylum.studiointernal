import type { CollectionConfig } from "payload";
import { homepageStudyLink } from "../fields/homepageStudyLink";

export const HomepageCaseStudies: CollectionConfig = {
  slug: "homepage-case-studies",
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["number", "name", "caseStudy", "order"],
  },
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
    homepageStudyLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
