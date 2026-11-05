import { getPayload } from "payload";
import config from "@payload-config";
import { blogCategories, blogPosts, featuredPosts, type BlogPost } from "../data/blogIndexPage";
import { contactOffices } from "../data/contactPage";
import { faqCategories, faqEntries } from "../data/faqPage";
import { faqDetails } from "../data/faqDetailPage";

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
