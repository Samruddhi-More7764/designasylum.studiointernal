import type { Field, GlobalConfig } from "payload";

function memberFields(isLeadership: boolean): Field[] {
  return [
    {
      name: "member",
      label: isLeadership ? "Linked Leadership Profile" : "Linked Team Member Profile",
      type: "relationship",
      relationTo: "team-members",
      ...(isLeadership ? { filterOptions: { isLeadership: { equals: true } } } : {}),
      admin: {
        description: isLeadership
          ? "Select a leadership profile created under Collections > Team & Leadership. The card automatically uses their photo, name, role, and profile link."
          : "Select a profile created under Collections > Team & Leadership. The card automatically uses their photo, name, role, and profile link.",
      },
    },
    {
      name: "customOverride",
      label: "Customize photo, name, or role for this card",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.member),
        description:
          "Check this only if you want to override the name, role, or photo from the linked profile.",
      },
    },
    {
      name: "image",
      label: "Photo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image/" } },
      admin: {
        condition: (_data, siblingData) => !siblingData?.member || Boolean(siblingData?.customOverride),
        description: "Upload a photo for this card.",
      },
    },
    {
      name: "name",
      type: "text",
      admin: {
        condition: (_data, siblingData) => !siblingData?.member || Boolean(siblingData?.customOverride),
        description: "Full name for this card.",
      },
    },
    {
      name: "role",
      type: "text",
      admin: {
        condition: (_data, siblingData) => !siblingData?.member || Boolean(siblingData?.customOverride),
        description: "Role / title for this card.",
      },
    },
  ];
}

/**
 * The team page at /team.
 * Empty fields fall back to the designed page.
 * "This is who you’d be working with." and Book an intro stay in code.
 */
export const TeamPage: GlobalConfig = {
  slug: "team-page",
  label: "Team",
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data;
        const autofillRows = async (rows: unknown) => {
          if (!Array.isArray(rows)) return;
          for (const row of rows) {
            if (!row || !row.member) continue;
            const rawId = typeof row.member === "object" ? row.member.id : row.member;
            const idNum = Number(rawId);
            if (isNaN(idNum)) continue;
            try {
              const member = await req.payload.findByID({
                collection: "team-members",
                id: idNum,
                depth: 0,
              });
              if (member) {
                if (!row.name || !row.customOverride) row.name = member.name;
                if (!row.role || !row.customOverride) row.role = member.role;
                const photoId =
                  typeof member.photoOne === "object" && member.photoOne
                    ? (member.photoOne as { id?: number }).id
                    : member.photoOne;
                if ((!row.image || !row.customOverride) && photoId) row.image = photoId;
              }
            } catch {
              // Ignore lookup errors
            }
          }
        };
        await autofillRows(data.leadership);
        await autofillRows(data.members);
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "heading", type: "text" },
            { name: "intro", type: "textarea" },
          ],
        },
        {
          label: "Leadership",
          fields: [
            { name: "leadershipHeading", label: "Heading", type: "text" },
            {
              name: "leadership",
              type: "array",
              fields: memberFields(true),
            },
          ],
        },
        {
          label: "Team",
          fields: [
            { name: "teamAccent", label: "Italic word", type: "text" },
            { name: "teamAfter", label: "Heading ending", type: "text" },
            {
              name: "members",
              label: "People",
              type: "array",
              fields: memberFields(false),
            },
          ],
        },
      ],
    },
  ],
};
