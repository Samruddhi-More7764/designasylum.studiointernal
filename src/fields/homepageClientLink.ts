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
  },
};
