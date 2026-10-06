import "dotenv/config";
import { existsSync } from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "@payload-config";

import { featuredProjects } from "../data/projects";
import { portfolioItems } from "../data/portfolio";
import { painPoints } from "../data/painPoints";
import { clientLogos, marqueeRow1, marqueeRow2 } from "../data/clients";
import { caseStudies } from "../data/caseStudies";
import { testimonials } from "../data/testimonials";
import { faqItems } from "../data/faq";
import { FOOTER_COLUMNS } from "../data/footer";
import {
  articleSections,
  brandingExperts,
  brandingExpertsHeading,
  brandingProjects,
  breadcrumbCurrent,
  clientBrandingTabs,
  introduction,
  relatedBlogs,
  relatedBlogsHeading,
  serviceFaqItems,
} from "../data/brandingAgencyPage";
import {
  clientHubNavItems,
  sevenloopAbout,
  sevenloopLogoDesign,
  sevenloopWebsiteDesign,
  sevenloopProjectBrochure,
  sevenloopBrandVideo,
  sevenloopBehindTheScenes,
  sevenloopCaseStudy,
  sevenloopPartnership,
  sevenloopTransformation,
  sevenloopProjectTeam,
} from "../data/clientHub";
import {
  sevenloopCaseStudyHero,
  sevenloopCaseStudyDetails,
  sevenloopCaseStudyGallery,
  sevenloopCaseStudyViewAllClients,
} from "../data/caseStudyPage";
import { dropLegacyImageColumns } from "./drop-legacy-image-columns";

type CollectionSlug =
  | "featured-projects"
  | "portfolio-items"
  | "pain-points"
  | "client-logos"
  | "homepage-case-studies"
  | "testimonials"
  | "faq-items";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

const mediaCache = new Map<string, number>();

