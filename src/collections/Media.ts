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
    // Explicit allowlist instead of "image/*" to exclude image/svg+xml.
    // SVG files can contain embedded <script> tags, making them an XSS vector
    // when served back to visitors from Vercel Blob storage.
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
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
