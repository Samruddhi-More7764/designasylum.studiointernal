import type { ArrayField, Field, GlobalConfig } from "payload";

function lines(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    fields: [{ name: "text", type: "textarea", required: true }],
  };
}

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

/**
 * The Ahmedabad location page at /locations/ahmedabad.
 * Empty fields fall back to the designed page copy.
 * The “Ready to transform your Ahmedabad brand?” call to action stays in code.
 */
export const AhmedabadLocation: GlobalConfig = {
  slug: "ahmedabad-location",
  label: "Location",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "heroTitle", label: "Title", type: "text" },
            { name: "heroIntro", label: "Introduction", type: "textarea" },
            { ...image, name: "heroImage", label: "Hero image" },
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
                image,
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
                  "Logos on the Ahmedabad page only. Leave this empty to keep using the homepage logos. Filling it does not change the homepage.",
              },
              fields: [
                image,
                { name: "name", type: "text", required: true },
                {
                  name: "width",
                  type: "number",
                  admin: { description: "Width inside the card, in pixels. Default 160." },
                },
                {
                  name: "height",
                  type: "number",
                  admin: { description: "Height inside the card, in pixels. Default 48." },
                },
                {
                  name: "row",
                  type: "select",
                  options: [
                    { label: "Top row", value: "1" },
                    { label: "Bottom row", value: "2" },
                  ],
                  admin: {
                    description:
                      "Desktop row. Leave empty to fill the top row first (four logos), then the bottom row.",
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
              admin: { description: "The large paragraph at the top of the article." },
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
                  admin: { description: "Stable id, for example why-ahmedabad-brands." },
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
                image,
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
