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
    // Explicit allowlist supporting standard web raster formats, vector SVGs
    // (for client logos and icons), and web-optimised video formats.
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ],
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
