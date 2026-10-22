import type { CollectionConfig } from "payload";
import { homepageClientLink } from "../fields/homepageClientLink";
import {
  syncFeaturedProjectToClient,
  syncFeaturedProjectDeleteToClient,
} from "../cms/hooks/syncClientPlacements";

export const FeaturedProjects: CollectionConfig = {
  slug: "featured-projects",
  defaultSort: "order",
  admin: {
    hidden: true,
    useAsTitle: "name",
    defaultColumns: ["name", "client", "order"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [syncFeaturedProjectToClient],
    afterDelete: [syncFeaturedProjectDeleteToClient],
  },
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
    homepageClientLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
