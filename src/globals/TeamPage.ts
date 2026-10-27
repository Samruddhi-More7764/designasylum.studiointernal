import type { Field, GlobalConfig } from "payload";

function imageField(): Field {
  return {
    name: "image",
    label: "Photo",
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image/" } },
    admin: {
      description: "Leave empty to keep the designed portrait.",
    },
  };
}

function leadershipMemberFields(): Field[] {
  return [
    {
      name: "member",
      label: "Linked Leadership Profile",
      type: "relationship",
      relationTo: "team-members",
      filterOptions: {
        isLeadership: { equals: true },
      },
      admin: {
        description:
          "Select a leadership profile created under Collections > Team & Leadership (must have 'Leadership Member' checked). Automatically links 'Read more' to /team/[slug]. Use '+' to create a new leadership profile with full details (bio, services, etc.).",
      },
    },
    imageField(),
    { name: "name", type: "text", required: true },
    { name: "role", type: "text" },
    {
      name: "href",
      label: "Custom Read more URL",
      type: "text",
      admin: {
        description: "Optional override. If a Linked Leadership Profile is selected above, this can be left empty.",
      },
    },
  ];
}

function teamMemberFields(): Field[] {
  return [
    {
      name: "member",
      label: "Linked Team Member Profile",
      type: "relationship",
      relationTo: "team-members",
      admin: {
        description:
          "Select a profile created under Collections > Team & Leadership. Automatically links 'Read more' to /team/[slug]. Use '+' to create a new team profile.",
      },
    },
    imageField(),
    { name: "name", type: "text", required: true },
    { name: "role", type: "text" },
    {
      name: "href",
      label: "Custom Read more URL",
      type: "text",
      admin: {
        description: "Optional override. If a Linked Team Member Profile is selected above, this can be left empty.",
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
              fields: leadershipMemberFields(),
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
              fields: teamMemberFields(),
            },
          ],
        },
      ],
    },
  ],
};
