export const BLOG_INDEX_PATH = "/blogs";

export const blogCategories = ["All", "Brand", "Digital", "Strategy", "Studio"] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type BlogBadgeIcon = "rocket" | "fire" | "medal" | "smile" | "timer";

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: Exclude<BlogCategory, "All">;
  image: string;
  href: string;
  badge?: string;
  badgeIcon?: BlogBadgeIcon;
};

const cardImage = "/assets/images/blog/card.png";
const postTitle = "Top 10 Branding Agencies in Bangalore (2026 Shortlist)";
const postHref = "/blogs/sevenloop-brand-website-redesign";

export const featuredPosts: BlogPost[] = [
  {
    id: "featured-founder",
    title: postTitle,
    date: "May 28, 2026",
    category: "Studio",
    image: cardImage,
    href: postHref,
    badge: "For The Founder",
    badgeIcon: "rocket",
  },
  {
    id: "featured-hot",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
    badge: "Hot Right Now",
    badgeIcon: "fire",
  },
  {
    id: "featured-read",
    title: postTitle,
    date: "May 28, 2026",
    category: "Strategy",
    image: cardImage,
    href: postHref,
    badge: "most read",
    badgeIcon: "medal",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "grid-1",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
    badge: "For The Founder",
    badgeIcon: "rocket",
  },
  {
    id: "grid-2",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
  {
    id: "grid-3",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
    badge: "We spent a while on this",
    badgeIcon: "smile",
  },
  {
    id: "grid-4",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
  {
    id: "grid-5",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
    badge: "quick read",
    badgeIcon: "timer",
  },
  {
    id: "grid-6",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
  {
    id: "grid-7",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
  {
    id: "grid-8",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
  {
    id: "grid-9",
    title: postTitle,
    date: "May 28, 2026",
    category: "Brand",
    image: cardImage,
    href: postHref,
  },
];
