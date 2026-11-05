import type { CollectionConfig } from "payload";
import { cmsVideoUpload } from "../fields/cmsImage";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  defaultSort: "order",
  admin: { useAsTitle: "alt", defaultColumns: ["alt", "order"] },
  access: {
    read: () => true,
    create: () => false,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        const mediaType = data.mediaType || (data.image && !data.video ? "image" : "video");
        if (mediaType === "image") {
          data.video = null;
        } else if (mediaType === "video") {
          data.image = null;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "mediaType",
      label: "Media Type",
      type: "radio",
      defaultValue: "video",
      options: [
        { label: "Video", value: "video" },
        { label: "Image", value: "image" },
      ],
      admin: {
        layout: "horizontal",
        description:
          "Choose whether this testimonial displays a video or an image. Only one media can be added.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false,
      filterOptions: { mimeType: { contains: "image/" } },
      admin: {
        condition: (data) => data?.mediaType === "image",
        description: "Still photo (JPG/PNG/WebP).",
      },
    },
    {
      ...cmsVideoUpload("video"),
      admin: {
        condition: (data) => (data?.mediaType ?? "video") === "video",
        description: "Video (MP4/WebM).",
      },
    },
    {
      name: "alt",
      type: "text",
      required: false,
      admin: {
        description:
          "Person's name, shown on the photo or video (optional). Example: Dr. Mallesh B.",
      },
    },
    {
      name: "designation",
      type: "text",
      required: false,
      admin: {
        description:
          "Optional. Shown under the name. Example: Co-founder, i3systems.",
      },
    },
    {
      name: "quote",
      type: "textarea",
      maxLength: 120,
      admin: {
        description: "120 characters maximum.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        description:
          "Display order. Indexing starts from 0 (0 is first, 1 is second, 2 is third).",
      },
    },
  ],
};
