import type { Block, Field } from "payload";

export const blogUploadImage: Field = {
  name: "image",
  type: "upload",
  relationTo: "media",
  filterOptions: { mimeType: { contains: "image/" } },
};

const textList = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [{ name: "text", type: "textarea", required: true }],
});

export const blogArticleBlocks: Block[] = [
  {
    slug: "paragraphs",
    labels: { singular: "Paragraphs", plural: "Paragraphs" },
    fields: [textList("items", "Paragraphs")],
  },
  {
    slug: "rich",
    labels: { singular: "Paragraph with bold", plural: "Paragraphs with bold" },
    fields: [
      {
        name: "parts",
        type: "array",
        fields: [
          { name: "text", type: "textarea", required: true },
          { name: "strong", label: "Bold", type: "checkbox" },
        ],
      },
    ],
  },
  {
    slug: "subhead",
    labels: { singular: "Subheading", plural: "Subheadings" },
    fields: [
      { name: "title", type: "text", required: true },
      { name: "body", type: "textarea" },
    ],
  },
  {
    slug: "arrows",
    labels: { singular: "Arrow list", plural: "Arrow lists" },
    fields: [
      {
        name: "items",
        type: "array",
        fields: [
          { name: "lead", label: "Bold lead", type: "text" },
          { name: "rest", type: "text", required: true },
        ],
      },
    ],
  },
  {
    slug: "rows",
    labels: { singular: "Rows", plural: "Rows" },
    fields: [
      {
        name: "items",
        type: "array",
        fields: [
          { name: "label", type: "text", required: true },
          { name: "value", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    slug: "image",
    labels: { singular: "Image", plural: "Images" },
    fields: [
      blogUploadImage,
      { name: "src", label: "Image path", type: "text" },
      { name: "alt", type: "text" },
    ],
  },
  {
    slug: "gallery",
    labels: { singular: "Gallery", plural: "Galleries" },
    fields: [
      { name: "alt", type: "text" },
      {
        name: "images",
        type: "array",
        fields: [blogUploadImage, { name: "src", label: "Image path", type: "text", required: true }],
      },
    ],
  },
  {
    slug: "quote",
    labels: { singular: "Quote", plural: "Quotes" },
    fields: [
      { name: "quote", type: "textarea", required: true },
      { name: "name", type: "text", required: true },
      { name: "role", type: "text" },
    ],
  },
  {
    slug: "note",
    labels: { singular: "Note", plural: "Notes" },
    fields: [
      { name: "kicker", type: "text" },
      { name: "body", type: "textarea", required: true },
    ],
  },
  {
    slug: "links",
    labels: { singular: "Links", plural: "Links" },
    fields: [
      { name: "kicker", type: "text" },
      {
        name: "items",
        type: "array",
        fields: [
          { name: "label", type: "text", required: true },
          { name: "href", label: "URL", type: "text", required: true },
        ],
      },
    ],
  },
];

export const blogArticleHeroFields: Field[] = [
  { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
  { name: "titleBefore", label: "Title before italic", type: "text" },
  { name: "titleAccent", label: "Italic title word", type: "text" },
  { name: "titleMiddle", label: "Title middle", type: "text" },
  { name: "titleLine", label: "Title second line", type: "text" },
  { name: "intro", label: "Introduction", type: "textarea" },
  {
    ...blogUploadImage,
    name: "heroImage",
    label: "Hero Image",
    admin: { description: "The wide image under the heading. Leave empty to use the card image." },
  },
  { name: "bylineName", label: "Byline name", type: "text" },
  { name: "bylineDate", label: "Byline date", type: "text" },
  { ...blogUploadImage, name: "bylineAvatar", label: "Byline photo" },
];

export const blogArticleContentFields: Field[] = [
  { name: "lead", label: "Lead paragraph", type: "textarea" },
  {
    name: "sections",
    type: "array",
    admin: {
      description: "Each section is a heading, its content blocks, and a table-of-contents item.",
    },
    fields: [
      { name: "anchor", label: "Id (anchor)", type: "text", required: true },
      { name: "tocLabel", label: "Table of contents label", type: "text", required: true },
      { name: "headingBefore", label: "Heading before the italic", type: "text" },
      { name: "headingAccent", label: "Italic heading", type: "text" },
      { name: "headingAfter", label: "Heading after the italic", type: "text" },
      { name: "blocks", type: "blocks", blocks: blogArticleBlocks },
    ],
  },
];

export const blogArticleFaqFields: Field[] = [
  {
    name: "faqs",
    type: "array",
    fields: [
      { name: "question", type: "text", required: true },
      {
        name: "answer",
        type: "textarea",
        admin: { description: "Leave empty to keep the question closed." },
      },
    ],
  },
];

export const blogArticleAuthorFields: Field[] = [
  { ...blogUploadImage, name: "authorImage", label: "Photo" },
  { name: "authorName", type: "text" },
  { name: "authorRole", label: "Role", type: "text" },
  { name: "authorBio", label: "Bio", type: "textarea" },
  {
    name: "authorMember",
    label: "Linked Team Member Profile",
    type: "relationship",
    relationTo: "team-members",
    admin: {
      description:
        "Optional: Select a team member profile to automatically link the author to /team/[slug].",
    },
  },
];

export const blogArticleTopicFields: Field[] = [
  { name: "topicsBefore", label: "Heading", type: "text" },
  { name: "topicsAccent", label: "Italic word", type: "text" },
  { name: "topicsAfter", label: "Heading ending", type: "text" },
  {
    name: "topics",
    type: "array",
    fields: [{ name: "label", type: "text", required: true }],
  },
];

export const blogArticleRelatedFields: Field[] = [
  { name: "relatedBefore", label: "Heading", type: "text" },
  { name: "relatedAccent", label: "Italic word", type: "text" },
  {
    name: "relatedBlogs",
    label: "Posts",
    type: "array",
    fields: [
      {
        name: "post",
        label: "Select Blog Post",
        type: "relationship",
        relationTo: "blog-posts",
        admin: {
          description:
            "Select a post from Collections > Blog Posts. Title, date, read time, image, and link will auto-fill from it.",
        },
      },
      {
        ...blogUploadImage,
        admin: {
          description: "Leave empty to use hero image from selected blog post.",
        },
      },
      {
        name: "date",
        type: "text",
        admin: {
          description: "Leave empty to use date from selected blog post.",
        },
      },
      {
        name: "readTime",
        label: "Read time",
        type: "text",
      },
      {
        name: "title",
        type: "text",
        admin: {
          description: "Leave empty to use title from selected blog post.",
        },
      },
    ],
  },
];

