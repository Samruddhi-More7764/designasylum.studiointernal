import type { Field } from "payload";

type MediaLayout = "full" | "split";

function slotLayout(
  data:
    | {
        hero?: { layout?: MediaLayout | null };
        gallery?: ({ layout?: MediaLayout | null } | null)[] | null;
      }
    | undefined,
  path: (number | string)[],
): MediaLayout {
  if (!data) return "full";
  if (path[0] === "hero") return data.hero?.layout === "split" ? "split" : "full";
  if (path[0] === "gallery" && typeof path[1] === "number") {
    return data.gallery?.[path[1]]?.layout === "split" ? "split" : "full";
  }
  return "full";
}

const mediaDescription = "Photo, GIF, or video (MP4, WebM, MOV).";

function mediaUpload(when: MediaLayout): Field {
  return {
    name: "image",
    type: "upload",
    relationTo: "media",
    admin: { description: mediaDescription },
    validate: (value, { data, path }) => {
      if (slotLayout(data, path) !== when) return true;
      return value ? true : "Upload a photo, GIF, or video.";
    },
  };
}

function mediaAlt(when: MediaLayout): Field {
  return {
    name: "alt",
    type: "text",
    validate: (value, { data, path }) => {
      if (slotLayout(data, path) !== when) return true;
      return typeof value === "string" && value.trim()
        ? true
        : "Add a short description.";
    },
  };
}

function sideGroup(name: "left" | "right", label: string): Field {
  return {
    name,
    type: "group",
    label,
    admin: {
      condition: (_data, siblingData) => siblingData?.layout === "split",
    },
    fields: [mediaUpload("split"), mediaAlt("split")],
  };
}

const layoutField: Field = {
  name: "layout",
  type: "select",
  required: true,
  defaultValue: "full",
  options: [
    { label: "Complete", value: "full" },
    { label: "Two columns", value: "split" },
  ],
  admin: {
    description:
      "Complete is one media filling the frame. Two columns is a photo, GIF, or video on each side — any mix.",
  },
};

/** Hero already stores the file at hero.image.image. Keep that path. */
const heroMediaFields: Field[] = [
  layoutField,
  {
    name: "image",
    type: "group",
    label: "Complete media",
    admin: {
      condition: (_data, siblingData) => siblingData?.layout !== "split",
    },
    fields: [mediaUpload("full"), mediaAlt("full")],
  },
  sideGroup("left", "Column 1"),
  sideGroup("right", "Column 2"),
];

/**
 * Gallery rows already store the file on `image` / `alt`.
 * Do not wrap those in another group — that would point at new columns.
 */
const galleryMediaFields: Field[] = [
  layoutField,
  {
    ...mediaUpload("full"),
    label: "Complete media",
    admin: {
      description: mediaDescription,
      condition: (_data, siblingData) => siblingData?.layout !== "split",
    },
  },
  {
    ...mediaAlt("full"),
    admin: {
      condition: (_data, siblingData) => siblingData?.layout !== "split",
    },
  },
  sideGroup("left", "Column 1"),
  sideGroup("right", "Column 2"),
];

export const caseStudyFields: Field[] = [
  {
    name: "hero",
    type: "group",
    fields: [
      { name: "heading", type: "text", required: true },
      {
        name: "breadcrumbCurrent",
        type: "text",
        admin: {
          description: "Last breadcrumb crumb. Defaults to the study title.",
        },
      },
      {
        name: "breadcrumb",
        type: "array",
        admin: {
          hidden: true,
          description:
            "Optional. Leave empty to auto-build Home / clients / {client}.",
        },
        fields: [
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
        ],
      },
      ...heroMediaFields,
    ],
  },
  {
    name: "details",
    type: "group",
    fields: [
      { name: "quote", type: "textarea", required: true },
      {
        name: "logo",
        label: "Logo under the quote",
        type: "upload",
        relationTo: "media",
        admin: {
          description:
            "Shown in the 54×54 circle under the quote. Choosing a file updates the live case study — refresh that page to see it. Clear the file to bring the orange mark back.",
          components: {
            afterInput: ["./components/admin/PersistQuoteLogo#PersistQuoteLogo"],
          },
        },
      },
      {
        name: "tableHeading",
        type: "text",
        required: true,
        label: "Table caption",
        admin: {
          description:
            "Heading shown above the table — e.g. \"Details\". This is a caption on its own, not a row, so it has no value beside it. Add label/value pairs under Rows below.",
        },
      },
      {
        name: "rows",
        type: "array",
        label: "Rows",
        admin: {
          description:
            "Each row is a label/value pair (e.g. Client → Sevenloop). If you leave this empty the page falls back to placeholder rows.",
        },
        fields: [
          { name: "label", type: "text", required: true },
          { name: "value", type: "text", required: true },
        ],
      },
    ],
  },
  {
    name: "gallery",
    type: "array",
    fields: galleryMediaFields,
  },
  {
    name: "viewAll",
    type: "group",
    fields: [
      {
        name: "label",
        type: "text",
        required: true,
        defaultValue: "View All Clients",
      },
      {
        name: "href",
        type: "text",
        required: true,
        defaultValue: "/",
      },
    ],
  },
];
