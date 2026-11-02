import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { resolveMediaUrl } from "@/cms/media";
import { storedImage } from "@/cms/storedImage";
import {
  brandingProjects,
  relatedBlogs,
  type ArticleSection,
} from "@/data/brandingAgencyPage";
import type { ClientLogo } from "@/data/clients";
import {
  ahmedabadBreadcrumbCurrent,
  ahmedabadCallout,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
} from "@/data/ahmedabadLocationPage";

const defaultHeroImage = "/assets/images/branding-agency/hero-media.png";

type TextRow = { text?: string | null } | null | undefined;
type CmsSection = {
  anchor?: string | null;
  tocLabel?: string | null;
  headingBefore?: string | null;
  headingAccent?: string | null;
  headingAfter?: string | null;
  paragraphs?: TextRow[] | null;
  blocks?: Array<{
    title?: string | null;
    paragraphs?: TextRow[] | null;
  } | null> | null;
  pointers?: TextRow[] | null;
};

export type LocationPageContent = {
  title: string;
  slug: string;
  breadcrumbCurrent: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  clientsBefore: string;
  clientsAccent: string;
  clientsAfter: string;
  clientTabs: { id: string; label: string }[];
  projects: Array<(typeof brandingProjects)[number] & { tab?: string }>;
  calloutBefore: string;
  calloutAccent: string;
  calloutAfter: string;
  calloutBody: string;
  logos: { row1: ClientLogo[]; row2: ClientLogo[] } | null;
  lead: string;
  sections: ArticleSection[];
  ctaHeadingBefore: string;
  ctaHeadingAccent: string;
  ctaHeadingAfter: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  faqs: { question: string; answer?: string }[];
  relatedBefore: string;
  relatedAccent: string;
  relatedAfter: string;
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

function linesOf(rows: TextRow[] | null | undefined): string[] {
  if (!rows?.length) return [];
  return rows.map((row) => row?.text?.trim() || "").filter(Boolean);
}

function sectionsFrom(rows: CmsSection[] | null | undefined): ArticleSection[] | null {
  if (!rows?.length) return null;
  return rows.map((row, index) => {
    const blocks = (row.blocks || [])
      .map((block) => ({
        title: block?.title?.trim() || "",
        paragraphs: linesOf(block?.paragraphs),
      }))
      .filter((block) => block.title);
    const pointers = linesOf(row.pointers).map((line) => ({ text: line }));
    const section: ArticleSection = {
      id: row.anchor?.trim() || `section-${index + 1}`,
      tocLabel: row.tocLabel?.trim() || `Section ${index + 1}`,
      before: row.headingBefore?.trim() || undefined,
      accent: row.headingAccent?.trim() || undefined,
      after: row.headingAfter?.trim() || undefined,
      paragraphs: linesOf(row.paragraphs),
    };
    if (blocks.length) section.blocks = blocks;
    if (pointers.length) section.pointers = pointers;
    return section;
  });
}

function createFallbackLocation(slug: string, title?: string): LocationPageContent {
  const locationName = title || slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: locationName,
    slug,
    breadcrumbCurrent: locationName,
    heroTitle: `Best Web Design & Branding Agency in ${locationName}`,
    heroIntro:
      `${locationName}'s high-growth economy requires distinctive branding and websites that position companies for institutional trust and scalable growth.`,
    heroImage: defaultHeroImage,
    clientsBefore: "Design projects for ",
    clientsAccent: locationName,
    clientsAfter: " brands",
    clientTabs: ahmedabadProjectTabs.map((tab) => ({ id: tab.id, label: tab.label })),
    projects: brandingProjects,
    calloutBefore: ahmedabadCallout.before,
    calloutAccent: ahmedabadCallout.accent,
    calloutAfter: ahmedabadCallout.after,
    calloutBody: ahmedabadCallout.body,
    logos: null,
    lead: ahmedabadLead,
    sections: ahmedabadSections,
    ctaHeadingBefore: "Ready to ",
    ctaHeadingAccent: "transform",
    ctaHeadingAfter: ` your ${locationName} brand?`,
    ctaBody:
      "Most rebranding conversations begin when enterprise expansion reveals the gap between what you have built and how you look.",
    ctaButtonLabel: "Book an intro call",
    ctaButtonHref: "/contact",
    faqs: ahmedabadFaqItems,
    relatedBefore: "",
    relatedAccent: "Related ",
    relatedAfter: "blogs",
    relatedBlogs,
  };
}

