import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

/**
 * `sourcePath` only exists so the seed script can upsert its own files
 * idempotently. Once an editor uploads a real file over a seeded record the
 * original `public/` path is no longer the truth, so drop it — otherwise it
 * lingers and `resolveMediaUrl` would keep serving the old seeded image.
 *
 * Scoped to `update` on purpose: seeding creates records *with* a sourcePath
 * and also sets `req.file`, so clearing on create would break the seed's
 * lookup-by-sourcePath and duplicate every image on the next run.
 */
const clearSourcePathOnReupload: CollectionBeforeChangeHook = ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== "update") return data;
  if (!req.file) return data;

  const seededPath = data?.sourcePath ?? originalDoc?.sourcePath;
  if (!seededPath) return data;

  return { ...data, sourcePath: null };
};

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
  hooks: {
    beforeChange: [clearSourcePathOnReupload],
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
