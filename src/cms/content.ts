import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { isVideoMedia, isVideoSrc, resolveMediaAlt, resolveMediaUrl } from "@/cms/media";
import type { ClientHubNavItem } from "@/cms/types";
import {
  featuredProjects as fallbackProjects,
  type FeaturedProject,
} from "@/data/projects";
import {
  portfolioItems as fallbackPortfolio,
  type PortfolioItem,
} from "@/data/portfolio";
import { painPoints as fallbackPainPoints, type PainPoint } from "@/data/painPoints";
import {
  clientLogos as fallbackLogos,
  clientsGridRows as fallbackGridRows,
  marqueeRow1 as fallbackMarquee1,
  marqueeRow2 as fallbackMarquee2,
  type ClientLogo,
} from "@/data/clients";
import { caseStudies as fallbackCaseStudies, type CaseStudy } from "@/data/caseStudies";
import {
  testimonials as fallbackTestimonials,
  type Testimonial,
} from "@/data/testimonials";
import { faqItems as fallbackFaq, type FaqItem } from "@/data/faq";
import {
  FOOTER_COLUMNS as fallbackFooterColumns,
  AI_LINKS as fallbackAiLinks,
  type FooterColumn,
} from "@/data/footer";
import {
  clientHubNavItems as fallbackNavItems,
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
} from "@/data/clientHub";
import {
  sevenloopCaseStudyHero,
  sevenloopCaseStudyDetails,
  sevenloopCaseStudyGallery,
  sevenloopCaseStudyViewAllClients,
} from "@/data/caseStudyPage";
import {
  caseStudyPath,
  clientHubPath,
  relatedId,
  relatedSlug,
  resolvedClientHref,
} from "@/cms/urls";

type LabelRow = { label?: string | null } | string | null | undefined;

function labels(rows: LabelRow[] | null | undefined): string[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => (typeof row === "string" ? row : row?.label?.trim() || ""))
    .filter(Boolean);
}

function texts(
  rows: Array<{ text?: string | null } | string | null | undefined> | null | undefined,
): string[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => (typeof row === "string" ? row : row?.text?.trim() || ""))
    .filter(Boolean);
}

type CmsImageRow = {
  image?: unknown;
  src?: string | null;
  alt?: string | null;
} | null | undefined;

function image(value: CmsImageRow, fallback: { src: string; alt: string }) {
  const src = resolveMediaUrl(value?.image) || value?.src?.trim() || null;
  if (!src) return fallback;
  return {
    src,
    alt: value?.alt?.trim() || resolveMediaAlt(value?.image) || fallback.alt,
  };
}

function images(
  rows: CmsImageRow[] | null | undefined,
  fallback: { src: string; alt: string }[],
) {
  const mapped = (rows || [])
    .map((row, i) => {
      const resolved = resolveMediaUrl(row?.image) || row?.src?.trim();
      if (!resolved) return null;
      return image(row, fallback[i] || { src: resolved, alt: "" });
    })
    .filter((row): row is { src: string; alt: string } => Boolean(row));
  return mapped.length ? mapped : fallback;
}

function asClientDoc(value: unknown): {
  slug?: string | null;
  projectType?: "hub" | "direct" | null;
  featuredStudy?: unknown;
} | null {
  if (!value || typeof value !== "object") return null;
  return value as {
    slug?: string | null;
    projectType?: "hub" | "direct" | null;
    featuredStudy?: unknown;
  };
}

