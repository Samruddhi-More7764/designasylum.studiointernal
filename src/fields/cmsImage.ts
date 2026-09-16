import type { Field, UploadField } from "payload";

const imageFilter: UploadField["filterOptions"] = {
  mimeType: { contains: "image/" },
};

const videoFilter: UploadField["filterOptions"] = {
  mimeType: { contains: "video/" },
};

/** Upload + alt pair used by Client Hub and Case Study image groups/arrays. */
export const cmsImageFields: Field[] = [
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    required: true,
    filterOptions: imageFilter,
  },
  {
    name: "alt",
    type: "text",
    required: true,
  },
];

export const cmsVideoUpload = (name = "video"): UploadField => ({
  name,
  type: "upload",
  relationTo: "media",
  filterOptions: videoFilter,
  admin: {
    description:
      "MP4 or WebM for playback. Put a still JPG/PNG in Image — not the video file.",
  },
});
