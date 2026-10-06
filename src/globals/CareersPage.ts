import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

/**
 * The careers page at /why-design-asylum.
 * Empty fields fall back to the designed page copy.
 * Open roles and the application form stay in code.
 */
export const CareersPage: GlobalConfig = {
  slug: "careers-page",
  label: "Careers",
  access: { read: () => true },
  fields: [
    { name: "rolesBefore", type: "text", admin: { hidden: true } },
    { name: "rolesAccent", type: "text", admin: { hidden: true } },
    { name: "rolesAfter", type: "text", admin: { hidden: true } },
    { name: "rolesBody", type: "textarea", admin: { hidden: true } },
    { name: "rolesButton", type: "text", admin: { hidden: true } },
    { name: "formBefore", type: "text", admin: { hidden: true } },
    { name: "formAccent", type: "text", admin: { hidden: true } },
    { name: "formAfter", type: "text", admin: { hidden: true } },
    { name: "formDek", type: "textarea", admin: { hidden: true } },
    {
      name: "interests",
      type: "array",
      admin: { hidden: true },
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "titleBefore", label: "Title", type: "text" },
            { name: "titleAccent", label: "Italic word", type: "text" },
            { name: "titleAfter", label: "Title ending", type: "text" },
            { name: "intro", label: "Introduction", type: "textarea" },
            {
              ...image,
              name: "heroImage",
              label: "Image",
              admin: { description: "The wide image under the heading. Leave empty to keep the black block." },
            },
          ],
        },
        {
          label: "Benefits",
          fields: [
            { name: "benefitsBefore", label: "Heading", type: "text" },
            { name: "benefitsAccent", label: "Italic word", type: "text" },
            { name: "benefitsAfter", label: "Heading ending", type: "text" },
            { ...image, name: "studioImage", label: "Studio mark" },
            {
              name: "benefits",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Life outside",
          fields: [
            { name: "lifeBefore", label: "Heading", type: "text" },
            { name: "lifeAccent", label: "Italic word", type: "text" },
            { name: "lifeAfter", label: "Heading ending", type: "text" },
            { name: "lifeDek", label: "Introduction", type: "textarea" },
            {
              name: "lifeSlides",
              label: "Photos",
              type: "array",
              admin: { description: "Leave empty to keep the gray placeholders." },
              fields: [image],
            },
          ],
        },
        {
          label: "Team",
          fields: [
            { name: "teamBefore", label: "Heading", type: "text" },
            { name: "teamAccent", label: "Italic word", type: "text" },
            { name: "teamAfter", label: "Heading ending", type: "text" },
            {
              name: "quotes",
              type: "array",
              fields: [
                image,
                { name: "name", type: "text", required: true },
                { name: "role", type: "text" },
                { name: "quote", type: "textarea", required: true },
                { name: "body", type: "textarea" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
