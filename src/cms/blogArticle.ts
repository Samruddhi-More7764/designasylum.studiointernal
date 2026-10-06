import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import { relatedBlogs, relatedBlogsHeading } from "@/data/brandingAgencyPage";
import {
  sevenloopFaqItems,
  sevenloopLead,
  sevenloopSections,
  sevenloopTopics,
  type ArticleBlock,
  type ArticleSection,
} from "@/data/sevenloopArticle";

const storyImage = "/assets/images/blog/story.jpg";
const avatar = "/assets/images/blog/avatar.png";
const authorImage = "/assets/images/blog/author.png";
const relatedImage = "/assets/images/branding-agency/related-blog.png";

type CmsBlock = {
  blockType?: string;
  items?: Array<Record<string, string | null | undefined> | null> | null;
  parts?: Array<{ text?: string | null; strong?: boolean | null } | null> | null;
  title?: string | null;
  body?: string | null;
  image?: unknown;
  src?: string | null;
  alt?: string | null;
  images?: Array<{ image?: unknown; src?: string | null } | null> | null;
  quote?: string | null;
  name?: string | null;
  role?: string | null;
  kicker?: string | null;
};

export type BlogArticleContent = {
  breadcrumbCurrent: string;
  titleBefore: string;
  titleAccent: string;
  titleMiddle: string;
  titleLine: string;
  intro: string;
  heroImage: string | null;
  bylineName: string;
  bylineDate: string;
  bylineAvatar: string;
  lead: string;
  sections: ArticleSection[];
  faqs: { question: string; answer?: string }[];
  authorImage: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  topicsBefore: string;
  topicsAccent: string;
  topicsAfter: string;
  topics: string[];
  relatedBefore: string;
  relatedAccent: string;
  relatedBlogs: {
    image: string;
    date: string;
    readTime: string;
    title: string;
    href: string;
    key: string;
  }[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function lines(rows: Array<{ text?: string | null } | null> | null | undefined) {
  return (rows || []).map((row) => row?.text?.trim() || "").filter(Boolean);
}

function blockFrom(block: CmsBlock, designed?: ArticleBlock): ArticleBlock | null {
  switch (block.blockType) {
    case "paragraphs": {
      const items = lines(block.items as Array<{ text?: string | null } | null>);
      return items.length ? { kind: "paragraphs", items } : designed?.kind === "paragraphs" ? designed : null;
    }
    case "rich": {
      const parts = (block.parts || [])
        .map((part) => {
          const value = part?.text?.trim() || "";
          if (!value) return null;
          return part?.strong ? { strong: value } : value;
        })
        .filter((part): part is string | { strong: string } => Boolean(part));
      return parts.length ? { kind: "rich", parts } : null;
    }
    case "subhead": {
      const title = block.title?.trim() || "";
      if (!title) return null;
      const body = block.body?.trim();
      return body ? { kind: "subhead", title, body } : { kind: "subhead", title };
    }
    case "arrows": {
      const items = (block.items || [])
        .map((item) => ({
          lead: item?.lead?.trim() || undefined,
          rest: item?.rest?.trim() || "",
        }))
        .filter((item) => item.rest);
      return items.length ? { kind: "arrows", items } : null;
    }
    case "rows": {
      const items = (block.items || [])
        .map((item) => ({
          label: item?.label?.trim() || "",
          value: item?.value?.trim() || "",
        }))
        .filter((item) => item.label && item.value);
      return items.length ? { kind: "rows", items } : null;
    }
    case "image": {
      const designedSrc = designed?.kind === "image" ? designed.src : storyImage;
      return {
        kind: "image",
        src: storedImage(block.image, block.src?.trim() || designedSrc),
        alt: block.alt?.trim() || (designed?.kind === "image" ? designed.alt : ""),
      };
    }
    case "gallery": {
      const designedSrcs = designed?.kind === "gallery" ? designed.srcs : [];
      const srcs = (block.images || [])
        .map((image, imageIndex) =>
          storedImage(image?.image, image?.src?.trim() || designedSrcs[imageIndex] || storyImage),
        )
        .filter(Boolean);
      if (!srcs.length) return null;
      return {
        kind: "gallery",
        srcs,
        alt: block.alt?.trim() || (designed?.kind === "gallery" ? designed.alt : ""),
      };
    }
    case "quote": {
      const quote = block.quote?.trim() || "";
      const name = block.name?.trim() || "";
      if (!quote || !name) return null;
      return { kind: "quote", quote, name, role: block.role?.trim() || "" };
    }
    case "note": {
      const body = block.body?.trim() || "";
      if (!body) return null;
      return { kind: "note", kicker: block.kicker?.trim() || "", body };
    }
    case "links": {
      const items = (block.items || [])
        .map((item) => ({
          href: item?.href?.trim() || "",
          label: item?.label?.trim() || "",
        }))
        .filter((item) => item.href && item.label);
      if (!items.length) return null;
      return { kind: "links", kicker: block.kicker?.trim() || "", items };
    }
    default:
      return null;
  }
}

const fallback: BlogArticleContent = {
  breadcrumbCurrent: "Sevenloop Brand Website Redesign",
  titleBefore: "Sevenloop ",
  titleAccent: "Rebrand",
  titleMiddle: " & Webflow Site: ",
  titleLine: "A 5-Month Case Study",
  intro:
    "How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.",
  heroImage: null,
  bylineName: "Tanmaya Rao",
  bylineDate: "Sept 28, 2026",
  bylineAvatar: avatar,
  lead: sevenloopLead,
  sections: sevenloopSections,
  faqs: sevenloopFaqItems,
  authorImage,
  authorName: "Athira Krishnan",
  authorRole: "Lead Designer | Content Strategist",
  authorBio:
    "Articulate with a clear thought process, she excels in content writing, driving design in B2B SaaS and B2C websites.",
  topicsBefore: "Solutions ",
  topicsAccent: "we ",
  topicsAfter: "offer",
  topics: [...sevenloopTopics],
  relatedBefore: relatedBlogsHeading.before,
  relatedAccent: relatedBlogsHeading.accent,
  relatedBlogs,
};

export const getBlogArticle = cache(async (): Promise<BlogArticleContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "blog-article" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      titleBefore?: string | null;
      titleAccent?: string | null;
      titleMiddle?: string | null;
      titleLine?: string | null;
      intro?: string | null;
      heroImage?: unknown;
      bylineName?: string | null;
      bylineDate?: string | null;
      bylineAvatar?: unknown;
      lead?: string | null;
      sections?: Array<{
        anchor?: string | null;
        tocLabel?: string | null;
        headingBefore?: string | null;
        headingAccent?: string | null;
        headingAfter?: string | null;
        blocks?: CmsBlock[] | null;
      } | null> | null;
      faqs?: Array<{ question?: string | null; answer?: string | null } | null> | null;
      authorImage?: unknown;
      authorName?: string | null;
      authorRole?: string | null;
      authorBio?: string | null;
      topicsBefore?: string | null;
      topicsAccent?: string | null;
      topicsAfter?: string | null;
      topics?: Array<{ label?: string | null } | null> | null;
      relatedBefore?: string | null;
      relatedAccent?: string | null;
      relatedBlogs?: Array<{
        image?: unknown;
        date?: string | null;
        readTime?: string | null;
        title?: string | null;
        href?: string | null;
      } | null> | null;
    };

    const sections = (doc.sections || [])
      .map((section, index) => {
        const designed = fallback.sections[index];
        const blocks = (section?.blocks || [])
          .map((block, blockIndex) => blockFrom(block, designed?.blocks[blockIndex]))
          .filter((block): block is ArticleBlock => Boolean(block));
        const row: ArticleSection = {
          id: section?.anchor?.trim() || designed?.id || `section-${index + 1}`,
          label: section?.tocLabel?.trim() || designed?.label || `Section ${index + 1}`,
          before: section?.headingBefore?.trim() || undefined,
          accent: section?.headingAccent?.trim() || undefined,
          after: section?.headingAfter?.trim() || undefined,
          blocks: blocks.length ? blocks : designed?.blocks || [],
        };
        return row;
      })
      .filter((section) => section.blocks.length);

    const faqs = (doc.faqs || [])
      .map((item) => {
        const question = item?.question?.trim() || "";
        if (!question) return null;
        const answer = item?.answer?.trim();
        return answer ? { question, answer } : { question };
      })
      .filter((item): item is { question: string; answer?: string } => Boolean(item));

    const topics = (doc.topics || []).map((topic) => topic?.label?.trim() || "").filter(Boolean);
    const posts = (doc.relatedBlogs || [])
      .map((post, index) => ({
        image: storedImage(post?.image, relatedBlogs[index]?.image || relatedImage),
        date: post?.date?.trim() || "",
        readTime: post?.readTime?.trim() || "",
        title: post?.title?.trim() || "",
        href: post?.href?.trim() || "/",
        key: `related-${index}`,
      }))
      .filter((post) => post.title);

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      titleBefore: text(doc.titleBefore, fallback.titleBefore),
      titleAccent: text(doc.titleAccent, fallback.titleAccent),
      titleMiddle: text(doc.titleMiddle, fallback.titleMiddle),
      titleLine: text(doc.titleLine, fallback.titleLine),
      intro: text(doc.intro, fallback.intro),
      heroImage: storedImage(doc.heroImage, "") || null,
      bylineName: text(doc.bylineName, fallback.bylineName),
      bylineDate: text(doc.bylineDate, fallback.bylineDate),
      bylineAvatar: storedImage(doc.bylineAvatar, fallback.bylineAvatar),
      lead: text(doc.lead, fallback.lead),
      sections: sections.length ? sections : fallback.sections,
      faqs: faqs.length ? faqs : fallback.faqs,
      authorImage: storedImage(doc.authorImage, fallback.authorImage),
      authorName: text(doc.authorName, fallback.authorName),
      authorRole: text(doc.authorRole, fallback.authorRole),
      authorBio: text(doc.authorBio, fallback.authorBio),
      topicsBefore: text(doc.topicsBefore, fallback.topicsBefore),
      topicsAccent: text(doc.topicsAccent, fallback.topicsAccent),
      topicsAfter: text(doc.topicsAfter, fallback.topicsAfter),
      topics: topics.length ? topics : fallback.topics,
      relatedBefore: text(doc.relatedBefore, fallback.relatedBefore),
      relatedAccent: text(doc.relatedAccent, fallback.relatedAccent),
      relatedBlogs: posts.length ? posts : fallback.relatedBlogs,
    };
  } catch (error) {
    console.warn("[cms] blog article fallback", error);
    return fallback;
  }
});
