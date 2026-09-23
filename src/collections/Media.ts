import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "updatedAt"],
  },
  upload: {
    mimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "sourcePath",
      type: "text",
      index: true,
      admin: {
        hidden: true,
        description: "Original public path used by seed, for idempotent upserts.",
      },
    },
  ],
};
