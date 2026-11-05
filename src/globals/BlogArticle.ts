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
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data?.relatedBlogs || !Array.isArray(data.relatedBlogs)) return data;
        for (const row of data.relatedBlogs) {
          if (!row || !row.post) continue;
          const postId = typeof row.post === "object" ? row.post.id : row.post;
          if (!postId) continue;
          if (!row.image) {
            try {
              const linked = await req.payload.findByID({
                collection: "blog-posts",
                id: postId,
                depth: 0,
              });
              if (linked) {
                const defaultImage = linked.heroImage || linked.image;
                if (defaultImage) {
                  row.image = defaultImage;
                }
              }
            } catch {
              // ignore lookup errors
            }
          }
        }
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
