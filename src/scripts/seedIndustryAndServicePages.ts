import { getPayload } from "payload";
import config from "@payload-config";
import { blogPosts, featuredPosts } from "../data/blogIndexPage";

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding Blog Posts...");
  const allPosts = [...featuredPosts, ...blogPosts];
  const seenTitles = new Set<string>();

  for (const post of allPosts) {
    if (seenTitles.has(post.title)) continue;
    seenTitles.add(post.title);

    const slug = post.href.replace(/^\/+|\/+$/g, "").split("/").pop() || "blog-post";
    const existing = await payload.find({
      collection: "blog-posts" as any,
      where: { slug: { equals: slug } },
      limit: 1,
    } as any);

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "blog-posts" as any,
        data: {
          title: post.title,
          slug,
          date: post.date,
          readTime: "10 min read",
          category: post.category,
          href: post.href,
          badge: post.badge,
          badgeIcon: post.badgeIcon,
        },
      } as any);
      console.log(`Created blog post: ${post.title} (${slug})`);
    }
  }

  console.log("Seeding Manufacturing Industry Page...");
  const existingIndustry = await payload.find({
    collection: "industry-pages" as any,
    where: { slug: { equals: "manufacturing" } },
    limit: 1,
  } as any);

  if (existingIndustry.docs.length === 0) {
    await payload.create({
      collection: "industry-pages" as any,
      data: {
        title: "Manufacturing",
        slug: "manufacturing",
        heroTitle: "Design agency for manufacturing firms",
        heroIntro:
          "A design agency for manufacturing firms builds branding and websites that highlight industrial expertise, driving online visibility and client engagement.",
        lead:
          "Digital presence is no longer an afterthought for manufacturing firms — it is the front door. Industrial buyers, procurement heads, and OEM partners research suppliers in private, long before they make an inquiry.",
        clientsBefore: "Design projects in",
        clientsAccent: "manufacturing",
        clientsAfter: "industry",
        expertsBefore: "Manufacturing design",
        expertsAccent: "experts",
        expertsSubheading:
          "The same core team across Ximkart, Revind and Sevenloop — strategy, design, film and build under one roof.",
        relatedBefore: "Related",
        relatedAccent: "blogs",
      },
    } as any);
    console.log("Created Industry Page: Manufacturing");
  }

  console.log("Seeding Brand Systems Service Page...");
  const existingService = await payload.find({
    collection: "service-pages" as any,
    where: { slug: { equals: "brand-systems" } },
    limit: 1,
  } as any);

  if (existingService.docs.length === 0) {
    await payload.create({
      collection: "service-pages" as any,
      data: {
        title: "Brand Systems",
        slug: "brand-systems",
        heroTitle: "Branding agency in Pune",
        heroIntro:
          "How to choose a B2B branding agency. Diagnosis, positioning, and identity — from Design Asylum in Pune.",
        lead:
          "Choosing a branding agency is one of the highest-leverage decisions a leadership team makes — and one of the easiest to get wrong.",
        clientsBefore: "Clients we did",
        clientsAccent: "branding",
        clientsAfter: "for",
        expertsBefore: "Branding",
        expertsAccent: "experts",
        expertsSubheading:
          "The same core team across Ximkart, Revind and Sevenloop strategy, design, film and build under one roof.",
        relatedBefore: "Related",
        relatedAccent: "blogs",
      },
    } as any);
    console.log("Created Service Page: Brand Systems");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
