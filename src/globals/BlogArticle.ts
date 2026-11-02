import type { GlobalConfig } from "payload";
import {
  blogArticleAuthorFields,
  blogArticleContentFields,
  blogArticleFaqFields,
  blogArticleHeroFields,
  blogArticleRelatedFields,
  blogArticleTopicFields,
} from "../fields/blogArticleFields";

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
          fields: blogArticleHeroFields,
        },
        {
          label: "Article",
          fields: blogArticleContentFields,
        },
        {
          label: "FAQs",
          fields: blogArticleFaqFields,
        },
        {
          label: "Author",
          fields: blogArticleAuthorFields,
        },
        {
          label: "Topics",
          fields: blogArticleTopicFields,
        },
        {
          label: "Related blogs",
          fields: blogArticleRelatedFields,
        },
      ],
    },
  ],
};
