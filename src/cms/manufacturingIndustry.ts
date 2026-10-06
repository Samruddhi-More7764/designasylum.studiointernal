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
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "manufacturing-industry" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      heroTitle?: string | null;
      heroIntro?: string | null;
      heroImage?: unknown;
      lead?: string | null;
      preface?: TextRow[] | null;
      sections?: CmsSection[] | null;
      logos?: Array<{
        image?: unknown;
        name?: string | null;
        width?: number | null;
        height?: number | null;
        row?: string | null;
      } | null> | null;
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
      faqs?: Array<{ question?: string | null; answer?: string | null } | null> | null;
      expertsBefore?: string | null;
      expertsAccent?: string | null;
      expertsSubheading?: string | null;
      experts?: Array<{
        image?: unknown;
        name?: string | null;
        role?: string | null;
        readMoreUrl?: string | null;
      } | null> | null;
      relatedBefore?: string | null;
      relatedAccent?: string | null;
      relatedBlogs?: Array<{
        image?: unknown;
        date?: string | null;
        readTime?: string | null;
        title?: string | null;
        href?: string | null;
      } | null> | null;
    };

    const sections = sectionsFrom(doc.sections);
    const preface = linesOf(doc.preface);
    const tabs = (doc.clientTabs || [])
      .map((tab) => ({
        id: tab?.tabId?.trim() || "",
        label: tab?.label?.trim() || "",
      }))
      .filter((tab) => tab.id && tab.label);
    const projects = (doc.projects || [])
      .map((project, index) => ({
        image: mediaSrc(project?.image, brandingProjects[index]?.image || heroImage),
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
    const experts = (doc.experts || [])
      .map((member, index) => ({
        image: mediaSrc(member?.image, brandingExperts[0]?.image || heroImage),
        name: member?.name?.trim() || "",
        role: member?.role?.trim() || "",
        key: `expert-${index}`,
        href: member?.readMoreUrl?.trim() || "/",
      }))
      .filter((member) => member.name && member.role);
    const posts = (doc.relatedBlogs || [])
      .map((post, index) => ({
        image: mediaSrc(post?.image, relatedBlogs[0]?.image || heroImage),
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
          image: mediaSrc(logo?.image, heroImage),
          width: logo?.width || 160,
          height: logo?.height || 48,
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
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      heroTitle: text(doc.heroTitle, fallback.heroTitle),
      heroIntro: text(doc.heroIntro, fallback.heroIntro),
      heroImage: mediaSrc(doc.heroImage, fallback.heroImage),
      lead: text(doc.lead, fallback.lead),
      preface: preface.length ? preface : fallback.preface,
      sections: sections ?? fallback.sections,
      logos: logos.length
        ? {
            row1: [...assignedTop, ...unassigned.slice(0, 4)].map(toLogo),
            row2: [...assignedBottom, ...unassigned.slice(4)].map(toLogo),
          }
        : null,
      clientsBefore: text(doc.clientsBefore, fallback.clientsBefore),
      clientsAccent: text(doc.clientsAccent, fallback.clientsAccent),
      clientsAfter: text(doc.clientsAfter, fallback.clientsAfter),
      clientTabs: tabs.length ? tabs : fallback.clientTabs,
      projects: projects.length ? projects : fallback.projects,
      faqs: faqs.length ? faqs : fallback.faqs,
      expertsBefore: text(doc.expertsBefore, fallback.expertsBefore),
      expertsAccent: text(doc.expertsAccent, fallback.expertsAccent),
      expertsSubheading: text(doc.expertsSubheading, fallback.expertsSubheading),
      experts: experts.length ? experts : fallback.experts,
      relatedBefore: text(doc.relatedBefore, fallback.relatedBefore),
      relatedAccent: text(doc.relatedAccent, fallback.relatedAccent),
      relatedBlogs: posts.length ? posts : fallback.relatedBlogs,
    };
  } catch (error) {
    console.warn("[cms] manufacturing industry fallback", error);
    return fallback;
  }
});
