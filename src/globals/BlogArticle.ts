import type { Block, Field, GlobalConfig } from "payload";

const image: Field = {
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

const blocks: Block[] = [
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
      image,
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
        fields: [image, { name: "src", label: "Image path", type: "text", required: true }],
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

/**
 * The blog article at /blogs/sevenloop-brand-website-redesign.
 * Empty fields fall back to the designed page copy.
 */
export const BlogArticleGlobal: GlobalConfig = {
  slug: "blog-article",
  label: "Blog detail",
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "breadcrumbCurrent", label: "Breadcrumb", type: "text" },
            { name: "titleBefore", label: "Title", type: "text" },
            { name: "titleAccent", label: "Italic word", type: "text" },
            { name: "titleMiddle", label: "Title middle", type: "text" },
            { name: "titleLine", label: "Second line", type: "text" },
            { name: "intro", label: "Introduction", type: "textarea" },
            {
              ...image,
              name: "heroImage",
              label: "Image",
              admin: { description: "The wide image under the heading. Leave empty to keep the black block." },
            },
            { name: "bylineName", label: "Byline name", type: "text" },
            { name: "bylineDate", label: "Byline date", type: "text" },
            { ...image, name: "bylineAvatar", label: "Byline photo" },
          ],
        },
        {
          label: "Article",
          fields: [
            { name: "lead", label: "Lead", type: "textarea" },
            {
              name: "sections",
              type: "array",
              admin: {
                description: "Each section is a heading, its blocks, and a table-of-contents item.",
              },
              fields: [
                { name: "anchor", label: "Id", type: "text", required: true },
                { name: "tocLabel", label: "Table of contents label", type: "text", required: true },
                { name: "headingBefore", label: "Heading before the italic", type: "text" },
                { name: "headingAccent", label: "Italic heading", type: "text" },
                { name: "headingAfter", label: "Heading after the italic", type: "text" },
                { name: "blocks", type: "blocks", blocks },
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
          label: "Author",
          fields: [
            { ...image, name: "authorImage", label: "Photo" },
            { name: "authorName", type: "text" },
            { name: "authorRole", label: "Role", type: "text" },
            { name: "authorBio", label: "Bio", type: "textarea" },
          ],
        },
        {
          label: "Topics",
          fields: [
            { name: "topicsBefore", label: "Heading", type: "text" },
            { name: "topicsAccent", label: "Italic word", type: "text" },
            { name: "topicsAfter", label: "Heading ending", type: "text" },
            {
              name: "topics",
              type: "array",
              fields: [{ name: "label", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Related blogs",
          fields: [
            { name: "relatedBefore", label: "Heading", type: "text" },
            { name: "relatedAccent", label: "Italic word", type: "text" },
            {
              name: "relatedBlogs",
              label: "Posts",
              type: "array",
              fields: [
                image,
                { name: "date", type: "text" },
                { name: "readTime", label: "Read time", type: "text" },
                { name: "title", type: "text", required: true },
                { name: "href", label: "URL", type: "text" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
