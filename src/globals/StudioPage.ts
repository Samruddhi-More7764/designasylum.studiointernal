import type { Field, GlobalConfig } from "payload";

function imageField(name = "image", label?: string, description?: string): Field {
  return {
    name,
    label,
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image/" } },
    admin: description ? { description } : undefined,
  };
}

/**
 * The studio page at /studio.
 * Empty fields fall back to the designed page.
 * "Want a no-brainer offer?" and its two buttons stay in code.
 */
export const StudioPage: GlobalConfig = {
  slug: "studio-page",
  label: "Studio",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "headingBefore", label: "Heading", type: "textarea" },
            { name: "headingAccent", label: "Italic word", type: "text" },
            { name: "headingAfter", label: "Heading ending", type: "text" },
            imageField(
              "heroImage",
              "Hero image",
              "The wide photograph under the heading. Leave empty to keep the designed photo.",
            ),
          ],
        },
        {
          label: "Testimonial",
          fields: [
            {
              name: "portrait",
              label: "Portrait",
              type: "upload",
              relationTo: "media",
              filterOptions: {
                or: [
                  { mimeType: { contains: "image/" } },
                  { mimeType: { contains: "video/" } },
                ],
              },
              admin: {
                description: "A photo or a video. Leave empty to keep the designed photo.",
              },
            },
            {
              name: "videoUrl",
              type: "text",
              admin: { hidden: true },
            },
            { name: "quote", type: "textarea" },
            { name: "quoteName", label: "Name", type: "text" },
            { name: "quoteRole", label: "Role", type: "text" },
            {
              name: "chips",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", label: "Amount", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Projects",
          fields: [
            { name: "projectsBefore", label: "Heading", type: "text" },
            { name: "projectsAccent", label: "Italic word", type: "text" },
            {
              name: "projects",
              type: "array",
              fields: [
                imageField(),
                { name: "name", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "href",
                  label: "URL",
                  type: "text",
                  admin: { description: "Where View website goes. Leave empty until that page exists." },
                },
              ],
            },
          ],
        },
        {
          label: "Fit",
          fields: [
            { name: "fitBefore", label: "Right-fit heading", type: "text" },
            { name: "fitAccent", label: "Italic word", type: "text" },
            { name: "fitAfter", label: "Heading ending", type: "text" },
            {
              name: "fitCards",
              label: "Right-fit lines",
              type: "array",
              fields: [{ name: "caption", type: "textarea", required: true }],
            },
            { name: "missBefore", label: "Not-a-fit heading", type: "text" },
            { name: "missAccent", label: "Italic word", type: "text" },
            { name: "missAfter", label: "Heading ending", type: "text" },
            {
              name: "missCards",
              label: "Not-a-fit lines",
              type: "array",
              fields: [{ name: "caption", type: "textarea", required: true }],
            },
          ],
        },
        {
          label: "Team",
          fields: [
            { name: "teamBefore", label: "Heading", type: "text" },
            { name: "teamAccent", label: "Italic word", type: "text" },
            {
              name: "people",
              type: "array",
              fields: [
                imageField(),
                { name: "name", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
