import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import {
  blogCategories,
  blogPosts,
  featuredPosts,
  type BlogBadgeIcon,
  type BlogCategory,
  type BlogPost,
} from "@/data/blogIndexPage";

const cardImage = "/assets/images/blog/card.png";
const badgeIcons = new Set<BlogBadgeIcon>(["rocket", "fire", "medal", "smile", "timer"]);
const categories = new Set<Exclude<BlogCategory, "All">>(["Brand", "Digital", "Strategy", "Studio"]);

export type BlogIndexContent = {
  breadcrumbCurrent: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  intro: string;
  heroImage: string | null;
  featuredBefore: string;
  featuredAccent: string;
  featuredAfter: string;
  featuredPosts: BlogPost[];
  listingBefore: string;
  listingAccent: string;
  listingAfter: string;
  categories: string[];
  posts: BlogPost[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

type CmsPost = {
  image?: unknown;
  title?: string | null;
  date?: string | null;
  category?: string | null;
  href?: string | null;
  badge?: string | null;
  badgeIcon?: string | null;
} | null;

function postsFrom(rows: CmsPost[] | null | undefined, fallback: BlogPost[]): BlogPost[] {
  if (!rows?.length) return fallback;
  const posts = rows
    .map((row, index) => {
      const title = row?.title?.trim() || "";
      if (!title) return null;
      const category = categories.has(row?.category as Exclude<BlogCategory, "All">)
        ? (row?.category as Exclude<BlogCategory, "All">)
        : fallback[index]?.category || "Brand";
      const icon = badgeIcons.has(row?.badgeIcon as BlogBadgeIcon)
        ? (row?.badgeIcon as BlogBadgeIcon)
        : undefined;
      const post: BlogPost = {
        id: `cms-${index}`,
        title,
        date: row?.date?.trim() || fallback[index]?.date || "",
        category,
        image: storedImage(row?.image, fallback[index]?.image || cardImage),
        href: row?.href?.trim() || fallback[index]?.href || "/blogs/sevenloop-brand-website-redesign",
      };
      const badge = row?.badge?.trim();
      if (badge && icon) {
        post.badge = badge;
        post.badgeIcon = icon;
      }
      return post;
    })
    .filter((post): post is BlogPost => Boolean(post));
  return posts.length ? posts : fallback;
}

const fallback: BlogIndexContent = {
  breadcrumbCurrent: "Blogs",
  titleBefore: "Things ",
  titleAccent: "worth",
  titleAfter: " thinking about.",
  intro:
    "Ideas, opinions, lessons and the occasional rabbit hole from the people behind Design Asylum.",
  heroImage: null,
  featuredBefore: "What’s getting ",
  featuredAccent: "attention",
  featuredAfter: " around here",
  featuredPosts,
  listingBefore: "Looking for something ",
  listingAccent: "specific",
  listingAfter: "?",
  categories: [...blogCategories],
  posts: blogPosts,
};

export const getBlogIndex = cache(async (): Promise<BlogIndexContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "blog-index" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      titleBefore?: string | null;
      titleAccent?: string | null;
      titleAfter?: string | null;
      intro?: string | null;
      heroImage?: unknown;
      featuredBefore?: string | null;
      featuredAccent?: string | null;
      featuredAfter?: string | null;
      featuredPosts?: CmsPost[] | null;
      listingBefore?: string | null;
      listingAccent?: string | null;
      listingAfter?: string | null;
      categories?: Array<{ label?: string | null } | null> | null;
      posts?: CmsPost[] | null;
    };

    const labels = (doc.categories || [])
      .map((row) => row?.label?.trim() || "")
      .filter(Boolean);

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      titleBefore: text(doc.titleBefore, fallback.titleBefore),
      titleAccent: text(doc.titleAccent, fallback.titleAccent),
      titleAfter: text(doc.titleAfter, fallback.titleAfter),
      intro: text(doc.intro, fallback.intro),
      heroImage: storedImage(doc.heroImage, "") || null,
      featuredBefore: text(doc.featuredBefore, fallback.featuredBefore),
      featuredAccent: text(doc.featuredAccent, fallback.featuredAccent),
      featuredAfter: text(doc.featuredAfter, fallback.featuredAfter),
      featuredPosts: postsFrom(doc.featuredPosts, fallback.featuredPosts),
      listingBefore: text(doc.listingBefore, fallback.listingBefore),
      listingAccent: text(doc.listingAccent, fallback.listingAccent),
      listingAfter: text(doc.listingAfter, fallback.listingAfter),
      categories: labels.length ? labels : fallback.categories,
      posts: postsFrom(doc.posts, fallback.posts),
    };
  } catch (error) {
    console.warn("[cms] blog index fallback", error);
    return fallback;
  }
});
