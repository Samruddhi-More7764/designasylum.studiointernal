import type { CollectionConfig } from "payload";
import { cmsVideoUpload } from "../fields/cmsImage";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  defaultSort: "order",
  admin: { useAsTitle: "alt", defaultColumns: ["alt", "order"] },
  access: { read: () => true },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false,
      filterOptions: { mimeType: { contains: "image/" } },
      admin: {
        description:
          "Still poster (JPG/PNG/WebP). Do not put the MP4 here — use Video below.",
      },
    },
    cmsVideoUpload("video"),
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Shown on the photo or video as the person's name. Add the role after a comma — e.g. \"Dr. Mallesh B., Co-founder, i3systems\".",
      },
    },
    { name: "quote", type: "textarea" },
    {
      name: "width",
      type: "number",
      required: true,
      defaultValue: 290,
      admin: {
        description: "On-screen card width. Prefills to the homepage size (290).",
      },
    },
    {
      name: "height",
      type: "number",
      required: true,
      defaultValue: 320,
      admin: {
        description:
          "On-screen card height. Prefills to 320; the center card is taller on desktop via layout.",
      },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