async function hrefFromClientField(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>,
  clientField: unknown,
  fallback: string,
): Promise<string> {
  const embedded = asClientDoc(clientField);
  if (embedded?.slug) {
    const href = resolvedClientHref({
      slug: embedded.slug,
      projectType: embedded.projectType,
      featuredStudy: embedded.featuredStudy as never,
    });
    if (href) return href;

    if (embedded.projectType === "direct") {
      const clientId =
        "id" in embedded ? (embedded as { id?: string | number }).id : null;
      if (clientId != null) {
        const studies = await payload.find({
          collection: "case-studies",
          where: { client: { equals: clientId } },
          limit: 1,
          depth: 0,
        });
        const studySlug = studies.docs[0]?.slug?.trim();
        if (studySlug) return caseStudyPath(embedded.slug, studySlug);
      }
    }
  }

  if (typeof clientField === "number" || typeof clientField === "string") {
    try {
      const client = await payload.findByID({
        collection: "clients",
        id: clientField,
        depth: 1,
      });
      const href = resolvedClientHref(client);
      if (href) return href;
      if (client.projectType === "direct") {
        const studies = await payload.find({
          collection: "case-studies",
          where: { client: { equals: client.id } },
          limit: 1,
          depth: 0,
        });
        const studySlug = studies.docs[0]?.slug?.trim();
        if (studySlug && client.slug) {
          return caseStudyPath(client.slug, studySlug);
        }
      }
    } catch {
      /* fall through */
    }
  }

  return fallback;
}

function asStudyDoc(value: unknown): {
  slug?: string | null;
  client?: unknown;
} | null {
  if (!value || typeof value !== "object") return null;
  return value as { slug?: string | null; client?: unknown };
}

/**
 * Homepage row → a specific case study. Unlike hrefFromClientField this
 * targets one project directly, so it works for hub and direct clients alike.
 */
async function hrefFromStudyField(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>,
  studyField: unknown,
  fallback: string,
): Promise<string> {
  const embedded = asStudyDoc(studyField);
  const studySlug = embedded?.slug?.trim();

  if (studySlug) {
    // depth >= 2 populates the study's client, so the slug is already here.
    const clientSlug = asClientDoc(embedded?.client)?.slug?.trim();
    if (clientSlug) return caseStudyPath(clientSlug, studySlug);

    // depth 1: client came back as a bare id.
    const clientId = relatedId(embedded?.client as never);
    if (clientId != null) {
      try {
        const client = await payload.findByID({
          collection: "clients",
          id: clientId,
          depth: 0,
        });
        if (client.slug) return caseStudyPath(client.slug, studySlug);
      } catch {
        /* fall through */
      }
    }
  }

  if (typeof studyField === "number" || typeof studyField === "string") {
    try {
      const study = await payload.findByID({
        collection: "case-studies",
        id: studyField,
        depth: 1,
      });
      const slug = study.slug?.trim();
      const clientSlug = asClientDoc(study.client)?.slug?.trim();
      if (slug && clientSlug) return caseStudyPath(clientSlug, slug);
    } catch {
      /* fall through */
    }
  }

  return fallback;
}

function studyHrefFromRelation(
  clientSlug: string,
  relation: unknown,
  fallback: string,
): string {
  const studySlug = relatedSlug(relation as never);
  if (studySlug) return caseStudyPath(clientSlug, studySlug);
  return fallback;
}

/**
 * Per-section hub link. Unlike the main Case Study CTA there is no fallback —
 * a section with no study picked stays a plain, non-clickable visual.
 */
function optionalStudyHref(clientSlug: string, relation: unknown): string | null {
  const studySlug = relatedSlug(relation as never);
  return studySlug ? caseStudyPath(clientSlug, studySlug) : null;
}

export function logosToLayouts(logos: ClientLogo[]) {
  if (logos.length < 4) {
    return {
      logos,
      marqueeRow1: logos,
      marqueeRow2: logos.length ? [...logos].reverse().concat(logos[0]) : [],
      clientsGridRows: logos.length ? [logos, logos] : [],
    };
  }

  return {
    logos,
    marqueeRow1: logos.slice(0, 4),
    marqueeRow2: [logos[3], logos[2], logos[1], logos[0], logos[0]],
    clientsGridRows: [
      logos.slice(0, 4),
      [logos[3], logos[2], logos[0], logos[1]],
    ],
  };
}

