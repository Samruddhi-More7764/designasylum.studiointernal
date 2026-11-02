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
import { faqDetails } from "../data/faqDetailPage";
import { faqEntries } from "../data/faqPage";
import {
  ahmedabadBreadcrumbCurrent,
  ahmedabadCallout,
  ahmedabadCta,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
} from "../data/ahmedabadLocationPage";
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
    existing.docs.map((doc, idx) => {
      const rec = doc as unknown as Record<string, unknown>;
      return [
        typeof rec.order === "number" ? Number(rec.order) : idx,
        doc,
      ] as const;
    }),
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
          })),
        ];
      }),
    ),
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

  // Seed FAQ Details collection
  const existingFaqs = await payload.find({
    collection: "faq-details" as any,
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });
  const existingFaqSlugs = new Set(
    existingFaqs.docs.map((doc: any) => String(doc.slug || "").trim().toLowerCase()),
  );

  const defense = faqDetails["defense-tech"];
  if (defense && !existingFaqSlugs.has("defense-tech")) {
    await payload.create({
      collection: "faq-details" as any,
      data: {
        slug: "defense-tech",
        question: defense.question,
        lead: defense.lead,
        breadcrumbCurrent: "Sevenloop Brand Website Redesign",
        sections: defense.sections.map((s) => ({
          anchor: s.id,
          title: s.title,
          body: s.body,
        })),
      },
      overrideAccess: true,
    });
    existingFaqSlugs.add("defense-tech");
  }

  for (const item of faqEntries) {
    const slug = (item.detailSlug || item.id).trim().toLowerCase();
    if (!slug || existingFaqSlugs.has(slug)) continue;

    await payload.create({
      collection: "faq-details" as any,
      data: {
        slug,
        question: item.question,
        lead: item.answer || item.question,
        breadcrumbCurrent: item.question,
        sections: [
          {
            anchor: "strategic-overview",
            title: "Strategic Overview",
            body:
              item.answer ||
              "Developing a rigorous brand framework requires direct alignment with market expectations and commercial objectives.",
          },
          {
            anchor: "messaging-positioning",
            title: "Messaging & Positioning",
            body:
              "Clear differentiation stems from translating complex technical value into unambiguous commercial incentives for enterprise decision-makers.",
          },
          {
            anchor: "execution-impact",
            title: "Execution & Commercial Impact",
            body:
              "A disciplined identity system accelerates sales velocity, elevates market perception, and establishes lasting authority across competitive sectors.",
          },
        ],
      },
      overrideAccess: true,
    });
    existingFaqSlugs.add(slug);
  }

  // Seed Location Pages collection
  const existingLocations = await payload.find({
    collection: "location-pages" as any,
    where: { slug: { equals: "ahmedabad" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existingLocations.docs.length === 0) {
    await payload.create({
      collection: "location-pages" as any,
      data: {
        title: "Ahmedabad",
        slug: "ahmedabad",
        breadcrumbCurrent: ahmedabadBreadcrumbCurrent,
        heroTitle: ahmedabadHero.title,
        heroIntro: ahmedabadHero.intro,
        clientsBefore: "Design projects for ",
        clientsAccent: "Ahmedabad",
        clientsAfter: " brands",
        clientTabs: ahmedabadProjectTabs.map((tab) => ({
          tabId: tab.id,
          label: tab.label,
        })),
        projects: brandingProjects.map((p) => ({
          name: p.name,
          description: p.description,
          href: p.href,
        })),
        calloutBefore: ahmedabadCallout.before,
        calloutAccent: ahmedabadCallout.accent,
        calloutAfter: ahmedabadCallout.after,
        calloutBody: ahmedabadCallout.body,
        lead: ahmedabadLead,
        sections: ahmedabadSections.map((s) => ({
          anchor: s.id,
          tocLabel: s.tocLabel,
          headingBefore: s.before,
          headingAccent: s.accent,
          headingAfter: s.after,
          paragraphs: s.paragraphs.map((text) => ({ text })),
          blocks: (s.blocks ?? []).map((b) => ({
            title: b.title,
            paragraphs: b.paragraphs.map((text) => ({ text })),
          })),
          pointers: (s.pointers ?? []).map((p) => ({ text: p.text })),
        })),
        ctaHeadingBefore: "Ready to ",
        ctaHeadingAccent: "transform",
        ctaHeadingAfter: " your Ahmedabad brand?",
        ctaBody: ahmedabadCta.body,
        ctaButtonLabel: ahmedabadCta.button,
        ctaButtonHref: ahmedabadCta.href,
        faqs: ahmedabadFaqItems.map((f) => ({
          question: f.question,
          answer: f.answer || undefined,
        })),
        relatedBefore: "",
        relatedAccent: "Related ",
        relatedAfter: "blogs",
        relatedBlogs: relatedBlogs.map((b) => ({
          date: b.date,
          readTime: b.readTime,
          title: b.title,
          href: b.href,
        })),
      },
      overrideAccess: true,
    });
  }

  payload.logger.info(
    "Seed complete. Sevenloop client (hub) + case-study, FAQ details, and Location pages ready.",
  );
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
