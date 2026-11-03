import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    // Lock the account for 10 minutes after 5 consecutive wrong passwords.
    // This prevents brute-force attacks without affecting legitimate users.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes in ms
  },
  // Explicitly require authentication for all operations.
  // This prevents the public API from being used to register new CMS users.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