export const getFeaturedProjects = cache(async (): Promise<FeaturedProject[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackProjects;

  try {
    const result = await payload.find({
      collection: "featured-projects",
      sort: "order",
      limit: 100,
      depth: 2,
    });
    if (!result.docs.length) return fallbackProjects;
    const mapped = (
      await Promise.all(
        result.docs.map(async (doc) => {
          const src = resolveMediaUrl(doc.image);
          if (!src) return null;
          return {
            name: String(doc.name),
            description: String(doc.description),
            metric: String(doc.metric),
            metricLabel: String(doc.metricLabel),
            image: src,
            alt: String(doc.alt || resolveMediaAlt(doc.image) || ""),
            href: await hrefFromClientField(
              payload,
              doc.client,
              "/clients/sevenloop",
            ),
          };
        }),
      )
    ).filter((row): row is FeaturedProject => Boolean(row));
    return mapped.length ? mapped : fallbackProjects;
  } catch (error) {
    console.warn("[cms] featured projects fallback", error);
    return fallbackProjects;
  }
});

export const getPortfolioItems = cache(async (): Promise<PortfolioItem[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackPortfolio;

  try {
    const result = await payload.find({
      collection: "portfolio-items",
      sort: "order",
      limit: 100,
      depth: 2,
    });
    if (!result.docs.length) return fallbackPortfolio;
    const mapped = (
      await Promise.all(
        result.docs.map(async (doc) => {
          const src = resolveMediaUrl(doc.image);
          if (!src) return null;
          return {
            name: String(doc.name),
            category: String(doc.category),
            image: src,
            alt: String(doc.alt || resolveMediaAlt(doc.image) || ""),
            href: await hrefFromClientField(
              payload,
              doc.client,
              "/clients/sevenloop",
            ),
          };
        }),
      )
    ).filter((row): row is PortfolioItem => Boolean(row));
    return mapped.length ? mapped : fallbackPortfolio;
  } catch (error) {
    console.warn("[cms] portfolio fallback", error);
    return fallbackPortfolio;
  }
});

export const getPainPoints = cache(async (): Promise<PainPoint[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackPainPoints;

  try {
    const result = await payload.find({
      collection: "pain-points",
      sort: "order",
      limit: 100,
      depth: 2,
    });
    if (!result.docs.length) return fallbackPainPoints;
    return Promise.all(
      result.docs.map(async (doc) => ({
        tag: String(doc.tag),
        quote: String(doc.quote),
        resolution: String(doc.resolution),
        href: await hrefFromClientField(
          payload,
          doc.client,
          "/clients/sevenloop",
        ),
      })),
    );
  } catch (error) {
    console.warn("[cms] pain points fallback", error);
    return fallbackPainPoints;
  }
});

export const getClientLogoLayouts = cache(async () => {
  const payload = await getPayloadClient();
  if (!payload) {
    return {
      logos: fallbackLogos,
      marqueeRow1: fallbackMarquee1,
      marqueeRow2: fallbackMarquee2,
      clientsGridRows: fallbackGridRows,
    };
  }

  try {
    const result = await payload.find({
      collection: "client-logos",
      sort: "order",
      limit: 100,
      depth: 1,
    });
    if (!result.docs.length) {
      return {
        logos: fallbackLogos,
        marqueeRow1: fallbackMarquee1,
        marqueeRow2: fallbackMarquee2,
        clientsGridRows: fallbackGridRows,
      };
    }
    const logos = result.docs
      .map((doc) => {
        const src = resolveMediaUrl(doc.image);
        if (!src) return null;
        return {
          name: String(doc.name),
          image: src,
          width: Number(doc.width),
          height: Number(doc.height),
        };
      })
      .filter((row): row is ClientLogo => Boolean(row));
    if (!logos.length) {
      return {
        logos: fallbackLogos,
        marqueeRow1: fallbackMarquee1,
        marqueeRow2: fallbackMarquee2,
        clientsGridRows: fallbackGridRows,
      };
    }
    return logosToLayouts(logos);
  } catch (error) {
    console.warn("[cms] logos fallback", error);
    return {
      logos: fallbackLogos,
      marqueeRow1: fallbackMarquee1,
      marqueeRow2: fallbackMarquee2,
      clientsGridRows: fallbackGridRows,
    };
  }
});

