import { existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { resolveMediaUrl } from "@/cms/media";
import {
  brandingExperts,
  brandingExpertsHeading,
  brandingProjects,
  clientBrandingTabs,
  relatedBlogs,
  relatedBlogsHeading,
  type ArticleSection,
} from "@/data/brandingAgencyPage";
import { distributeLogosTriangle } from "@/cms/content";
import type { ClientLogo } from "@/data/clients";
import {
  manufacturingBreadcrumbCurrent,
  manufacturingFaqItems,
  manufacturingHero,
  manufacturingLead,
  manufacturingPreface,
  manufacturingSections,
} from "@/data/manufacturingIndustryPage";

const heroImage = "/assets/images/branding-agency/hero-media.png";

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
  highlightTitle?: string | null;
  highlightBody?: string | null;
};

export type ManufacturingContent = {
  breadcrumbCurrent: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  lead: string;
  preface: string[];
  sections: ArticleSection[];
  /** Null keeps the homepage logo marquee. */
  logos: { row1: ClientLogo[]; row2: ClientLogo[] } | null;
  clientsBefore: string;
  clientsAccent: string;
  clientsAfter: string;
  clientTabs: { id: string; label: string }[];
  projects: Array<(typeof brandingProjects)[number] & { tab?: string }>;
  faqs: { question: string; answer?: string }[];
  expertsBefore: string;
  expertsAccent: string;
  expertsSubheading: string;
  experts: { image: string; name: string; role: string; key: string; href: string }[];
  relatedBefore: string;
  relatedAccent: string;
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

function mediaSrc(value: unknown, fallback: string): string {
  const src = resolveMediaUrl(value);
  if (!src) return fallback;
  if (!src.startsWith("/api/media/file/")) return src;
  const filename = decodeURIComponent(src.slice("/api/media/file/".length).split("?")[0]);
  const onDisk = path.join(process.cwd(), "media", path.basename(filename));
  return existsSync(onDisk) ? src : fallback;
}

function sectionsFrom(rows: CmsSection[] | null | undefined): ArticleSection[] | null {
  if (!rows?.length) return null;
  return rows.map((row, index) => {
    const highlightTitle = row.highlightTitle?.trim() || "";
    const highlightBody = row.highlightBody?.trim() || "";
    const blocks = (row.blocks || [])
      .map((block) => ({
        title: block?.title?.trim() || "",
        paragraphs: linesOf(block?.paragraphs),
      }))
      .filter((block) => block.title);
    const section: ArticleSection = {
      id: row.anchor?.trim() || `section-${index + 1}`,
      tocLabel: row.tocLabel?.trim() || `Section ${index + 1}`,
      before: row.headingBefore?.trim() || undefined,
      accent: row.headingAccent?.trim() || undefined,
      after: row.headingAfter?.trim() || undefined,
      paragraphs: linesOf(row.paragraphs),
    };
    if (blocks.length) section.blocks = blocks;
    if (highlightTitle || highlightBody) {
      section.highlight = { title: highlightTitle, body: highlightBody };
    }
    return section;
  });
}

const fallback: ManufacturingContent = {
  breadcrumbCurrent: manufacturingBreadcrumbCurrent,
  heroTitle: manufacturingHero.title,
  heroIntro: manufacturingHero.intro,
  heroImage,
  lead: manufacturingLead,
  preface: [...manufacturingPreface],
  sections: manufacturingSections,
  logos: null,
  clientsBefore: "Clients we did ",
  clientsAccent: "branding",
  clientsAfter: " for",
  clientTabs: clientBrandingTabs.map((tab) => ({ id: tab.id, label: tab.label })),
  projects: brandingProjects,
  faqs: manufacturingFaqItems,
  expertsBefore: brandingExpertsHeading.before,
  expertsAccent: brandingExpertsHeading.accent,
  expertsSubheading: brandingExpertsHeading.subheading,
  experts: brandingExperts.map((member) => ({ ...member, href: "/" })),
  relatedBefore: relatedBlogsHeading.before,
  relatedAccent: relatedBlogsHeading.accent,
  relatedBlogs,
};

export const getManufacturingIndustry = cache(async (): Promise<ManufacturingContent> => {
  return fallback;
});

