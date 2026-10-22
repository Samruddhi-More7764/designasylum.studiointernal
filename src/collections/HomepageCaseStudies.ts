import type { CollectionConfig } from "payload";
import { homepageStudyLink } from "../fields/homepageStudyLink";
import {
  syncHomepageCaseStudyToClient,
  syncHomepageCaseStudyDeleteToClient,
} from "../cms/hooks/syncClientPlacements";

export const HomepageCaseStudies: CollectionConfig = {
  slug: "homepage-case-studies",
  defaultSort: "order",
  admin: {
    hidden: true,
    useAsTitle: "name",
    defaultColumns: ["number", "name", "caseStudy", "order"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [syncHomepageCaseStudyToClient],
    afterDelete: [syncHomepageCaseStudyDeleteToClient],
  },
  fields: [
    {
      name: "number",
      type: "text",
      required: true,
      label: "List number (e.g. 01, 02)",
      admin: {
        description:
          "Numbered prefix displayed next to the project name in the homepage list (e.g. “01”, “02”).",
      },
    },
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "tags",
      type: "array",
      required: true,
      label: "Category Tags (Pills below summary)",
      labels: {
        singular: "Tag",
        plural: "Tags",
      },
      admin: {
        description:
          "Pill tags displayed under the summary, e.g. 'BRANDING', 'DEVELOPMENT'. Click 'Add Tag' to add tags, or the trash icon to remove.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Tag name",
        },
      ],
    },
    homepageStudyLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