export const getLocationPageBySlug = cache(
  async (slug: string): Promise<LocationPageContent | null> => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    const payload = await getPayloadClient();

    if (payload) {
      try {
        const found = await payload.find({
          collection: "location-pages" as any,
          where: { slug: { equals: cleanSlug } },
          limit: 1,
          depth: 2,
        });

        if (found.docs.length > 0) {
          const doc = found.docs[0] as unknown as {
            title?: string | null;
            slug?: string | null;
            breadcrumbCurrent?: string | null;
            heroTitle?: string | null;
            heroIntro?: string | null;
            heroImage?: unknown;
            clientsBefore?: string | null;
            clientsAccent?: string | null;
            clientsAfter?: string | null;
            clientTabs?: Array<{ tabId?: string | null; label?: string | null } | null> | null;
            projects?: Array<{
              image?: unknown;
              name?: string | null;
              description?: string | null;
              href?: string | null;
              tab?: string | null;
            } | null> | null;
            calloutBefore?: string | null;
            calloutAccent?: string | null;
            calloutAfter?: string | null;
            calloutBody?: string | null;
            logos?: Array<{
              image?: unknown;
              name?: string | null;
              row?: string | null;
            } | null> | null;
            lead?: string | null;
            sections?: CmsSection[] | null;
            ctaHeadingBefore?: string | null;
            ctaHeadingAccent?: string | null;
            ctaHeadingAfter?: string | null;
            ctaBody?: string | null;
            ctaButtonLabel?: string | null;
            ctaButtonHref?: string | null;
            faqs?: Array<{ question?: string | null; answer?: string | null } | null> | null;
            relatedBefore?: string | null;
            relatedAccent?: string | null;
            relatedAfter?: string | null;
            relatedBlogs?: Array<{
              image?: unknown;
              date?: string | null;
              readTime?: string | null;
              title?: string | null;
              href?: string | null;
            } | null> | null;
          };

          const fallback = createFallbackLocation(cleanSlug, doc.title || undefined);
          const sections = sectionsFrom(doc.sections);
          const tabs = (doc.clientTabs || [])
            .map((tab) => ({
              id: tab?.tabId?.trim() || "",
              label: tab?.label?.trim() || "",
            }))
            .filter((tab) => tab.id && tab.label);

          const projects = (doc.projects || [])
            .map((project, index) => ({
              image: storedImage(project?.image, brandingProjects[index]?.image || defaultHeroImage),
              name: project?.name?.trim() || "",
              description: project?.description?.trim() || "",
              href: project?.href?.trim() || "",
              key: `project-${index}`,
              tab: project?.tab?.trim() || undefined,
            }))
            .filter((project) => project.name && project.description);

          const faqs = (doc.faqs || [])
            .map((item) => ({
              question: item?.question?.trim() || "",
              answer: item?.answer?.trim() || undefined,
            }))
            .filter((item) => item.question);

          const posts = (doc.relatedBlogs || [])
            .map((post, index) => ({
              image: storedImage(post?.image, relatedBlogs[0]?.image || defaultHeroImage),
              date: post?.date?.trim() || "",
              readTime: post?.readTime?.trim() || "",
              title: post?.title?.trim() || "",
              href: post?.href?.trim() || "/",
              key: `related-${index}`,
            }))
            .filter((post) => post.title);

          const logos = (doc.logos || [])
            .map((logo, index) => {
              const name = logo?.name?.trim() || "";
              if (!name) return null;
              return {
                name,
                image: storedImage(logo?.image, defaultHeroImage),
                width: 160,
                height: 48,
                row: logo?.row === "2" ? "2" : logo?.row === "1" ? "1" : "",
                index,
              };
            })
            .filter((logo): logo is NonNullable<typeof logo> => Boolean(logo));

          const assignedTop = logos.filter((logo) => logo.row === "1");
          const assignedBottom = logos.filter((logo) => logo.row === "2");
          const unassigned = logos.filter((logo) => !logo.row);
          const toLogo = ({
            name,
            image,
            width,
            height,
          }: {
            name: string;
            image: string;
            width: number;
            height: number;
          }): ClientLogo => ({ name, image, width, height });

          return {
            title: text(doc.title, fallback.title),
            slug: cleanSlug,
            breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
            heroTitle: text(doc.heroTitle, fallback.heroTitle),
            heroIntro: text(doc.heroIntro, fallback.heroIntro),
            heroImage: storedImage(doc.heroImage, fallback.heroImage),
            clientsBefore: text(doc.clientsBefore, fallback.clientsBefore),
            clientsAccent: text(doc.clientsAccent, fallback.clientsAccent),
            clientsAfter: text(doc.clientsAfter, fallback.clientsAfter),
            clientTabs: tabs.length ? tabs : fallback.clientTabs,
            projects: projects.length ? projects : fallback.projects,
            calloutBefore: text(doc.calloutBefore, fallback.calloutBefore),
            calloutAccent: text(doc.calloutAccent, fallback.calloutAccent),
            calloutAfter: text(doc.calloutAfter, fallback.calloutAfter),
            calloutBody: text(doc.calloutBody, fallback.calloutBody),
            logos: logos.length
              ? {
                  row1: [...assignedTop, ...unassigned.slice(0, 4)].map(toLogo),
                  row2: [...assignedBottom, ...unassigned.slice(4)].map(toLogo),
                }
              : null,
            lead: text(doc.lead, fallback.lead),
            sections: sections ?? fallback.sections,
            ctaHeadingBefore: text(doc.ctaHeadingBefore, fallback.ctaHeadingBefore),
            ctaHeadingAccent: text(doc.ctaHeadingAccent, fallback.ctaHeadingAccent),
            ctaHeadingAfter: text(doc.ctaHeadingAfter, fallback.ctaHeadingAfter),
            ctaBody: text(doc.ctaBody, fallback.ctaBody),
            ctaButtonLabel: text(doc.ctaButtonLabel, fallback.ctaButtonLabel),
            ctaButtonHref: text(doc.ctaButtonHref, fallback.ctaButtonHref),
            faqs: faqs.length ? faqs : fallback.faqs,
            relatedBefore: text(doc.relatedBefore, fallback.relatedBefore),
            relatedAccent: text(doc.relatedAccent, fallback.relatedAccent),
            relatedAfter: text(doc.relatedAfter, fallback.relatedAfter),
            relatedBlogs: posts.length ? posts : fallback.relatedBlogs,
          };
        }
      } catch (err) {
        console.warn("[cms] location-pages lookup error", err);
      }
    }

    if (cleanSlug === "ahmedabad") {
      return createFallbackLocation("ahmedabad", "Ahmedabad");
    }

    return null;
  },
);

export const getAllLocationSlugs = cache(async (): Promise<string[]> => {
  const payload = await getPayloadClient();
  const slugs = new Set<string>(["ahmedabad"]);

  if (payload) {
    try {
      const res = await payload.find({
        collection: "location-pages" as any,
        limit: 100,
        depth: 0,
      });
      for (const doc of res.docs) {
        if ((doc as any)?.slug) {
          slugs.add(String((doc as any).slug).trim().toLowerCase());
        }
      }
    } catch {}
  }

  return Array.from(slugs);
});

