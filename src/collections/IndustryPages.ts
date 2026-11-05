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

const autofillIndustryPageFields: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data;

  // 1. Logos autofill from clientLogo
  if (Array.isArray(data.logos)) {
    for (const row of data.logos) {
      if (!row || !row.clientLogo) continue;
      const logoId = typeof row.clientLogo === "object" ? row.clientLogo.id : row.clientLogo;
      if (!logoId) continue;
      if (!row.image || !row.name) {
        try {
          const logoDoc = await req.payload.findByID({
            collection: "client-logos",
            id: logoId,
            depth: 0,
          });
          if (logoDoc) {
            if (!row.image && logoDoc.image) row.image = logoDoc.image;
            if (!row.name && logoDoc.name) row.name = logoDoc.name;
          }
        } catch {}
      }
    }
  }

  // 2. Clients tab projects autofill from client
  if (Array.isArray(data.projects)) {
    for (let i = 0; i < data.projects.length; i++) {
      const row = data.projects[i];
      if (!row) continue;
      if (row.order == null) row.order = i;
      if (!row.client) continue;
      const clientId = typeof row.client === "object" ? row.client.id : row.client;
      if (!clientId) continue;
      if (!row.heading || !row.name || !row.image || !row.description || !row.href) {
        try {
          const clientDoc = await req.payload.findByID({
            collection: "clients",
            id: clientId,
            depth: 0,
          });
          if (clientDoc) {
            if (!row.heading && clientDoc.name) row.heading = clientDoc.name;
            if (!row.name && clientDoc.name) row.name = clientDoc.name;
            const heroImg = clientDoc.hero?.image;
            if (!row.image && heroImg) row.image = heroImg;
            if (!row.description) {
              row.description =
                clientDoc.adminTitle || clientDoc.hero?.subheading || clientDoc.hero?.heading || "";
            }
            if (clientDoc.slug) {
              const cleanSlug = clientDoc.slug.replace(/^\/+|\/+$/g, "").trim();
              row.href = `/clients/${cleanSlug}`;
            }
          }
        } catch {}
      }
    }
  }

  // 3. Experts autofill from member
  if (Array.isArray(data.experts)) {
    for (const row of data.experts) {
      if (!row || !row.member) continue;
      const memberId = typeof row.member === "object" ? row.member.id : row.member;
      if (!memberId) continue;
      if (!row.name || !row.role || !row.image) {
        try {
          const memberDoc = await req.payload.findByID({
            collection: "team-members",
            id: memberId,
            depth: 0,
          });
          if (memberDoc) {
            if (!row.name && memberDoc.name) row.name = memberDoc.name;
            if (!row.role && memberDoc.role) row.role = memberDoc.role;
            if (!row.image) {
              const defaultPhoto = memberDoc.photoOne || memberDoc.photoTwo;
              if (defaultPhoto) row.image = defaultPhoto;
            }
          }
        } catch {}
      }
    }
  }

  // 4. Related blogs autofill from post
  if (Array.isArray(data.relatedBlogs)) {
    for (const row of data.relatedBlogs) {
      if (!row || !row.post) continue;
      const postId = typeof row.post === "object" ? row.post.id : row.post;
      if (!postId) continue;
      if (!row.image || !row.title || !row.date || !row.readTime) {
        try {
          const postDoc = await req.payload.findByID({
            collection: "blog-posts",
            id: postId,
            depth: 0,
          });
          if (postDoc) {
            if (!row.image) {
              const defaultImg = postDoc.heroImage || postDoc.image;
              if (defaultImg) row.image = defaultImg;
            }
            if (!row.title && postDoc.title) row.title = postDoc.title;
            if (!row.date && postDoc.date) row.date = postDoc.date;
            if (!row.readTime && postDoc.readTime) row.readTime = postDoc.readTime;
          }
        } catch {}
      }
    }
  }

  return data;
};

