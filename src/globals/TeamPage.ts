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

function memberFields(): Field[] {
  return [
    imageField(),
    { name: "name", type: "text", required: true },
    { name: "role", type: "text" },
    {
      name: "href",
      label: "Read more URL",
      type: "text",
      admin: {
        description: "Where Read more goes. Leave empty until that page exists.",
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
              fields: memberFields(),
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
              fields: memberFields(),
            },
          ],
        },
      ],
    },
  ],
};
