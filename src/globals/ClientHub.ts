import type { GlobalConfig } from "payload";
import { cmsImageFields, cmsVideoUpload } from "../fields/cmsImage";

export const ClientHub: GlobalConfig = {
  slug: "client-hub",
  access: { read: () => true },
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        { name: "navId", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "about",
      type: "group",
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
      fields: [
        { name: "italic", type: "text", required: true },
        { name: "rest", type: "text", required: true },
        { name: "images", type: "array", fields: cmsImageFields },
      ],
    },
    {
      name: "websiteDesign",
      type: "group",
      fields: [
        { name: "italic", type: "text", required: true },
        { name: "rest", type: "text", required: true },
        { name: "image", type: "group", fields: cmsImageFields },
      ],
    },
    {
      name: "projectBrochure",
      type: "group",
      fields: [
        { name: "italic", type: "text", required: true },
        { name: "rest", type: "text", required: true },
        { name: "images", type: "array", fields: cmsImageFields },
      ],
    },
    {
      name: "brandVideo",
      type: "group",
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
      ],
    },
    {
      name: "behindTheScenes",
      type: "group",
      fields: [
        { name: "italic", type: "text", required: true },
        { name: "rest", type: "text", required: true },
        { name: "images", type: "array", fields: cmsImageFields },
      ],
    },
    {
      name: "caseStudy",
      type: "group",
      fields: [
        { name: "italic", type: "text", required: true },
        { name: "rest", type: "text", required: true },
        { name: "subheading", type: "textarea", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "partnership",
      type: "group",
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
  ],
};