function publicFile(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

async function upsertMedia(
  payload: PayloadClient,
  src: string,
  alt: string,
): Promise<number> {
  const cached = mediaCache.get(src);
  if (cached) return cached;

  const existing = await payload.find({
    collection: "media",
    where: { sourcePath: { equals: src } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    const id = Number(existing.docs[0].id);
    mediaCache.set(src, id);
    return id;
  }

  const filePath = publicFile(src);
  if (!existsSync(filePath)) {
    throw new Error(`Missing file for seed: ${filePath}`);
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt, sourcePath: src },
    filePath,
  });
  const id = Number(doc.id);
  mediaCache.set(src, id);
  return id;
}

async function cmsImage(payload: PayloadClient, src: string, alt: string) {
  return { image: await upsertMedia(payload, src, alt), alt };
}

async function upsertByOrder(
  payload: PayloadClient,
  collection: CollectionSlug,
  rows: Record<string, unknown>[],
) {
  const existing = await payload.find({
    collection,
    limit: 500,
    depth: 0,
  });
  const byOrder = new Map(
    existing.docs.map((doc) => [Number(doc.order), doc] as const),
  );

  for (const [index, data] of rows.entries()) {
    const found = byOrder.get(index);
    const body = { ...data, order: index };
    if (found) {
      await payload.update({
        collection,
        id: found.id,
        data: body,
      } as Parameters<typeof payload.update>[0]);
    } else {
      await payload.create({
        collection,
        data: body,
      } as Parameters<typeof payload.create>[0]);
    }
  }
}

async function seed() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URI) {
    throw new Error("Set POSTGRES_URL or DATABASE_URI before seeding.");
  }
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("Set PAYLOAD_SECRET before seeding.");
  }

  await dropLegacyImageColumns();

  const payload = await getPayload({ config });

  // --- Sevenloop Client (hub) + Case study ---
  const existingClients = await payload.find({
    collection: "clients",
    where: { slug: { equals: "sevenloop" } },
    limit: 1,
    depth: 0,
  });

  const sevenloopHubData = {
    name: "Sevenloop",
    slug: "sevenloop",
    projectType: "hub" as const,
    navItems: clientHubNavItems.map((item) => ({
      navId: item.id,
      label: item.label,
    })),
    about: sevenloopAbout,
    logoDesign: {
      italic: sevenloopLogoDesign.italic,
      rest: sevenloopLogoDesign.rest,
      images: await Promise.all(
        sevenloopLogoDesign.images.map((img) => cmsImage(payload, img.src, img.alt)),
      ),
    },
    websiteDesign: {
      italic: sevenloopWebsiteDesign.italic,
      rest: sevenloopWebsiteDesign.rest,
      image: await cmsImage(
        payload,
        sevenloopWebsiteDesign.image.src,
        sevenloopWebsiteDesign.image.alt,
      ),
    },
    projectBrochure: {
      italic: sevenloopProjectBrochure.italic,
      rest: sevenloopProjectBrochure.rest,
      images: await Promise.all(
        sevenloopProjectBrochure.images.map((img) =>
          cmsImage(payload, img.src, img.alt),
        ),
      ),
    },
    brandVideo: {
      italic: sevenloopBrandVideo.italic,
      rest: sevenloopBrandVideo.rest,
      image: await cmsImage(
        payload,
        sevenloopBrandVideo.image.src,
        sevenloopBrandVideo.image.alt,
      ),
    },
    behindTheScenes: {
      italic: sevenloopBehindTheScenes.italic,
      rest: sevenloopBehindTheScenes.rest,
      images: await Promise.all(
        sevenloopBehindTheScenes.images.map((img) =>
          cmsImage(payload, img.src, img.alt),
        ),
      ),
    },
    caseStudy: {
      italic: sevenloopCaseStudy.italic,
      rest: sevenloopCaseStudy.rest,
      subheading: sevenloopCaseStudy.subheading,
    },
    partnership: {
      label: sevenloopPartnership.label,
      heading: sevenloopPartnership.heading,
      headingAccent: sevenloopPartnership.headingAccent,
      paragraphs: sevenloopPartnership.paragraphs.map((text) => ({ text })),
    },
    transformation: {
      heading: sevenloopTransformation.heading,
      subtext: sevenloopTransformation.subtext,
      before: await cmsImage(
        payload,
        sevenloopTransformation.before.src,
        sevenloopTransformation.before.alt,
      ),
      after: await cmsImage(
        payload,
        sevenloopTransformation.after.src,
        sevenloopTransformation.after.alt,
      ),
    },
    projectTeam: {
      heading: sevenloopProjectTeam.heading,
      subheading: sevenloopProjectTeam.subheading,
      members: await Promise.all(
        sevenloopProjectTeam.members.map(async (member) => ({
          name: member.name,
          role: member.role,
          photo: await cmsImage(payload, member.photo.src, member.photo.alt),
        })),
      ),
    },
  };

  const sevenloopClient =
    existingClients.docs[0] != null
      ? await payload.update({
          collection: "clients",
          id: existingClients.docs[0].id,
          data: sevenloopHubData,
        })
      : await payload.create({
          collection: "clients",
          data: sevenloopHubData,
        });
  const sevenloopClientId = sevenloopClient.id;

  const existingStudies = await payload.find({
    collection: "case-studies",
    where: {
      and: [
        { slug: { equals: "case-study" } },
        { client: { equals: sevenloopClientId } },
      ],
    },
    limit: 1,
    depth: 0,
  });

  const studyData = {
    title: sevenloopCaseStudyHero.heading,
    slug: "case-study",
    client: sevenloopClientId,
    hero: {
      heading: sevenloopCaseStudyHero.heading,
      breadcrumbCurrent: sevenloopCaseStudyHero.breadcrumbCurrent,
      breadcrumb: sevenloopCaseStudyHero.breadcrumb,
      layout: "full" as const,
      image: await cmsImage(
        payload,
        sevenloopCaseStudyHero.media.image.src,
        sevenloopCaseStudyHero.media.image.alt,
      ),
    },
    details: {
      quote: sevenloopCaseStudyDetails.quote,
      tableHeading: sevenloopCaseStudyDetails.tableHeading,
      rows: sevenloopCaseStudyDetails.rows,
      logo: null,
    },
    gallery: await Promise.all(
      sevenloopCaseStudyGallery.map(async (frame) => ({
        layout: "full" as const,
        ...(await cmsImage(payload, frame.image.src, frame.image.alt)),
      })),
    ),
    viewAll: sevenloopCaseStudyViewAllClients,
  };

  const sevenloopStudy =
    existingStudies.docs[0] != null
      ? await payload.update({
          collection: "case-studies",
          id: existingStudies.docs[0].id,
          data: studyData,
        })
      : await payload.create({
          collection: "case-studies",
          data: studyData,
        });
  const sevenloopStudyId = sevenloopStudy.id;

  await upsertByOrder(
    payload,
    "featured-projects",
    await Promise.all(
      featuredProjects.map(async (item) => ({
        name: item.name,
        description: item.description,
        metric: item.metric,
        metricLabel: item.metricLabel,
        image: await upsertMedia(payload, item.image, item.alt),
        alt: item.alt,
        client: sevenloopClientId,
      })),
    ),
  );

  await upsertByOrder(
    payload,
    "portfolio-items",
    await Promise.all(
      portfolioItems.map(async (item) => ({
        name: item.name,
        category: item.category,
        image: await upsertMedia(payload, item.image, item.alt),
        alt: item.alt,
        client: sevenloopClientId,
      })),
    ),
  );

  await upsertByOrder(
    payload,
    "pain-points",
    painPoints.map((item) => ({
      tag: item.tag,
      quote: item.quote,
      resolution: item.resolution,
      client: sevenloopClientId,
    })),
  );

  await upsertByOrder(
    payload,
    "client-logos",
    await Promise.all(
      clientLogos.map(async (item) => ({
        name: item.name,
        image: await upsertMedia(payload, item.image, item.name),
        width: item.width,
        height: item.height,
      })),
    ),
  );

  await upsertByOrder(
    payload,
    "homepage-case-studies",
    caseStudies.map((item) => ({
      number: item.number,
      name: item.name,
      description: item.description,
      tags: item.tags.map((label) => ({ label })),
      caseStudy: sevenloopStudyId,
    })),
  );

  await upsertByOrder(
    payload,
    "testimonials",
    await Promise.all(
      testimonials.map(async (item) => ({
        image: await upsertMedia(payload, item.image, item.alt),
        alt: item.alt,
        designation: item.designation || null,
        quote: item.quote || null,
        width: item.width,
        height: item.height,
      })),
    ),
  );

  await upsertByOrder(
    payload,
    "faq-items",
    faqItems.map((item) => ({
      question: item.question,
      answer: item.answer || null,
    })),
  );

  const footerFields = {
    Work: "work",
    Company: "company",
    Solutions: "solutions",
    Services: "services",
    Industries: "industries",
    Studio: "studio",
  } as const;

  await payload.updateGlobal({
    slug: "site-footer",
    data: Object.fromEntries(
      Object.entries(footerFields).map(([title, field]) => {
        const column = FOOTER_COLUMNS.find((item) => item.title === title);
        return [
          field,
          (column?.links ?? []).map((link) => ({
            label: link.label,
            href: link.href === "#" ? undefined : link.href,
          })),
        ];
      }),
    ),
  });

  await payload.updateGlobal({
    slug: "branding-strategy",
    data: {
      breadcrumbCurrent,
      heroTitle: "Branding agency in Pune",
      heroIntro:
        "A branding agency should answer one question first: what do you want a buyer, an investor, or a hire to believe about you before they meet you. Most agencies skip the question and go straight to logo exploration. Design Asylum starts where every B2B brand actually has to start — with diagnosis, positioning, and the words on the page — and only then builds the identity.",
      lead: introduction,
      sections: articleSections.map((section) => ({
        anchor: section.id,
        tocLabel: section.tocLabel,
        headingBefore: section.before,
        headingAccent: section.accent,
        headingAfter: section.after,
        paragraphs: section.paragraphs.map((text) => ({ text })),
        pointers: (section.pointers ?? []).map((item) => ({
          term: item.term,
          text: item.text,
        })),
        closing: (section.closing ?? []).map((text) => ({ text })),
        highlightTitle: section.highlight?.title,
        highlightBody: section.highlight?.body,
      })),
      logos: [...marqueeRow1, ...marqueeRow2].map((logo, index) => ({
        name: logo.name,
        width: logo.width,
        height: logo.height,
        row: (index < marqueeRow1.length ? "1" : "2") as "1" | "2",
      })),
      clientsBefore: "Clients we did ",
      clientsAccent: "branding",
      clientsAfter: " for",
      clientTabs: clientBrandingTabs.map((tab) => ({
        tabId: tab.id,
        label: tab.label,
      })),
      projects: brandingProjects.map((project) => ({
        name: project.name,
        description: project.description,
        href: project.href,
      })),
      faqs: serviceFaqItems.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
      expertsBefore: brandingExpertsHeading.before,
      expertsAccent: brandingExpertsHeading.accent,
      expertsSubheading: brandingExpertsHeading.subheading,
      experts: brandingExperts.map((member) => ({
        name: member.name,
        role: member.role,
      })),
      relatedBefore: relatedBlogsHeading.before,
      relatedAccent: relatedBlogsHeading.accent,
      relatedBlogs: relatedBlogs.map((post) => ({
        date: post.date,
        readTime: post.readTime,
        title: post.title,
        href: post.href,
      })),
    },
  });

  // Wire hub section CTAs to the primary case study
  await payload.update({
    collection: "clients",
    id: sevenloopClientId,
    data: {
      logoDesign: { caseStudy: sevenloopStudyId },
      websiteDesign: { caseStudy: sevenloopStudyId },
      projectBrochure: { caseStudy: sevenloopStudyId },
      brandVideo: { caseStudy: sevenloopStudyId },
      caseStudy: {
        italic: sevenloopCaseStudy.italic,
        rest: sevenloopCaseStudy.rest,
        subheading: sevenloopCaseStudy.subheading,
        caseStudy: sevenloopStudyId,
      },
    },
  });

  payload.logger.info(
    "Seed complete. Sevenloop client (hub) + case-study ready. Create the first admin user at /admin if needed.",
  );
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
