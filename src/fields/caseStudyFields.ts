import type { Field } from "payload";
import { cmsEitherMediaFields } from "./cmsImage";

export const caseStudyFields: Field[] = [
  {
    name: "hero",
    type: "group",
    fields: [
      { name: "heading", type: "text", required: true },
      {
        name: "breadcrumbCurrent",
        type: "text",
        admin: {
          description: "Last breadcrumb crumb. Defaults to the study title.",
        },
      },
      {
        name: "breadcrumb",
        type: "array",
        admin: {
          hidden: true,
          description:
            "Optional. Leave empty to auto-build Home / clients / {client}.",
        },
        fields: [
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
        ],
      },
      { name: "image", type: "group", fields: cmsEitherMediaFields },
    ],
  },
  {
    name: "details",
    type: "group",
    fields: [
      { name: "quote", type: "textarea", required: true },
      {
        name: "tableHeading",
        type: "text",
        required: true,
        label: "Table caption",
        admin: {
          description:
            "Heading shown above the table — e.g. \"Details\". This is a caption on its own, not a row, so it has no value beside it. Add label/value pairs under Rows below.",
        },
      },
      {
        name: "rows",
        type: "array",
        label: "Rows",
        admin: {
          description:
            "Each row is a label/value pair (e.g. Client → Sevenloop). If you leave this empty the page falls back to placeholder rows.",
        },
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
    fields: cmsEitherMediaFields,
  },
  {
    name: "viewAll",
    type: "group",
    fields: [
      {
        name: "label",
        type: "text",
        required: true,
        defaultValue: "View All Clients",
      },
      {
        name: "href",
        type: "text",
        required: true,
        defaultValue: "/",
      },
    ],
  },
];
