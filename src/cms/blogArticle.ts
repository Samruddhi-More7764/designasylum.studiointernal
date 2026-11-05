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
  authorHref: string;
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
  authorHref: "",
  topicsBefore: "Solutions ",
  topicsAccent: "we ",
  topicsAfter: "offer",
  topics: [...sevenloopTopics],
  relatedBefore: relatedBlogsHeading.before,
  relatedAccent: relatedBlogsHeading.accent,
  relatedBlogs,
};

export function parseBlogArticleDoc(
  doc: Record<string, unknown> | null | undefined,
  baseFallback?: BlogArticleContent,
): BlogArticleContent {
  const fb = baseFallback;
  if (!doc) return fb || fallback;

  const docTitle = typeof doc.title === "string" ? doc.title.trim() : "";
  const docDate = typeof doc.date === "string" ? doc.date.trim() : "";

  const sections = (Array.isArray(doc.sections) ? doc.sections : [])
    .map((section: Record<string, unknown> | null | undefined, index: number) => {
      const designed = fb?.sections[index];
      const blocks = (Array.isArray(section?.blocks) ? (section.blocks as CmsBlock[]) : [])
        .map((block, blockIndex) => (block ? blockFrom(block, designed?.blocks[blockIndex]) : null))
        .filter((block: unknown): block is ArticleBlock => Boolean(block));
      const row: ArticleSection = {
        id: (typeof section?.anchor === "string" && section.anchor.trim()) || designed?.id || `section-${index + 1}`,
        label: (typeof section?.tocLabel === "string" && section.tocLabel.trim()) || designed?.label || `Section ${index + 1}`,
        before: (typeof section?.headingBefore === "string" && section.headingBefore.trim()) || undefined,
        accent: (typeof section?.headingAccent === "string" && section.headingAccent.trim()) || undefined,
        after: (typeof section?.headingAfter === "string" && section.headingAfter.trim()) || undefined,
        blocks: blocks.length ? blocks : designed?.blocks || [],
      };
      return row;
    })
    .filter((section) => section.blocks.length);

  const faqs = (Array.isArray(doc.faqs) ? doc.faqs : [])
    .map((item: Record<string, unknown> | null | undefined) => {
      const question = typeof item?.question === "string" ? item.question.trim() : "";
      if (!question) return null;
      const answer = typeof item?.answer === "string" ? item.answer.trim() : undefined;
      return answer ? { question, answer } : { question };
    })
    .filter((item): item is { question: string; answer?: string } => Boolean(item));

  const topics = (Array.isArray(doc.topics) ? doc.topics : [])
    .map((topic: Record<string, unknown> | null | undefined) =>
      typeof topic?.label === "string" ? topic.label.trim() : "",
    )
    .filter(Boolean);

  const posts = (Array.isArray(doc.relatedBlogs) ? doc.relatedBlogs : [])
    .map((post: Record<string, unknown> | null | undefined, index: number) => {
      const linked =
        post && "post" in post && post.post && typeof post.post === "object"
          ? (post.post as { title?: string; slug?: string; date?: string; readTime?: string; image?: unknown; heroImage?: unknown })
          : null;
      const title = (typeof post?.title === "string" && post.title.trim()) || linked?.title?.trim() || "";
      if (!title) return null;
      const date = (typeof post?.date === "string" && post.date.trim()) || linked?.date?.trim() || "";
      const readTime = (typeof post?.readTime === "string" && post.readTime.trim()) || linked?.readTime?.trim() || "";
      const cleanSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();
      const defaultHref = cleanSlug ? `/blogs/${cleanSlug}` : "/";
      const href = (typeof post?.href === "string" && post.href.trim()) || defaultHref;
      const image = storedImage(
        post?.image || linked?.heroImage || linked?.image,
        fb ? relatedBlogs[index]?.image || relatedImage : relatedImage,
      );
      return {
        image,
        date,
        readTime,
        title,
        href,
        key: `related-${index}`,
      };
    })
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  const authorMember = doc.authorMember && typeof doc.authorMember === "object" ? (doc.authorMember as { slug?: string }) : null;
  const authorSlug = authorMember?.slug ? authorMember.slug.replace(/^\/+|\/+$/g, "").trim() : "";
  const authorHref = authorSlug ? `/team/${authorSlug}#hero` : typeof doc.authorUrl === "string" ? doc.authorUrl.trim() : "";

  return {
    breadcrumbCurrent: text(doc.breadcrumbCurrent as string, docTitle || fb?.breadcrumbCurrent || "Blog"),
    titleBefore: text(doc.titleBefore as string, docTitle ? `${docTitle} ` : fb?.titleBefore || ""),
    titleAccent: text(doc.titleAccent as string, docTitle ? "" : fb?.titleAccent || ""),
    titleMiddle: text(doc.titleMiddle as string, fb?.titleMiddle || ""),
    titleLine: text(doc.titleLine as string, fb?.titleLine || ""),
    intro: text(doc.intro as string, fb?.intro || ""),
    heroImage: storedImage(doc.heroImage || doc.image, "") || null,
    bylineName: text(doc.bylineName as string, fb?.bylineName || "Design Asylum"),
    bylineDate: text(doc.bylineDate as string, docDate || fb?.bylineDate || ""),
    bylineAvatar: storedImage(doc.bylineAvatar, fb?.bylineAvatar || ""),
    lead: text(doc.lead as string, fb?.lead || ""),
    sections: sections.length ? sections : (fb?.sections || []),
    faqs: faqs.length ? faqs : (fb?.faqs || []),
    authorImage: storedImage(doc.authorImage, fb?.authorImage || ""),
    authorName: text(doc.authorName as string, fb?.authorName || ""),
    authorRole: text(doc.authorRole as string, fb?.authorRole || ""),
    authorBio: text(doc.authorBio as string, fb?.authorBio || ""),
    authorHref,
    topicsBefore: text(doc.topicsBefore as string, fb?.topicsBefore || ""),
    topicsAccent: text(doc.topicsAccent as string, fb?.topicsAccent || ""),
    topicsAfter: text(doc.topicsAfter as string, fb?.topicsAfter || ""),
    topics: topics.length ? topics : (fb?.topics || []),
    relatedBefore: text(doc.relatedBefore as string, fb?.relatedBefore || relatedBlogsHeading.before),
    relatedAccent: text(doc.relatedAccent as string, fb?.relatedAccent || relatedBlogsHeading.accent),
    relatedBlogs: posts.length ? posts : (fb?.relatedBlogs || []),
  };
}

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogArticleContent | null> => {
  const payload = await getPayloadClient();
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim();

  if (!payload) {
    if (cleanSlug === "sevenloop-brand-website-redesign") return fallback;
    return null;
  }

  try {
    const result = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: cleanSlug } },
      limit: 1,
      depth: 2,
    });

    if (result.docs.length) {
      return parseBlogArticleDoc(
        result.docs[0] as unknown as Record<string, unknown>,
        cleanSlug === "sevenloop-brand-website-redesign" ? fallback : undefined,
      );
    }

    if (cleanSlug === "sevenloop-brand-website-redesign") {
      return getBlogArticle();
    }
    return null;
  } catch (error) {
    console.warn("[cms] getBlogPostBySlug error", error);
    if (cleanSlug === "sevenloop-brand-website-redesign") return fallback;
    return null;
  }
});

export const getBlogArticle = cache(async (): Promise<BlogArticleContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    // Check collection first
    const fromCollection = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: "sevenloop-brand-website-redesign" } },
      limit: 1,
      depth: 2,
    });
    if (fromCollection.docs.length) {
      return parseBlogArticleDoc(fromCollection.docs[0] as unknown as Record<string, unknown>, fallback);
    }

    // Check global
    const doc = (await payload.findGlobal({
      slug: "blog-article" as "site-footer",
      depth: 2,
    })) as unknown as Record<string, unknown>;

    return parseBlogArticleDoc(doc, fallback);
  } catch (error) {
    console.warn("[cms] blog article fallback", error);
    return fallback;
  }
});
