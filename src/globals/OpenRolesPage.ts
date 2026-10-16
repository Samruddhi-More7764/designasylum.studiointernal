import type { GlobalConfig } from "payload";

const departments = [
  { label: "UI/UX Design", value: "ui-ux" },
  { label: "Brand & Graphic Design", value: "brand" },
  { label: "Web Development", value: "web" },
  { label: "Video Editing", value: "video" },
  { label: "Content & Copy", value: "content" },
  { label: "Project Management", value: "project" },
  { label: "Marketing", value: "marketing" },
];

/**
 * Job openings at /open-roles.
 * Empty fields fall back to the designed page copy.
 * Category counts are counted from the roles list.
 */
export const OpenRolesPage: GlobalConfig = {
  slug: "open-roles-page",
  label: "Open roles",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Heading",
          fields: [
            { name: "titleBefore", label: "Title", type: "text" },
            { name: "titleAccent", label: "Italic word", type: "text" },
            { name: "titleAfter", label: "Title ending", type: "text" },
          ],
        },
        {
          label: "Categories",
          fields: [
            {
              name: "categories",
              type: "array",
              admin: { description: "Include All roles first. Counts are added from the roles list." },
              fields: [
                {
                  name: "categoryId",
                  label: "Id",
                  type: "select",
                  required: true,
                  options: [{ label: "All roles", value: "all" }, ...departments],
                },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Roles",
          fields: [
            { name: "dutiesHeading", label: "“What you’ll do” heading", type: "text" },
            { name: "lookingHeading", label: "“What we’re looking for” heading", type: "text" },
            {
              name: "roles",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "slug",
                  type: "text",
                  admin: { description: "URL for this role, after /open-roles/. Apply on the list opens this page." },
                },
                { name: "breadcrumb", label: "Breadcrumb", type: "text" },
                { name: "summary", type: "textarea", required: true },
                {
                  name: "category",
                  type: "select",
                  required: true,
                  options: departments,
                },
                { name: "location", label: "Card location", type: "text" },
                { name: "employment", label: "Card employment type", type: "text" },
                { name: "experience", label: "Card experience", type: "text" },
                { name: "applyLabel", label: "List button", type: "text" },
                { name: "detailLocation", label: "Detail location", type: "text" },
                { name: "detailExperience", label: "Detail experience", type: "text" },
                { name: "detailType", label: "Detail type", type: "text" },
                {
                  name: "responsibilities",
                  label: "What you’ll do",
                  type: "array",
                  fields: [{ name: "text", type: "text", required: true }],
                },
                {
                  name: "requirements",
                  label: "What we’re looking for",
                  type: "array",
                  fields: [{ name: "text", type: "text", required: true }],
                },
                { name: "applyNowLabel", label: "Apply now label", type: "text" },
                {
                  name: "applyNowHref",
                  label: "Apply now link",
                  type: "text",
                  admin: { description: "Where Apply now goes. Defaults to the careers form." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