export const getHomepageCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackCaseStudies;

  try {
    const result = await payload.find({
      collection: "homepage-case-studies",
      sort: "order",
      limit: 100,
      depth: 2,
    });
    if (!result.docs.length) return fallbackCaseStudies;
    return Promise.all(
      result.docs.map(async (doc) => ({
        number: String(doc.number),
        name: String(doc.name),
        description: String(doc.description),
        tags: labels(doc.tags as LabelRow[]),
        href: await hrefFromStudyField(
          payload,
          doc.caseStudy,
          "/clients/sevenloop/case-study",
        ),
      })),
    );
  } catch (error) {
    console.warn("[cms] homepage case studies fallback", error);
    return fallbackCaseStudies;
  }
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackTestimonials;

  try {
    const result = await payload.find({
      collection: "testimonials",
      sort: "order",
      limit: 100,
      depth: 1,
    });
    if (!result.docs.length) return fallbackTestimonials;
    const mapped: Testimonial[] = [];
    for (const doc of result.docs) {
      const imageUrl = resolveMediaUrl(doc.image);
      const videoUrl = resolveMediaUrl(doc.video);
      const imageIsVideo = isVideoMedia(doc.image) || isVideoSrc(imageUrl);
      const video = videoUrl || (imageIsVideo ? imageUrl : null);
      const poster = imageIsVideo ? null : imageUrl;
      if (!video && !poster) continue;
      mapped.push({
        image: poster || "",
        alt: String(doc.alt || resolveMediaAlt(doc.image) || ""),
        ...(doc.quote ? { quote: String(doc.quote) } : {}),
        ...(video ? { video } : {}),
        width: Number(doc.width) || 290,
        height: Number(doc.height) || 320,
      });
    }
    return mapped.length ? mapped : fallbackTestimonials;
  } catch (error) {
    console.warn("[cms] testimonials fallback", error);
    return fallbackTestimonials;
  }
});

export const getFaqItems = cache(async (): Promise<FaqItem[]> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackFaq;

  try {
    const result = await payload.find({
      collection: "faq-items",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    if (!result.docs.length) return fallbackFaq;
    return result.docs.map((doc) => ({
      question: String(doc.question),
      answer: doc.answer ? String(doc.answer) : undefined,
    }));
  } catch (error) {
    console.warn("[cms] faq fallback", error);
    return fallbackFaq;
  }
});

export type FooterContent = {
  columns: FooterColumn[];
  aiLinks: string[];
};

export const getFooter = cache(async (): Promise<FooterContent> => {
  const fallback: FooterContent = {
    columns: fallbackFooterColumns,
    aiLinks: fallbackAiLinks,
  };
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const global = await payload.findGlobal({ slug: "site-footer", depth: 0 });
    const columns = (global.columns || [])
      .map((col) => ({
        title: col.title?.trim() || "",
        links: labels(col.links as LabelRow[]),
      }))
      .filter((col) => col.title);
    const aiLinks = labels(global.aiLinks as LabelRow[]);
    if (!columns.length) return fallback;
    return {
      columns,
      aiLinks: aiLinks.length ? aiLinks : fallback.aiLinks,
    };
  } catch (error) {
    console.warn("[cms] footer fallback", error);
    return fallback;
  }
});

/** Hub sections that can optionally deep-link to one of the client's studies. */
type LinkableSection<T> = T & { href: string | null };

export type ClientHubContent = {
  slug: string;
  name: string;
  navItems: ClientHubNavItem[];
  about: typeof sevenloopAbout;
  logoDesign: LinkableSection<typeof sevenloopLogoDesign>;
  websiteDesign: LinkableSection<typeof sevenloopWebsiteDesign>;
  projectBrochure: LinkableSection<typeof sevenloopProjectBrochure>;
  brandVideo: LinkableSection<typeof sevenloopBrandVideo>;
  behindTheScenes: typeof sevenloopBehindTheScenes;
  caseStudy: typeof sevenloopCaseStudy;
  partnership: typeof sevenloopPartnership;
  transformation: typeof sevenloopTransformation;
  projectTeam: typeof sevenloopProjectTeam;
};

