import type { Field } from "payload";
import { cmsImageFields, cmsVideoUpload } from "./cmsImage";
import { caseStudyRelation } from "./caseStudyRelation";

const hubOnly = (_data: unknown, siblingData: { projectType?: string }) =>
  siblingData?.projectType === "hub";

const headingNote =
  "Editable per client, and not required. Design Asylum often does this same work, but the wording can change. Leave blank to keep the static-page default.";

/** Italic word + the rest of a hub section heading. Defaults match the static page. */
function sectionHeadingFields(italic: string, rest: string): Field[] {
  return [
    {
      name: "italic",
      type: "text",
      label: "Heading — italic word",
      defaultValue: italic,
      admin: {
        description: `${headingNote} Default: “${italic}”.`,
      },
    },
    {
      name: "rest",
      type: "text",
      label: "Heading — remaining words",
      defaultValue: rest,
      admin: {
        description: `${headingNote} Default: “${rest}”.`,
      },
    },
  ];
}

/** Hub page sections — shown only when projectType is hub. */
export const clientHubFields: Field[] = [
  {
    name: "navItems",
    type: "array",
    labels: { singular: "Sidebar heading", plural: "Sidebar headings" },
    admin: {
      condition: hubOnly,
      description:
        "Sidebar labels. Defaults match the static page: About Client, Logo Design, Website Design & Development, Project Brochure, Brand Video, Behind the Scenes, Case Study. Not required to stay worded that way.",
    },
    fields: [
      {
        name: "navId",
        type: "text",
        required: true,
        label: "Section id",
        admin: {
          description:
            "Keep the existing id (logo-design, website-design, brand-video, …) so the sidebar still jumps to that block.",
        },
      },
      {
        name: "label",
        type: "text",
        required: true,
        label: "Heading",
        admin: {
          description: "Shown in the sidebar. Editable per client.",
        },
      },
    ],
  },
  {
    name: "about",
    type: "group",
    label: "About Client",
    admin: {
      condition: hubOnly,
      description: "Heading default: About Client.",
    },
    fields: [
      ...sectionHeadingFields("About", "Client"),
      { name: "body", type: "textarea", required: true },
      { name: "websiteHref", type: "text", required: true },
    ],
  },
  {
    name: "logoDesign",
    type: "group",
    label: "Logo Design",
    admin: {
      condition: hubOnly,
      description: "Heading default: Logo Design.",
    },
    fields: [
      ...sectionHeadingFields("Logo", "Design"),
      { name: "images", type: "array", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Logo Design."),
    ],
  },
  {
    name: "websiteDesign",
    type: "group",
    label: "Website",
    admin: {
      condition: hubOnly,
      description: "Heading default: Website Design & Development.",
    },
    fields: [
      ...sectionHeadingFields("Website", "Design & Development"),
      { name: "image", type: "group", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Website Design."),
    ],
  },
  {
    name: "projectBrochure",
    type: "group",
    label: "Project Brochure",
    admin: {
      condition: hubOnly,
      description: "Heading default: Project Brochure. “Brochure” is the italic word.",
    },
    fields: [
      ...sectionHeadingFields("Brochure", "Project"),
      { name: "images", type: "array", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Project Brochure."),
    ],
  },
  {
    name: "brandVideo",
    type: "group",
    label: "Brand Video",
    admin: {
      condition: hubOnly,
      description: "Heading default: Brand Video.",
    },
    fields: [
      ...sectionHeadingFields("Brand", "Video"),
      {
        name: "image",
        type: "group",
        admin: {
          description: "Still poster only (JPG/PNG). Upload the MP4 in Video.",
        },
        fields: cmsImageFields,
      },
      cmsVideoUpload("video"),
      caseStudyRelation("Optional — open this case study from Brand Video."),
    ],
  },
  {
    name: "behindTheScenes",
    type: "group",
    label: "Behind the Scenes",
    admin: {
      condition: hubOnly,
      description: "Heading default: Behind The Scenes.",
    },
    fields: [
      ...sectionHeadingFields("Behind", "The Scenes"),
      { name: "images", type: "array", fields: cmsImageFields },
    ],
  },
  {
    name: "caseStudy",
    type: "group",
    label: "Case Study",
    admin: {
      condition: hubOnly,
      description: "Heading default: Case Study.",
    },
    fields: [
      ...sectionHeadingFields("Study", "Case"),
      { name: "subheading", type: "textarea", required: true },
      caseStudyRelation("Primary Case Study CTA on the hub."),
    ],
  },
  {
    name: "partnership",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "label", type: "text", required: true },
      { name: "heading", type: "text", required: true },
      { name: "headingAccent", type: "text", required: true },
      {
        name: "paragraphs",
        type: "array",
        fields: [{ name: "text", type: "textarea", required: true }],
      },
    ],
  },
  {
    name: "transformation",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "heading", type: "text", required: true },
      { name: "subtext", type: "textarea", required: true },
      { name: "before", type: "group", fields: cmsImageFields },
      { name: "after", type: "group", fields: cmsImageFields },
    ],
  },
  {
    name: "projectTeam",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "heading", type: "text", required: true },
      { name: "subheading", type: "textarea", required: true },
      {
        name: "members",
        type: "array",
        fields: [
          { name: "name", type: "text", required: true },
          { name: "role", type: "text", required: true },
          { name: "photo", type: "group", fields: cmsImageFields },
        ],
      },
    ],
  },
];
