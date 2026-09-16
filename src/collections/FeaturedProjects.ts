import type { CollectionConfig } from "payload";

const HUB_HREF = "/clients/sevenloop";

export const FeaturedProjects: CollectionConfig = {
  slug: "featured-projects",
  defaultSort: "order",
  admin: { useAsTitle: "name", defaultColumns: ["name", "href", "order"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "metric", type: "text", required: true },
    { name: "metricLabel", type: "text", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      filterOptions: { mimeType: { contains: "image" } },
    },
    { name: "alt", type: "text", required: true },
    {
      name: "href",
      type: "text",
      required: true,
      defaultValue: HUB_HREF,
      admin: {
        description:
          "Where this card links. Does not create a new page — Client Hub and Case Study live under Globals. Example: /clients/sevenloop",
      },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