const fallbackClientHub: ClientHubContent = {
  slug: "sevenloop",
  name: "Sevenloop",
  navItems: fallbackNavItems.map((item) => ({ id: item.id, label: item.label })),
  about: sevenloopAbout,
  logoDesign: { ...sevenloopLogoDesign, href: null },
  websiteDesign: { ...sevenloopWebsiteDesign, href: null },
  projectBrochure: { ...sevenloopProjectBrochure, href: null },
  brandVideo: { ...sevenloopBrandVideo, href: null },
  behindTheScenes: sevenloopBehindTheScenes,
  caseStudy: sevenloopCaseStudy,
  partnership: sevenloopPartnership,
  transformation: sevenloopTransformation,
  projectTeam: sevenloopProjectTeam,
};

export type ClientHubMeta = {
  slug: string;
  name: string;
  projectType: "hub" | "direct";
  featuredStudySlug: string | null;
};

export const getClientBySlug = cache(
  async (slug: string): Promise<ClientHubMeta | null> => {
    const payload = await getPayloadClient();
    if (!payload) {
      if (slug === "sevenloop") {
        return {
          slug: "sevenloop",
          name: "Sevenloop",
          projectType: "hub",
          featuredStudySlug: "case-study",
        };
      }
      return null;
    }

    try {
      const result = await payload.find({
        collection: "clients",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      });
      const doc = result.docs[0];
      if (!doc) return null;

      let featuredStudySlug = relatedSlug(doc.featuredStudy);
      if (doc.projectType === "direct" && !featuredStudySlug) {
        const studies = await payload.find({
          collection: "case-studies",
          where: { client: { equals: doc.id } },
          limit: 1,
          depth: 0,
        });
        featuredStudySlug = studies.docs[0]?.slug?.trim() || null;
      }

      return {
        slug: String(doc.slug),
        name: String(doc.name),
        projectType: doc.projectType === "hub" ? "hub" : "direct",
        featuredStudySlug,
      };
    } catch (error) {
      console.warn("[cms] getClientBySlug", error);
      return null;
    }
  },
);

