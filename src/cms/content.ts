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
      depth: 1,
    });
    if (!result.docs.length) return fallbackProjects;
    const mapped = result.docs
      .map((doc) => {
        const src = resolveMediaUrl(doc.image);
        if (!src) return null;
        return {
          name: String(doc.name),
          description: String(doc.description),
          metric: String(doc.metric),
          metricLabel: String(doc.metricLabel),
          image: src,
          alt: String(doc.alt || resolveMediaAlt(doc.image) || ""),
          href: String(doc.href || "/clients/sevenloop"),
        };
      })
      .filter((row): row is FeaturedProject => Boolean(row));
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
      depth: 1,
    });
    if (!result.docs.length) return fallbackPortfolio;
    const mapped = result.docs
      .map((doc) => {
        const src = resolveMediaUrl(doc.image);
        if (!src) return null;
        return {
          name: String(doc.name),
          category: String(doc.category),
          image: src,
          alt: String(doc.alt || resolveMediaAlt(doc.image) || ""),
          href: String(doc.href || "/clients/sevenloop"),
        };
      })
      .filter((row): row is PortfolioItem => Boolean(row));
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
      depth: 0,
    });
    if (!result.docs.length) return fallbackPainPoints;
    return result.docs.map((doc) => ({
      tag: String(doc.tag),
      quote: String(doc.quote),
      resolution: String(doc.resolution),
    }));
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
      depth: 0,
    });
    if (!result.docs.length) return fallbackCaseStudies;
    return result.docs.map((doc) => ({
      number: String(doc.number),
      name: String(doc.name),
      description: String(doc.description),
      tags: labels(doc.tags as LabelRow[]),
      href: String(doc.href || "/clients/sevenloop/case-study"),
    }));
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

export type ClientHubContent = {
  navItems: ClientHubNavItem[];
  about: typeof sevenloopAbout;
  logoDesign: typeof sevenloopLogoDesign;
  websiteDesign: typeof sevenloopWebsiteDesign;
  projectBrochure: typeof sevenloopProjectBrochure;
  brandVideo: typeof sevenloopBrandVideo;
  behindTheScenes: typeof sevenloopBehindTheScenes;
  caseStudy: typeof sevenloopCaseStudy;
  partnership: typeof sevenloopPartnership;
  transformation: typeof sevenloopTransformation;
  projectTeam: typeof sevenloopProjectTeam;
};

const fallbackClientHub: ClientHubContent = {
  navItems: fallbackNavItems.map((item) => ({ id: item.id, label: item.label })),
  about: sevenloopAbout,
  logoDesign: sevenloopLogoDesign,
  websiteDesign: sevenloopWebsiteDesign,
  projectBrochure: sevenloopProjectBrochure,
  brandVideo: sevenloopBrandVideo,
  behindTheScenes: sevenloopBehindTheScenes,
  caseStudy: sevenloopCaseStudy,
  partnership: sevenloopPartnership,
  transformation: sevenloopTransformation,
  projectTeam: sevenloopProjectTeam,
};

export const getClientHub = cache(async (): Promise<ClientHubContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackClientHub;

  try {
    const g = await payload.findGlobal({ slug: "client-hub", depth: 2 });
    const navItems = (g.navItems || [])
      .map((item) => ({
        id: item.navId?.trim() || "",
        label: item.label?.trim() || "",
      }))
      .filter((item) => item.id && item.label);
    if (!g.about?.body && !navItems.length) return fallbackClientHub;

    return {
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
      },
      websiteDesign: {
        italic: g.websiteDesign?.italic || fallbackClientHub.websiteDesign.italic,
        rest: g.websiteDesign?.rest || fallbackClientHub.websiteDesign.rest,
        image: image(g.websiteDesign?.image, fallbackClientHub.websiteDesign.image),
      },
      projectBrochure: {
        italic: g.projectBrochure?.italic || fallbackClientHub.projectBrochure.italic,
        rest: g.projectBrochure?.rest || fallbackClientHub.projectBrochure.rest,
        images: images(
          g.projectBrochure?.images,
          fallbackClientHub.projectBrochure.images,
        ),
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
        };
      })(),
      behindTheScenes: {
        italic: g.behindTheScenes?.italic || fallbackClientHub.behindTheScenes.italic,
        rest: g.behindTheScenes?.rest || fallbackClientHub.behindTheScenes.rest,
        images: images(
          g.behindTheScenes?.images,
          fallbackClientHub.behindTheScenes.images,
        ),
      },
      caseStudy: {
        italic: g.caseStudy?.italic || fallbackClientHub.caseStudy.italic,
        rest: g.caseStudy?.rest || fallbackClientHub.caseStudy.rest,
        subheading: g.caseStudy?.subheading || fallbackClientHub.caseStudy.subheading,
        href: g.caseStudy?.href || fallbackClientHub.caseStudy.href,
      },
      partnership: {
        label: g.partnership?.label || fallbackClientHub.partnership.label,
        heading: g.partnership?.heading || fallbackClientHub.partnership.heading,
        headingAccent:
          g.partnership?.headingAccent || fallbackClientHub.partnership.headingAccent,
        paragraphs: (() => {
          const next = texts(g.partnership?.paragraphs);
          return next.length ? next : fallbackClientHub.partnership.paragraphs;
        })(),
      },
      transformation: {
        heading: g.transformation?.heading || fallbackClientHub.transformation.heading,
        subtext: g.transformation?.subtext || fallbackClientHub.transformation.subtext,
        before: image(
          g.transformation?.before,
          fallbackClientHub.transformation.before,
        ),
        after: image(g.transformation?.after, fallbackClientHub.transformation.after),
      },
      projectTeam: {
        heading: g.projectTeam?.heading || fallbackClientHub.projectTeam.heading,
        subheading:
          g.projectTeam?.subheading || fallbackClientHub.projectTeam.subheading,
        members: (g.projectTeam?.members || []).length
          ? (g.projectTeam?.members || []).map((member, i) => ({
              name: member.name || fallbackClientHub.projectTeam.members[i]?.name || "",
              role: member.role || fallbackClientHub.projectTeam.members[i]?.role || "",
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
});

export type CaseStudyPageContent = {
  hero: typeof sevenloopCaseStudyHero;
  details: typeof sevenloopCaseStudyDetails;
  gallery: typeof sevenloopCaseStudyGallery;
  viewAll: typeof sevenloopCaseStudyViewAllClients;
};

const fallbackCaseStudyPage: CaseStudyPageContent = {
  hero: sevenloopCaseStudyHero,
  details: sevenloopCaseStudyDetails,
  gallery: sevenloopCaseStudyGallery,
  viewAll: sevenloopCaseStudyViewAllClients,
};

export const getCaseStudyPage = cache(async (): Promise<CaseStudyPageContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallbackCaseStudyPage;

  try {
    const g = await payload.findGlobal({ slug: "case-study-page", depth: 2 });
    if (!g.hero?.heading && !g.details?.quote) return fallbackCaseStudyPage;

    return {
      hero: {
        heading: g.hero?.heading || fallbackCaseStudyPage.hero.heading,
        breadcrumbCurrent:
          g.hero?.breadcrumbCurrent || fallbackCaseStudyPage.hero.breadcrumbCurrent,
        breadcrumb: (g.hero?.breadcrumb || []).length
          ? (g.hero?.breadcrumb || []).map((item) => ({
              label: item.label || "",
              href: item.href || "#",
            }))
          : fallbackCaseStudyPage.hero.breadcrumb,
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
    return fallbackCaseStudyPage;
  }
});
