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

  console.log("Seeding FAQ Detail Page (defense-tech)...");
  const existingFaq = await payload.find({
    collection: "faq-details" as any,
    where: { slug: { equals: "defense-tech" } },
    limit: 1,
  } as any);

  if (existingFaq.docs.length === 0) {
    await payload.create({
      collection: "faq-details" as any,
      data: {
        question:
          "How should a defense-tech startup approach branding for procurement and investors?",
        slug: "defense-tech",
        breadcrumbCurrent: "Sevenloop Brand Website Redesign",
        lead:
          "For a defense-tech startup, branding needs to do more than create recognition. It needs to establish credibility in a sector where trust, technical capability, security, and long-term reliability can heavily influence how a business is perceived. At the same time, the brand needs to communicate enough ambition and clarity to resonate with investors and potential partners. The challenge is finding a balance between the technical complexity of the product and a clear, confident story that different audiences can understand.",
        sections: [
          {
            anchor: "speaking",
            title: "Understand Who You're Speaking To",
            body:
              "Procurement teams and investors may be evaluating the same company, but they're often looking for very different signals. Procurement is likely to focus on capability, reliability, compliance, operational readiness, and whether the business can deliver on its promises. Investors, meanwhile, may be looking at the size of the opportunity, differentiation, scalability, leadership, and the potential for long-term growth.",
          },
          {
            anchor: "credibility",
            title: "Build Credibility Into The Brand",
            body:
              "In defense and advanced technology, credibility can't be treated as a visual afterthought. The identity, messaging, website, presentations, and other touchpoints should work together to communicate a sense of precision and confidence.",
          },
          {
            anchor: "technology",
            title: "Make Complex Technology Easier To Understand",
            body:
              "Defense-tech companies often work with highly technical products, systems, or capabilities that can be difficult to communicate outside of an expert audience. Branding can help simplify that complexity without oversimplifying the technology itself.",
          },
          {
            anchor: "growth",
            title: "Create A Brand That Can Grow With The Business",
            body:
              "A startup's identity needs to work for where the company is going, not just where it is today. As a defense-tech business develops new capabilities, enters new markets, builds partnerships, or moves through different stages of investment and procurement, its brand will need to accommodate that growth.",
          },
        ],
      },
    } as any);
    console.log("Created FAQ Detail Page: defense-tech");
  }

  console.log("Seeding Location Page (ahmedabad)...");
  const existingLocation = await payload.find({
    collection: "location-pages" as any,
    where: { slug: { equals: "ahmedabad" } },
    limit: 1,
  } as any);

  if (existingLocation.docs.length === 0) {
    await payload.create({
      collection: "location-pages" as any,
      data: {
        title: "Ahmedabad",
        slug: "ahmedabad",
        breadcrumbCurrent: "Ahmedabad",
        heroTitle: "Best Web Design & Branding Agency in Ahmedabad",
        heroIntro:
          "Ahmedabad’s economy has three layers — a deep manufacturing base, a fast-growing B2B and product-tech base, and the GIFT City fintech build-out. Each one needs a different kind of brand, but they share a buyer who has been around for a while and is hard to impress.",
        clientsBefore: "Design projects for ",
        clientsAccent: "Ahmedabad",
        clientsAfter: " brands",
        calloutBefore: "Deep engineering,",
        calloutAccent: "pragmatic",
        calloutAfter: "buyers",
        calloutBody:
          "Ahmedabad’s most successful businesses don’t fall for flashy, shallow marketing. They evaluate suppliers based on operational maturity, supply chain resilience, and long-term delivery confidence.",
        lead:
          "Ahmedabad has quietly built one of India’s most resilient commercial ecosystems. From industrial giants in Vatva and Sanand to next-gen fintech in GIFT City, the city’s brand landscape is changing fast.",
        ctaHeadingBefore: "Ready to ",
        ctaHeadingAccent: "transform",
        ctaHeadingAfter: " your Ahmedabad brand?",
        ctaBody:
          "Most rebranding conversations begin when enterprise expansion reveals the gap between what you have built and how you look.",
        ctaButtonLabel: "Book an intro call",
        ctaButtonHref: "/contact",
      },
    } as any);
    console.log("Created Location Page: Ahmedabad");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
