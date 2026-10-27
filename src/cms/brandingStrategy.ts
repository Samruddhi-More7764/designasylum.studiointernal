import { existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { resolveMediaUrl } from "@/cms/media";
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
  type ArticleSection,
} from "@/data/brandingAgencyPage";
import type { FaqItem } from "@/data/faq";
import { distributeLogosTriangle } from "@/cms/content";
import { marqueeRow1, marqueeRow2, type ClientLogo } from "@/data/clients";

const heroTitle = "Branding agency in Pune";
const heroIntro =
  "A branding agency should answer one question first: what do you want a buyer, an investor, or a hire to believe about you before they meet you. Most agencies skip the question and go straight to logo exploration. Design Asylum starts where every B2B brand actually has to start — with diagnosis, positioning, and the words on the page — and only then builds the identity.";
const heroImage = "/assets/images/branding-agency/hero-media.png";

const clientsHeading = {
  before: "Clients we did ",
  accent: "branding",
  after: " for",
};

type TextRow = { text?: string | null } | null | undefined;
type CmsSection = {
  anchor?: string | null;
  tocLabel?: string | null;
  headingBefore?: string | null;
  headingAccent?: string | null;
  headingAfter?: string | null;
  paragraphs?: TextRow[] | null;
  pointers?: Array<{ term?: string | null; text?: string | null } | null> | null;
  closing?: TextRow[] | null;
  highlightTitle?: string | null;
  highlightBody?: string | null;
};

export type BrandingStrategyContent = {
  breadcrumbCurrent: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  lead: string;
  sections: ArticleSection[];
  logoRow1: ClientLogo[];
  logoRow2: ClientLogo[];
  clientsBefore: string;
  clientsAccent: string;
  clientsAfter: string;
  clientTabs: { id: string; label: string }[];
  projects: {
    image: string;
    name: string;
    description: string;
    href: string;
    key: string;
    tab?: string;
  }[];
  faqs: FaqItem[];
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

function lines(rows: TextRow[] | null | undefined): string[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => row?.text?.trim() || "")
    .filter(Boolean);
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
    const pointers = (row.pointers || [])
      .map((item) => ({
        term: item?.term?.trim() || undefined,
        text: item?.text?.trim() || "",
      }))
      .filter((item) => item.text);
    const closing = lines(row.closing);
    const section: ArticleSection = {
      id: row.anchor?.trim() || `section-${index + 1}`,
      tocLabel: row.tocLabel?.trim() || `Section ${index + 1}`,
      before: row.headingBefore?.trim() || undefined,
      accent: row.headingAccent?.trim() || undefined,
      after: row.headingAfter?.trim() || undefined,
      paragraphs: lines(row.paragraphs),
    };
    if (pointers.length) section.pointers = pointers;
    if (closing.length) section.closing = closing;
    if (highlightTitle || highlightBody) {
      section.highlight = { title: highlightTitle, body: highlightBody };
    }
    return section;
  });
}

const fallback: BrandingStrategyContent = {
  breadcrumbCurrent,
  heroTitle,
  heroIntro,
  heroImage,
  lead: introduction,
  sections: articleSections,
  logoRow1: marqueeRow1,
  logoRow2: marqueeRow2,
  clientsBefore: clientsHeading.before,
  clientsAccent: clientsHeading.accent,
  clientsAfter: clientsHeading.after,
  clientTabs: clientBrandingTabs.map((tab) => ({ id: tab.id, label: tab.label })),
  projects: brandingProjects,
  faqs: serviceFaqItems,
  expertsBefore: brandingExpertsHeading.before,
  expertsAccent: brandingExpertsHeading.accent,
  expertsSubheading: brandingExpertsHeading.subheading,
  experts: brandingExperts.map((member) => ({ ...member, href: "/" })),
  relatedBefore: relatedBlogsHeading.before,
  relatedAccent: relatedBlogsHeading.accent,
  relatedBlogs,
};

export const getBrandingStrategy = cache(async (): Promise<BrandingStrategyContent> => {
  return fallback;
});

