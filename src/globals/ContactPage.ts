import type { Field, GlobalConfig } from "payload";

const image: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

/**
 * The contact page at /contact.
 * Empty fields fall back to the designed page copy.
 * The form fields and submit button stay in code.
 */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact",
  access: { read: () => true },
  fields: [
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
          ],
        },
        {
          label: "Offices",
          fields: [
            {
              name: "offices",
              type: "array",
              fields: [
                { name: "city", type: "text", required: true },
                image,
                {
                  name: "imageSrc",
                  label: "Image path",
                  type: "text",
                  admin: { description: "Used when no image is uploaded." },
                },
                {
                  name: "timeZone",
                  label: "Time zone",
                  type: "text",
                  admin: { description: "IANA name, for example Asia/Kolkata." },
                },
                { name: "tint", label: "Blue wash", type: "checkbox" },
                {
                  name: "links",
                  type: "array",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", label: "URL", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Form",
          fields: [
            { name: "formBefore", label: "Heading", type: "text" },
            { name: "formAccent", label: "Italic word", type: "text" },
            { name: "formAfter", label: "Heading ending", type: "text" },
            { name: "formBody", label: "Paragraph", type: "textarea" },
          ],
        },
      ],
    },
  ],
};
