import type { Field } from "payload";

/** Homepage card → Client; URL is derived from Client.projectType. */
export const homepageClientLink: Field = {
  name: "client",
  type: "relationship",
  relationTo: "clients",
  required: true,
  admin: {
    description:
      "Card opens this Client: Hub → /clients/{slug}; Direct → that client’s featured case study.",
    // Required stays on for the form. The condition keeps the Postgres column
    // nullable so ON DELETE SET NULL can clear this id when the client is deleted.
    // Without that, the admin keeps a dead id and shows "document could not be found".
    condition: () => true,
  },
};
