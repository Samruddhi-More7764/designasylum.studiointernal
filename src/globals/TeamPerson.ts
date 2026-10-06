import type { Field, GlobalConfig } from "payload";

function photo(name: string, label: string, description: string): Field {
  return {
    name,
    label,
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image/" } },
    admin: { description },
  };
}

function chips(name: string): Field {
  return {
    name,
    type: "array",
    fields: [
      photo("icon", "Icon", "Leave empty to keep the grey placeholder."),
      { name: "label", type: "text", required: true },
    ],
  };
}

/**
 * Tanmaya Rao’s page at /team/tanmaya-rao.
 * Empty fields fall back to the designed page.
 * The closing line and Start a project stay in code.
 */
export const TeamPerson: GlobalConfig = {
  slug: "team-person",
  label: "Team person",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "name", type: "text" },
            { name: "role", type: "text" },
            photo("photoOne", "Photo 1", "Front card. Leave empty to keep the grey placeholder."),
            photo("photoTwo", "Photo 2", "Middle card. Leave empty to keep the grey placeholder."),
            photo("photoThree", "Photo 3", "Back card. Leave empty to keep the grey placeholder."),
            {
              name: "paragraphs",
              label: "Biography",
              type: "array",
              fields: [{ name: "text", type: "textarea", required: true }],
            },
          ],
        },
        {
          label: "Services",
          fields: [
            { name: "servicesBefore", label: "Heading", type: "text" },
            { name: "servicesAccent", label: "Italic word", type: "text" },
            { name: "servicesAfter", label: "Heading ending", type: "text" },
            chips("services"),
          ],
        },
        {
          label: "Clients",
          fields: [
            { name: "clientsBefore", label: "Heading", type: "text" },
            { name: "clientsAccent", label: "Italic word", type: "text" },
            { name: "clientsAfter", label: "Heading ending", type: "text" },
            {
              name: "logos",
              type: "array",
              fields: [
                photo("image", "Logo", "Leave the list empty to keep the temporary logos."),
              ],
            },
          ],
        },
        {
          label: "Projects",
          fields: [
            { name: "projectsBefore", label: "Heading", type: "text" },
            { name: "projectsAccent", label: "Italic word", type: "text" },
            { name: "projectsAfter", label: "Heading ending", type: "text" },
            {
              name: "projects",
              type: "array",
              fields: [
                photo("image", "Image", "Leave empty to keep the designed photo."),
                { name: "name", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "href",
                  label: "Website URL",
                  type: "text",
                  admin: { description: "Where View website goes. Leave empty until that page exists." },
                },
              ],
            },
          ],
        },
        {
          label: "Blogs",
          fields: [
            { name: "blogsBefore", label: "Heading", type: "text" },
            { name: "blogsAccent", label: "Italic word", type: "text" },
            { name: "blogsAfter", label: "Heading ending", type: "text" },
            {
              name: "posts",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "href",
                  label: "URL",
                  type: "text",
                  admin: { description: "Where the row goes. Leave empty until that page exists." },
                },
              ],
            },
          ],
        },
        {
          label: "Solutions",
          fields: [
            { name: "solutionsBefore", label: "Heading", type: "text" },
            { name: "solutionsAccent", label: "Italic word", type: "text" },
            { name: "solutionsAfter", label: "Heading ending", type: "text" },
            chips("solutions"),
          ],
        },
        {
          label: "Industries",
          fields: [
            { name: "industriesBefore", label: "Heading", type: "text" },
            { name: "industriesAccent", label: "Italic word", type: "text" },
            { name: "industriesAfter", label: "Heading ending", type: "text" },
            chips("industries"),
          ],
        },
      ],
    },
  ],
};
