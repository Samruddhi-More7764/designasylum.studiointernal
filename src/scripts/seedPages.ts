import { getPayload } from "payload";
import config from "@payload-config";
import { relatedBlogs, relatedBlogsHeading } from "../data/brandingAgencyPage";
import { blogCategories, blogPosts, featuredPosts, type BlogPost } from "../data/blogIndexPage";
import { contactOffices } from "../data/contactPage";
import { faqCategories, faqEntries } from "../data/faqPage";
import { faqDetails } from "../data/faqDetailPage";
import {
  sevenloopFaqItems,
  sevenloopLead,
  sevenloopSections,
  sevenloopTopics,
  type ArticleBlock,
} from "../data/sevenloopArticle";

function seedPost(post: BlogPost) {
  return {
    title: post.title,
    date: post.date,
    category: post.category,
    href: post.href,
    ...(post.badge ? { badge: post.badge } : {}),
    ...(post.badgeIcon ? { badgeIcon: post.badgeIcon } : {}),
  };
}

function seedBlock(block: ArticleBlock) {
  switch (block.kind) {
    case "paragraphs":
      return { blockType: "paragraphs", items: block.items.map((text) => ({ text })) };
    case "rich":
      return {
        blockType: "rich",
        parts: block.parts.map((part) =>
          typeof part === "string" ? { text: part, strong: false } : { text: part.strong, strong: true },
        ),
      };
    case "subhead":
      return { blockType: "subhead", title: block.title, body: block.body ?? "" };
    case "arrows":
      return {
        blockType: "arrows",
        items: block.items.map((item) => ({ lead: item.lead ?? "", rest: item.rest })),
      };
    case "rows":
      return { blockType: "rows", items: block.items };
    case "image":
      return { blockType: "image", src: block.src, alt: block.alt };
    case "gallery":
      return {
        blockType: "gallery",
        alt: block.alt,
        images: block.srcs.map((src) => ({ src })),
      };
    case "quote":
      return { blockType: "quote", quote: block.quote, name: block.name, role: block.role };
    case "note":
      return { blockType: "note", kicker: block.kicker, body: block.body };
    case "links":
      return { blockType: "links", kicker: block.kicker, items: block.items };
  }
}

async function seedPages() {
  const payload = await getPayload({ config });
  const detail = faqDetails["defense-tech"];

  await payload.updateGlobal({
    slug: "blog-index" as "site-footer",
    data: {
      breadcrumbCurrent: "Blogs",
      titleBefore: "Things ",
      titleAccent: "worth",
      titleAfter: " thinking about.",
      intro:
        "Ideas, opinions, lessons and the occasional rabbit hole from the people behind Design Asylum.",
      featuredBefore: "What’s getting ",
      featuredAccent: "attention",
      featuredAfter: " around here",
      featuredPosts: featuredPosts.map(seedPost),
      listingBefore: "Looking for something ",
      listingAccent: "specific",
      listingAfter: "?",
      categories: blogCategories.map((label) => ({ label })),
      posts: blogPosts.map(seedPost),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  await payload.updateGlobal({
    slug: "blog-article" as "site-footer",
    data: {
      breadcrumbCurrent: "Sevenloop Brand Website Redesign",
      titleBefore: "Sevenloop ",
      titleAccent: "Rebrand",
      titleMiddle: " & Webflow Site: ",
      titleLine: "A 5-Month Case Study",
      intro:
        "How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.",
      bylineName: "Tanmaya Rao",
      bylineDate: "Sept 28, 2026",
      lead: sevenloopLead,
      sections: sevenloopSections.map((section) => ({
        anchor: section.id,
        tocLabel: section.label,
        headingBefore: section.before ?? "",
        headingAccent: section.accent ?? "",
        headingAfter: section.after ?? "",
        blocks: section.blocks.map(seedBlock),
      })),
      faqs: sevenloopFaqItems.map((item) => ({
        question: item.question,
        ...(item.answer ? { answer: item.answer } : {}),
      })),
      authorName: "Athira Krishnan",
      authorRole: "Lead Designer | Content Strategist",
      authorBio:
        "Articulate with a clear thought process, she excels in content writing, driving design in B2B SaaS and B2C websites.",
      topicsBefore: "Solutions ",
      topicsAccent: "we ",
      topicsAfter: "offer",
      topics: sevenloopTopics.map((label) => ({ label })),
      relatedBefore: relatedBlogsHeading.before,
      relatedAccent: relatedBlogsHeading.accent,
      relatedBlogs: relatedBlogs.map((post) => ({
        date: post.date,
        readTime: post.readTime,
        title: post.title,
        href: post.href,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  await payload.updateGlobal({
    slug: "contact-page" as "site-footer",
    data: {
      breadcrumbCurrent: "Contact us",
      titleBefore: "Get in ",
      titleAccent: "Touch",
      titleAfter: "!",
      offices: contactOffices.map((office) => ({
        city: office.city,
        imageSrc: office.image,
        timeZone: office.timeZone,
        tint: Boolean(office.tint),
        links: office.links,
      })),
      formBefore: "Let's talk about ",
      formAccent: "your ",
      formAfter: "brand",
      formBody:
        "Tell us what you're building. We reply within a day, usually with questions, sometimes with opinions.",
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  await payload.updateGlobal({
    slug: "faq-page" as "site-footer",
    data: {
      titleBefore: "Frequently ",
      titleAccent: "Asked",
      titleAfter: " questions!",
      categories: faqCategories.map((category) => ({
        categoryId: category.id,
        label: category.label,
      })),
      entries: faqEntries.map((entry) => ({
        entryId: entry.id,
        question: entry.question,
        category: entry.category,
        ...(entry.answer ? { answer: entry.answer } : {}),
        ...(entry.detailSlug ? { detailSlug: entry.detailSlug } : {}),
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  await payload.updateGlobal({
    slug: "faq-detail" as "site-footer",
    data: {
      slug: detail.slug,
      breadcrumbCurrent: "Sevenloop Brand Website Redesign",
      question: detail.question,
      lead: detail.lead,
      sections: detail.sections.map((section) => ({
        anchor: section.id,
        title: section.title,
        body: section.body,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Blog, blog detail, contact, FAQ, and FAQ detail CMS prefilled.");
  process.exit(0);
}

seedPages().catch((error) => {
  console.error(error);
  process.exit(1);
});
