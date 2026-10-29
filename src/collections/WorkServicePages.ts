import type {
  ArrayField,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
} from "payload";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.title || "");
  if (source) data.slug = slugify(source);
  return data;
};

function lines(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: "array",
    fields: [{ name: "text", type: "textarea", required: true }],
  };
}

const imageUpload: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

export const WorkServicePages: CollectionConfig = {
  slug: "work-service-pages",
  labels: {
    singular: "Work Service Page",
    plural: "Work Service Pages",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Work service blueprint pages accessible at /work/[slug].",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug],
  },
  fields: [
    {
      name: "title",
      label: "Work Service Name",
      type: "text",
      required: true,
      admin: {
        description:
          "e.g. 'B2B Website Design', 'Website Projects', '3D & Motion', 'Thinking'. Used as default footer link label.",
      },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "URL slug, e.g. 'b2b-website-design' (accessible at /work/b2b-website-design).",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "breadcrumbCurrent",
              label: "Breadcrumb",
              type: "text",
              admin: { description: "Leave empty to use the Work Service Name." },
            },
            { name: "heroTitle", label: "Title", type: "text" },
            { name: "heroIntro", label: "Introduction", type: "textarea" },
            { ...imageUpload, name: "heroImage", label: "Hero image" },
          ],
        },
        {
          label: "Article",
          fields: [
            {
              name: "lead",
              type: "textarea",
              admin: { description: "The large paragraph above the first section." },
            },
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section", plural: "Sections" },
              admin: {
                description:
                  "Each section becomes a heading, its body, and a table-of-contents item.",
              },
              fields: [
                {
                  name: "anchor",
                  type: "text",
                  required: true,
                  admin: { description: "Stable id, for example definitive-guide." },
                },
                { name: "tocLabel", label: "Table of contents label", type: "text", required: true },
                { name: "headingBefore", label: "Heading before the italic", type: "text" },
                { name: "headingAccent", label: "Italic heading", type: "text" },
                { name: "headingAfter", label: "Heading after the italic", type: "text" },
                lines("paragraphs", "Paragraphs"),
                {
                  name: "pointers",
                  type: "array",
                  fields: [
                    { name: "term", type: "text" },
                    { name: "text", type: "textarea", required: true },
                  ],
                },
                lines("closing", "Closing paragraphs"),
                { name: "highlightTitle", label: "Highlight title", type: "textarea" },
                { name: "highlightBody", label: "Highlight body", type: "textarea" },
              ],
            },
          ],
        },
        {
          label: "Logos",
          fields: [
            {
              name: "logos",
              type: "array",
              labels: { singular: "Logo", plural: "Logos" },
              admin: {
                description:
                  "Logos on this work service page only. They do not change the homepage.",
              },
              fields: [
                imageUpload,
                { name: "name", type: "text", required: true },
                {
                  name: "width",
                  type: "number",
                  admin: { description: "Width inside card, in pixels. Default 160." },
                },
                {
                  name: "height",
                  type: "number",
                  admin: { description: "Height inside card, in pixels. Default 48." },
                },
                {
                  name: "row",
                  type: "select",
                  options: [
                    { label: "Top row", value: "1" },
                    { label: "Bottom row", value: "2" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Clients",
          fields: [
            {
              name: "clientsBefore",
              label: "Heading before italic",
              type: "text",
              admin: { description: "e.g. 'Clients we did'" },
            },
            {
              name: "clientsAccent",
              label: "Italic heading word",
              type: "text",
              admin: { description: "e.g. 'branding'" },
            },
            {
              name: "clientsAfter",
              label: "Heading ending",
              type: "text",
              admin: { description: "e.g. 'for'" },
            },
            {
              name: "clientTabs",
              label: "Tabs",
              type: "array",
              fields: [
                { name: "tabId", label: "Id", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
            {
              name: "projects",
              label: "Client Projects (Select from Clients)",
              type: "array",
              fields: [
                {
                  name: "client",
                  label: "Select Client",
                  type: "relationship",
                  relationTo: "clients",
                  admin: {
                    description: "Select from clients list to automatically pull name, image, and link.",
                  },
                },
                imageUpload,
                {
                  name: "name",
                  type: "text",
                  admin: { description: "Leave empty to use client name." },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: { description: "Project summary or case study highlights." },
                },
                {
                  name: "href",
                  label: "Custom URL",
                  type: "text",
                  admin: { description: "Leave empty to link directly to the client page." },
                },
                {
                  name: "tab",
                  label: "Client tab",
                  type: "select",
                  options: [
                    { label: "Solution", value: "solution" },
                    { label: "Service", value: "service" },
                    { label: "Industry", value: "industry" },
                    { label: "Branding Projects", value: "branding-projects" },
                  ],
                  admin: {
                    description: "Which tab this project appears under. Leave empty to show on all tabs.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "FAQs",
          fields: [
            {
              name: "faqs",
              type: "array",
              labels: { singular: "Question", plural: "FAQs" },
              fields: [
                { name: "question", type: "text", required: true },
                {
                  name: "answer",
                  type: "textarea",
                  admin: { description: "Leave empty to keep the question closed." },
                },
              ],
            },
          ],
        },
        {
          label: "Experts",
          fields: [
            {
              name: "expertsBefore",
              label: "Heading before italic",
              type: "text",
              admin: { description: "e.g. 'Branding'" },
            },
            {
              name: "expertsAccent",
              label: "Italic word",
              type: "text",
              admin: { description: "e.g. 'experts'" },
            },
            { name: "expertsSubheading", label: "Subheading", type: "textarea" },
            {
              name: "experts",
              label: "Branding Experts (Select from Team Members)",
              type: "array",
              fields: [
                {
                  name: "member",
                  label: "Select Team Member",
                  type: "relationship",
                  relationTo: "team-members",
                  admin: {
                    description: "Select from team members (leadership or team member) to automatically link profile.",
                  },
                },
                imageUpload,
                {
                  name: "name",
                  type: "text",
                  admin: { description: "Leave empty to use member name." },
                },
                {
                  name: "role",
                  type: "text",
                  admin: { description: "Leave empty to use member role." },
                },
                {
                  name: "readMoreUrl",
                  label: "Custom Read more URL",
                  type: "text",
                  admin: { description: "Leave empty to automatically link to /team/[slug]." },
                },
              ],
            },
          ],
        },
        {
          label: "Related blogs",
          fields: [
            {
              name: "relatedBefore",
              label: "Heading before italic",
              type: "text",
              admin: { description: "e.g. 'Related'" },
            },
            {
              name: "relatedAccent",
              label: "Italic word",
              type: "text",
              admin: { description: "e.g. 'blogs'" },
            },
            {
              name: "relatedBlogs",
              label: "Related Blogs (Select from all blogs list)",
              type: "array",
              fields: [
                {
                  name: "post",
                  label: "Select Blog Post",
                  type: "relationship",
                  relationTo: "blog-posts",
                  admin: {
                    description: "Select from all blogs list to automatically pull title, image, date, and link.",
                  },
                },
                imageUpload,
                { name: "date", type: "text" },
                { name: "readTime", label: "Read time", type: "text" },
                {
                  name: "title",
                  type: "text",
                  admin: { description: "Leave empty to use blog post title." },
                },
                {
                  name: "href",
                  label: "Custom URL",
                  type: "text",
                  admin: { description: "Leave empty to use blog post link." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
