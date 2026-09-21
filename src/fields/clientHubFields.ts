import type { Field } from "payload";
import { cmsImageFields, cmsVideoUpload } from "./cmsImage";
import { caseStudyRelation } from "./caseStudyRelation";

const hubOnly = (_data: unknown, siblingData: { projectType?: string }) =>
  siblingData?.projectType === "hub";

/** Hub page sections — shown only when projectType is hub. */
export const clientHubFields: Field[] = [
  {
    name: "navItems",
    type: "array",
    admin: { condition: hubOnly },
    fields: [
      { name: "navId", type: "text", required: true },
      { name: "label", type: "text", required: true },
    ],
  },
  {
    name: "about",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
      { name: "body", type: "textarea", required: true },
      { name: "websiteHref", type: "text", required: true },
    ],
  },
  {
    name: "logoDesign",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
      { name: "images", type: "array", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Logo Design."),
    ],
  },
  {
    name: "websiteDesign",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
      { name: "image", type: "group", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Website Design."),
    ],
  },
  {
    name: "projectBrochure",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
      { name: "images", type: "array", fields: cmsImageFields },
      caseStudyRelation("Optional — open this case study from Project Brochure."),
    ],
  },
  {
    name: "brandVideo",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
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
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
      { name: "images", type: "array", fields: cmsImageFields },
    ],
  },
  {
    name: "caseStudy",
    type: "group",
    admin: { condition: hubOnly },
    fields: [
      { name: "italic", type: "text", required: true },
      { name: "rest", type: "text", required: true },
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