export const IndustryPages: CollectionConfig = {
  slug: "industry-pages",
  labels: {
    singular: "Industry Page",
    plural: "Industry Pages",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Industry blueprint pages accessible at /industries/[slug].",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug, autofillIndustryPageFields],
  },
  fields: [
    {
      name: "title",
      label: "Industry Name",
      type: "text",
      required: true,
      admin: {
        description: "e.g. 'Manufacturing', 'Fintech', 'Deeptech'. Used as default footer link label.",
      },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL slug, e.g. 'manufacturing' (accessible at /industries/manufacturing).",
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
              admin: { description: "Leave empty to use the Industry Name." },
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
              admin: { description: "The large paragraph at the top of the article." },
            },
            {
              ...lines("preface", "Preface"),
              admin: {
                description: "The paragraphs between the lead and the first heading.",
              },
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
                  admin: { description: "Stable id, for example manufacturing-website-orders." },
                },
                { name: "tocLabel", label: "Table of contents label", type: "text", required: true },
                { name: "headingBefore", label: "Heading before the italic", type: "text" },
                { name: "headingAccent", label: "Italic heading", type: "text" },
                { name: "headingAfter", label: "Heading after the italic", type: "text" },
                lines("paragraphs", "Paragraphs"),
                {
                  name: "blocks",
                  type: "array",
                  labels: { singular: "Block", plural: "Blocks" },
                  admin: { description: "A bold subheading followed by paragraphs." },
                  fields: [
                    { name: "title", type: "text", required: true },
                    lines("paragraphs", "Paragraphs"),
                  ],
                },
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
                  "Logos on this industry page only. Leave empty to use homepage logos.",
              },
              fields: [
                {
                  name: "clientLogo",
                  label: "Select Client Logo",
                  type: "relationship",
                  relationTo: "client-logos",
                  admin: {
                    description:
                      "Pick a logo from Collections > Client Logos. Name and image will auto-fill from it, with the option to edit/override.",
                  },
                },
                {
                  ...imageUpload,
                  admin: { description: "Leave empty to use image from selected client logo." },
                },
                {
                  name: "name",
                  type: "text",
                  admin: { description: "Leave empty to use client logo name." },
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
              admin: { description: "e.g. 'Design projects in'" },
            },
            {
              name: "clientsAccent",
              label: "Italic heading word",
              type: "text",
              admin: { description: "e.g. 'manufacturing'" },
            },
            {
              name: "clientsAfter",
              label: "Heading ending",
              type: "text",
              admin: { description: "e.g. 'industry'" },
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
              label: "Design Projects (Select from Clients)",
              type: "array",
              fields: [
                {
                  name: "client",
                  label: "Select Client",
                  type: "relationship",
                  relationTo: "clients",
                  admin: {
                    description:
                      "Select from existing clients list to automatically pull heading, image, description, and link.",
                  },
                },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  defaultValue: "industry",
                  options: [
                    { label: "Solution", value: "solution" },
                    { label: "Service", value: "service" },
                    { label: "Industry", value: "industry" },
                    { label: "Branding Projects", value: "branding-projects" },
                  ],
                  admin: {
                    description: "Which category tab this project appears under. Defaults to Industry.",
                  },
                },
                {
                  name: "order",
                  label: "Order",
                  type: "number",
                  defaultValue: 0,
                  admin: {
                    description: "Display order. Lower numbers appear first.",
                  },
                },
                {
                  name: "heading",
                  label: "Heading",
                  type: "text",
                  admin: { description: "Project heading. Leave empty to use client name." },
                },
                {
                  name: "description",
                  label: "Description",
                  type: "textarea",
                  admin: { description: "Project summary or highlights. Leave empty to use client description." },
                },
                {
                  ...imageUpload,
                  admin: { description: "Project image. Leave empty to use client hero image." },
                },
                {
                  name: "href",
                  type: "text",
                  admin: { hidden: true },
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
              admin: { description: "e.g. 'Manufacturing design'" },
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
              label: "Industry Design Experts (Select from Team Members)",
              type: "array",
              fields: [
                {
                  name: "member",
                  label: "Select Team Member",
                  type: "relationship",
                  relationTo: "team-members",
                  admin: {
                    description:
                      "Select from team members to automatically pull name, role, photo, and link, with the option to edit.",
                  },
                },
                {
                  ...imageUpload,
                  admin: { description: "Leave empty to use photo from selected team member." },
                },
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
                {
                  ...imageUpload,
                  admin: { description: "Leave empty to use hero image from selected blog post." },
                },
                {
                  name: "date",
                  type: "text",
                  admin: { description: "Leave empty to use date from selected blog post." },
                },
                {
                  name: "readTime",
                  label: "Read time",
                  type: "text",
                },
                {
                  name: "title",
                  type: "text",
                  admin: { description: "Leave empty to use blog post title." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
