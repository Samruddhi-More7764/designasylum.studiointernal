import type {
  ArrayField,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
} from "payload";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.title || "");
  if (source) data.slug = slugify(source);
  return data;
};

function lines(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    fields: [{ name: "text", type: "textarea", required: true }],
  };
}

const imageUpload: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

export const LocationPages: CollectionConfig = {
  slug: "location-pages",
  labels: {
    singular: "Location Page",
    plural: "Location Pages",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Location blueprint pages accessible at /locations/[slug].",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug],
  },
  fields: [
    {
      name: "title",
      label: "Location Name",
      type: "text",
      required: true,
      admin: {
        description: "Name of the location, for example Ahmedabad, Mumbai, or Pune.",
      },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "The web address suffix, for example ahmedabad (accessible at /locations/ahmedabad).",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "heroTitle", label: "Title", type: "text" },
            { name: "heroIntro", label: "Introduction", type: "textarea" },
            {
              name: "heroImage",
              label: "Hero image",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image/" } },
            },
          ],
        },
        {
          label: "Clients",
          fields: [
            { name: "clientsBefore", label: "Heading", type: "text" },
            { name: "clientsAccent", label: "Italic word", type: "text" },
            { name: "clientsAfter", label: "Heading ending", type: "text" },
            {
              name: "clientTabs",
              label: "Tabs",
              type: "array",
              fields: [
                { name: "tabId", label: "Id", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
            {
              name: "projects",
              type: "array",
              fields: [
                imageUpload,
                { name: "name", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                {
                  name: "href",
                  label: "URL",
                  type: "text",
                  admin: {
                    description:
                      "Where the View website button goes. Leave empty until that page exists.",
                  },
                },
                {
                  name: "tab",
                  label: "Client tab",
                  type: "select",
                  options: [
                    { label: "Solution", value: "solution" },
                    { label: "Service", value: "service" },
                    { label: "Industry", value: "industry" },
                    { label: "Location", value: "location" },
                  ],
                  admin: {
                    description:
                      "Which tab this project appears under. Leave empty to show it on every tab.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Callout",
          fields: [
            { name: "calloutBefore", label: "Heading", type: "text" },
            { name: "calloutAccent", label: "Italic word", type: "text" },
            { name: "calloutAfter", label: "Heading ending", type: "text" },
            { name: "calloutBody", label: "Paragraph", type: "textarea" },
          ],
        },
        {
          label: "Logos",
          fields: [
            {
              name: "logos",
              type: "array",
              labels: { singular: "Logo", plural: "Logos" },
              admin: {
                description:
                  "Logos on this location page only. Leave empty to keep using homepage logos.",
              },
              fields: [
                imageUpload,
                { name: "name", type: "text", required: true },
                {
                  name: "row",
                  type: "select",
                  options: [
                    { label: "Top row", value: "1" },
                    { label: "Bottom row", value: "2" },
                  ],
                  admin: {
                    description: "Desktop row placement.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Article",
          fields: [
            {
              name: "lead",
              type: "textarea",
              admin: { description: "The large lead paragraph at the top of the article." },
            },
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section", plural: "Sections" },
              admin: {
                description:
                  "Each section becomes a heading, its body, and a table-of-contents item.",
              },
              fields: [
                {
                  name: "anchor",
                  type: "text",
                  required: true,
                  admin: { description: "Stable ID for TOC link, for example why-brands." },
                },
                { name: "tocLabel", label: "Table of contents label", type: "text", required: true },
                { name: "headingBefore", label: "Heading before the italic", type: "text" },
                { name: "headingAccent", label: "Italic heading", type: "text" },
                { name: "headingAfter", label: "Heading after the italic", type: "text" },
                lines("paragraphs", "Paragraphs"),
                {
                  name: "blocks",
                  type: "array",
                  labels: { singular: "Block", plural: "Blocks" },
                  admin: { description: "A bold subheading followed by paragraphs." },
                  fields: [
                    { name: "title", type: "text", required: true },
                    lines("paragraphs", "Paragraphs"),
                  ],
                },
                {
                  name: "pointers",
                  type: "array",
                  labels: { singular: "Pointer", plural: "Pointers" },
                  fields: [{ name: "text", type: "textarea", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "CTA Banner",
          fields: [
            { name: "ctaHeadingBefore", label: "Heading before italic", type: "text", defaultValue: "Ready to " },
            { name: "ctaHeadingAccent", label: "Italic word", type: "text", defaultValue: "transform" },
            { name: "ctaHeadingAfter", label: "Heading ending", type: "text" },
            { name: "ctaBody", label: "Body copy", type: "textarea" },
            { name: "ctaButtonLabel", label: "Button label", type: "text", defaultValue: "Book an intro call" },
            { name: "ctaButtonHref", label: "Button URL", type: "text", defaultValue: "/contact" },
          ],
        },
        {
          label: "FAQs",
          fields: [
            {
              name: "faqs",
              type: "array",
              labels: { singular: "Question", plural: "FAQs" },
              fields: [
                { name: "question", type: "text", required: true },
                {
                  name: "answer",
                  type: "textarea",
                  admin: { description: "Leave empty to keep the question closed." },
                },
              ],
            },
          ],
        },
        {
          label: "Related blogs",
          fields: [
            { name: "relatedBefore", label: "Heading", type: "text" },
            { name: "relatedAccent", label: "Italic word", type: "text" },
            { name: "relatedAfter", label: "Heading ending", type: "text" },
            {
              name: "relatedBlogs",
              label: "Posts",
              type: "array",
              fields: [
                imageUpload,
                { name: "date", type: "text" },
                { name: "readTime", label: "Read time", type: "text" },
                { name: "title", type: "text", required: true },
                { name: "href", label: "URL", type: "text" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

