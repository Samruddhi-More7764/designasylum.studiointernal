import type { CollectionConfig } from "payload";
import { homepageClientLink } from "../fields/homepageClientLink";
import {
  syncPainPointToClient,
  syncPainPointDeleteToClient,
} from "../cms/hooks/syncClientPlacements";

export const PainPoints: CollectionConfig = {
  slug: "pain-points",
  defaultSort: "order",
  admin: { useAsTitle: "tag", defaultColumns: ["tag", "client", "order"] },
  access: { read: () => true },
  hooks: {
    afterChange: [syncPainPointToClient],
    afterDelete: [syncPainPointDeleteToClient],
  },
  fields: [
    { name: "tag", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    { name: "resolution", type: "textarea", required: true },
    homepageClientLink,
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