export const getClientHub = cache(
  async (slug = "sevenloop"): Promise<ClientHubContent> => {
    const payload = await getPayloadClient();
    if (!payload) return fallbackClientHub;

    try {
      const result = await payload.find({
        collection: "clients",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      });
      const g = result.docs[0];
      if (!g || g.projectType !== "hub") {
        return slug === "sevenloop" ? fallbackClientHub : fallbackClientHub;
      }
      if (!g.about?.body) {
        return slug === "sevenloop" ? fallbackClientHub : fallbackClientHub;
      }

      const clientSlug = String(g.slug || slug);
      const defaultStudyHref = caseStudyPath(clientSlug, "case-study");

      const navItems = (g.navItems || [])
        .map((item) => ({
          id: item.navId?.trim() || "",
          label: item.label?.trim() || "",
        }))
        .filter((item) => item.id && item.label);

      return {
        slug: clientSlug,
        name: String(g.name || clientSlug),
        navItems: navItems.length ? navItems : fallbackClientHub.navItems,
        about: {
          italic: g.about?.italic || fallbackClientHub.about.italic,
          rest: g.about?.rest || fallbackClientHub.about.rest,
          body: g.about?.body || fallbackClientHub.about.body,
          websiteHref: g.about?.websiteHref || fallbackClientHub.about.websiteHref,
        },
        logoDesign: {
          italic: g.logoDesign?.italic || fallbackClientHub.logoDesign.italic,
          rest: g.logoDesign?.rest || fallbackClientHub.logoDesign.rest,
          images: images(g.logoDesign?.images, fallbackClientHub.logoDesign.images),
          href: optionalStudyHref(clientSlug, g.logoDesign?.caseStudy),
        },
        websiteDesign: {
          italic: g.websiteDesign?.italic || fallbackClientHub.websiteDesign.italic,
          rest: g.websiteDesign?.rest || fallbackClientHub.websiteDesign.rest,
          image: image(g.websiteDesign?.image, fallbackClientHub.websiteDesign.image),
          href: optionalStudyHref(clientSlug, g.websiteDesign?.caseStudy),
        },
        projectBrochure: {
          italic:
            g.projectBrochure?.italic || fallbackClientHub.projectBrochure.italic,
          rest: g.projectBrochure?.rest || fallbackClientHub.projectBrochure.rest,
          images: images(
            g.projectBrochure?.images,
            fallbackClientHub.projectBrochure.images,
          ),
          href: optionalStudyHref(clientSlug, g.projectBrochure?.caseStudy),
        },
        brandVideo: (() => {
          const poster = image(
            g.brandVideo?.image,
            fallbackClientHub.brandVideo.image,
          );
          const uploadedVideo = resolveMediaUrl(g.brandVideo?.video);
          const imageIsVideo =
            isVideoMedia(
              g.brandVideo?.image &&
                typeof g.brandVideo.image === "object" &&
                "image" in g.brandVideo.image
                ? g.brandVideo.image.image
                : null,
            ) || isVideoSrc(poster.src);
          return {
            italic: g.brandVideo?.italic || fallbackClientHub.brandVideo.italic,
            rest: g.brandVideo?.rest || fallbackClientHub.brandVideo.rest,
            image: imageIsVideo ? fallbackClientHub.brandVideo.image : poster,
            videoSrc:
              uploadedVideo ||
              (imageIsVideo ? poster.src : null) ||
              fallbackClientHub.brandVideo.videoSrc,
            href: optionalStudyHref(clientSlug, g.brandVideo?.caseStudy),
          };
        })(),
        behindTheScenes: {
          italic:
            g.behindTheScenes?.italic || fallbackClientHub.behindTheScenes.italic,
          rest: g.behindTheScenes?.rest || fallbackClientHub.behindTheScenes.rest,
          images: images(
            g.behindTheScenes?.images,
            fallbackClientHub.behindTheScenes.images,
          ),
        },
        caseStudy: {
          italic: g.caseStudy?.italic || fallbackClientHub.caseStudy.italic,
          rest: g.caseStudy?.rest || fallbackClientHub.caseStudy.rest,
          subheading:
            g.caseStudy?.subheading || fallbackClientHub.caseStudy.subheading,
          href: studyHrefFromRelation(
            clientSlug,
            g.caseStudy?.caseStudy,
            defaultStudyHref,
          ),
        },
        partnership: {
          label: g.partnership?.label || fallbackClientHub.partnership.label,
          heading: g.partnership?.heading || fallbackClientHub.partnership.heading,
          headingAccent:
            g.partnership?.headingAccent ||
            fallbackClientHub.partnership.headingAccent,
          paragraphs: (() => {
            const next = texts(g.partnership?.paragraphs);
            return next.length ? next : fallbackClientHub.partnership.paragraphs;
          })(),
        },
        transformation: {
          heading:
            g.transformation?.heading || fallbackClientHub.transformation.heading,
          subtext:
            g.transformation?.subtext || fallbackClientHub.transformation.subtext,
          before: image(
            g.transformation?.before,
            fallbackClientHub.transformation.before,
          ),
          after: image(
            g.transformation?.after,
            fallbackClientHub.transformation.after,
          ),
        },
        projectTeam: {
          heading: g.projectTeam?.heading || fallbackClientHub.projectTeam.heading,
          subheading:
            g.projectTeam?.subheading || fallbackClientHub.projectTeam.subheading,
          members: (g.projectTeam?.members || []).length
            ? (g.projectTeam?.members || []).map((member, i) => ({
                name:
                  member.name || fallbackClientHub.projectTeam.members[i]?.name || "",
                role:
                  member.role || fallbackClientHub.projectTeam.members[i]?.role || "",
                photo: image(
                  member.photo,
                  fallbackClientHub.projectTeam.members[i]?.photo || {
                    src: "",
                    alt: "",
                  },
                ),
              }))
            : fallbackClientHub.projectTeam.members,
        },
      };
    } catch (error) {
      console.warn("[cms] client hub fallback", error);
      return fallbackClientHub;
    }
  },
);

