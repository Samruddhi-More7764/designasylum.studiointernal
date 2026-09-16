import type { GlobalConfig } from "payload";
import { cmsImageFields } from "../fields/cmsImage";

export const CaseStudyPage: GlobalConfig = {
  slug: "case-study-page",
  access: { read: () => true },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "breadcrumbCurrent", type: "text", required: true },
        {
          name: "breadcrumb",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
        { name: "image", type: "group", fields: cmsImageFields },
      ],
    },
    {
      name: "details",
      type: "group",
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "tableHeading", type: "text", required: true },
        {
          name: "rows",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      fields: cmsImageFields,
    },
    {
      name: "viewAll",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