export type CaseStudyPageContent = {
  clientSlug: string;
  studySlug: string;
  title: string;
  hero: typeof sevenloopCaseStudyHero;
  details: typeof sevenloopCaseStudyDetails;
  gallery: typeof sevenloopCaseStudyGallery;
  viewAll: typeof sevenloopCaseStudyViewAllClients;
};

const fallbackCaseStudyPage: CaseStudyPageContent = {
  clientSlug: "sevenloop",
  studySlug: "case-study",
  title: sevenloopCaseStudyHero.heading,
  hero: sevenloopCaseStudyHero,
  details: sevenloopCaseStudyDetails,
  gallery: sevenloopCaseStudyGallery,
  viewAll: sevenloopCaseStudyViewAllClients,
};

export const getCaseStudyPage = cache(
  async (
    clientSlug = "sevenloop",
    studySlug = "case-study",
  ): Promise<CaseStudyPageContent | null> => {
    const payload = await getPayloadClient();
    if (!payload) {
      if (clientSlug === "sevenloop" && studySlug === "case-study") {
        return fallbackCaseStudyPage;
      }
      return null;
    }

    try {
      const clients = await payload.find({
        collection: "clients",
        where: { slug: { equals: clientSlug } },
        limit: 1,
        depth: 0,
      });
      const client = clients.docs[0];
      if (!client) {
        return clientSlug === "sevenloop" && studySlug === "case-study"
          ? fallbackCaseStudyPage
          : null;
      }

      const studies = await payload.find({
        collection: "case-studies",
        where: {
          and: [
            { slug: { equals: studySlug } },
            { client: { equals: client.id } },
          ],
        },
        limit: 1,
        depth: 2,
      });
      const g = studies.docs[0];
      if (!g) {
        return clientSlug === "sevenloop" && studySlug === "case-study"
          ? fallbackCaseStudyPage
          : null;
      }

      const hubHref = clientHubPath(clientSlug);
      const autoBreadcrumb = [
        { label: "Home", href: "/" },
        { label: "clients", href: hubHref },
        { label: clientSlug, href: hubHref },
      ];

      return {
        clientSlug,
        studySlug,
        title: String(g.title),
        hero: {
          heading: g.hero?.heading || fallbackCaseStudyPage.hero.heading,
          breadcrumbCurrent:
            g.hero?.breadcrumbCurrent ||
            g.title ||
            fallbackCaseStudyPage.hero.breadcrumbCurrent,
          breadcrumb: (g.hero?.breadcrumb || []).length
            ? (g.hero?.breadcrumb || []).map((item) => ({
                label: item.label || "",
                href: item.href || "#",
              }))
            : autoBreadcrumb,
          image: image(g.hero?.image, fallbackCaseStudyPage.hero.image),
        },
        details: {
          quote: g.details?.quote || fallbackCaseStudyPage.details.quote,
          tableHeading:
            g.details?.tableHeading || fallbackCaseStudyPage.details.tableHeading,
          rows: (g.details?.rows || []).length
            ? (g.details?.rows || []).map((row) => ({
                label: row.label || "",
                value: row.value || "",
              }))
            : fallbackCaseStudyPage.details.rows,
        },
        gallery: images(g.gallery, fallbackCaseStudyPage.gallery),
        viewAll: {
          label: g.viewAll?.label || fallbackCaseStudyPage.viewAll.label,
          href: g.viewAll?.href || fallbackCaseStudyPage.viewAll.href,
        },
      };
    } catch (error) {
      console.warn("[cms] case study page fallback", error);
      return clientSlug === "sevenloop" && studySlug === "case-study"
        ? fallbackCaseStudyPage
        : null;
    }
  },
);
