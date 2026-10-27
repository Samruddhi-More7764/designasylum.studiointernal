import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { resolveMediaUrl } from "@/cms/media";
import { distributeLogosTriangle } from "@/cms/content";
import type { ClientLogo } from "@/data/clients";
import {
  manufacturingIndustryFallback,
  type ManufacturingContent,
} from "@/cms/manufacturingIndustry";
import type { ArticleSection } from "@/data/brandingAgencyPage";

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
  highlightTitle?: string | null;
  highlightBody?: string | null;
};

type LinkedClient = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  heroImage?: unknown;
  adminTitle?: string | null;
  projectType?: string | null;
};

type LinkedMember = {
  id?: string | number;
  name?: string | null;
  role?: string | null;
  slug?: string | null;
  photoOne?: unknown;
};

type LinkedBlogPost = {
  id?: string | number;
  title?: string | null;
  date?: string | null;
  readTime?: string | null;
  image?: unknown;
  slug?: string | null;
  href?: string | null;
};

type RawIndustryDoc = {
  title?: string | null;
  slug?: string | null;
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
    client?: LinkedClient | string | null;
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
    member?: LinkedMember | string | null;
    image?: unknown;
    name?: string | null;
    role?: string | null;
    readMoreUrl?: string | null;
  } | null> | null;
  relatedBefore?: string | null;
  relatedAccent?: string | null;
  relatedBlogs?: Array<{
    post?: LinkedBlogPost | string | null;
    image?: unknown;
    date?: string | null;
    readTime?: string | null;
    title?: string | null;
    href?: string | null;
  } | null> | null;
};

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function linesOf(rows: TextRow[] | null | undefined): string[] {
  if (!rows?.length) return [];
  return rows.map((row) => row?.text?.trim() || "").filter(Boolean);
}

function mediaSrc(value: unknown, fallback: string): string {
  return resolveMediaUrl(value) || fallback;
}

function sectionsFrom(rows: CmsSection[] | null | undefined): ArticleSection[] | null {
  if (!rows?.length) return null;
  return rows.map((row, index) => {
    const highlightTitle = row?.highlightTitle?.trim() || "";
    const highlightBody = row?.highlightBody?.trim() || "";
    const blocks = (row?.blocks || [])
      .map((block) => {
        const title = block?.title?.trim() || "";
        const paragraphs = linesOf(block?.paragraphs);
        if (!title || !paragraphs.length) return null;
        return { title, paragraphs };
      })
      .filter((b): b is NonNullable<typeof b> => Boolean(b));

    return {
      id: row?.anchor?.trim() || `section-${index + 1}`,
      tocLabel: row?.tocLabel?.trim() || `Section ${index + 1}`,
      before: row?.headingBefore?.trim() || "",
      accent: row?.headingAccent?.trim() || "",
      after: row?.headingAfter?.trim() || "",
      paragraphs: linesOf(row?.paragraphs),
      blocks: blocks.length ? blocks : undefined,
      highlight:
        highlightTitle || highlightBody
          ? { title: highlightTitle, body: highlightBody }
          : undefined,
    };
  });
}

function parseIndustryDoc(
  doc: RawIndustryDoc,
  fallback: ManufacturingContent,
): ManufacturingContent {
  const sections = sectionsFrom(doc.sections);
  const preface = linesOf(doc.preface);

  const tabs = (doc.clientTabs || [])
    .map((tab) => ({
      id: tab?.tabId?.trim() || "",
      label: tab?.label?.trim() || "",
    }))
    .filter((tab) => tab.id && tab.label);

  const projects = (doc.projects || [])
    .map((project, index) => {
      const linked =
        project?.client && typeof project.client === "object" ? project.client : null;
      const name = project?.name?.trim() || linked?.name?.trim() || "";
      if (!name) return null;
      const image = mediaSrc(
        project?.image || linked?.heroImage,
        fallback.projects[index]?.image || defaultHeroImage,
      );
      const cleanClientSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();
      const defaultHref = cleanClientSlug ? `/clients/${cleanClientSlug}` : "";
      const href = project?.href?.trim() || defaultHref || fallback.projects[index]?.href || "#";
      const description =
        project?.description?.trim() ||
        linked?.adminTitle?.trim() ||
        fallback.projects[index]?.description ||
        "";

      return {
        image,
        name,
        description,
        href,
        key: `project-${index}`,
        tab: project?.tab?.trim() || undefined,
      };
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const faqs = (doc.faqs || [])
    .map((item) => ({
      question: item?.question?.trim() || "",
      answer: item?.answer?.trim() || undefined,
    }))
    .filter((item) => item.question);

  const experts = (doc.experts || [])
    .map((expert, index) => {
      const linked =
        expert?.member && typeof expert.member === "object" ? expert.member : null;
      const name = expert?.name?.trim() || linked?.name?.trim() || "";
      if (!name) return null;
      const role = expert?.role?.trim() || linked?.role?.trim() || "";
      const image = mediaSrc(
        expert?.image || linked?.photoOne,
        fallback.experts[index]?.image || defaultHeroImage,
      );
      const cleanMemberSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();
      const defaultHref = cleanMemberSlug ? `/team/${cleanMemberSlug}` : "#";
      const href = expert?.readMoreUrl?.trim() || defaultHref;

      return {
        image,
        name,
        role,
        key: `expert-${index}`,
        href,
      };
    })
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const posts = (doc.relatedBlogs || [])
    .map((post, index) => {
      const linked = post?.post && typeof post.post === "object" ? post.post : null;
      const title = post?.title?.trim() || linked?.title?.trim() || "";
      if (!title) return null;
      const date = post?.date?.trim() || linked?.date?.trim() || "";
      const readTime = post?.readTime?.trim() || linked?.readTime?.trim() || "";
      const image = mediaSrc(
        post?.image || linked?.image,
        fallback.relatedBlogs[index]?.image || defaultHeroImage,
      );
      const cleanPostSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();
      const defaultHref = cleanPostSlug ? `/blogs/${cleanPostSlug}` : "#";
      const href = post?.href?.trim() || linked?.href?.trim() || defaultHref;

      return {
        image,
        date,
        readTime,
        title,
        href,
        key: `related-${index}`,
      };
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const logos = (doc.logos || [])
    .map((logo, index) => {
      const name = logo?.name?.trim() || "";
      if (!name) return null;
      return {
        name,
        image: mediaSrc(logo?.image, defaultHeroImage),
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

  const resolvedBreadcrumb =
    doc.breadcrumbCurrent?.trim() || doc.title?.trim() || fallback.breadcrumbCurrent;

  return {
    breadcrumbCurrent: resolvedBreadcrumb,
    heroTitle: text(doc.heroTitle, fallback.heroTitle),
    heroIntro: text(doc.heroIntro, fallback.heroIntro),
    heroImage: mediaSrc(doc.heroImage, fallback.heroImage),
    lead: text(doc.lead, fallback.lead),
    preface: preface.length ? preface : fallback.preface,
    sections: sections ?? fallback.sections,
    logos: (() => {
      if (!logos.length) return fallback.logos;
      if (logos.length <= 3) {
        return distributeLogosTriangle(logos.map(toLogo));
      }
      if (assignedTop.length && assignedBottom.length) {
        const splitPoint = Math.floor(unassigned.length / 2);
        return {
          row1: [...assignedTop, ...unassigned.slice(0, splitPoint)].map(toLogo),
          row2: [...assignedBottom, ...unassigned.slice(splitPoint)].map(toLogo),
        };
      }
      return distributeLogosTriangle(logos.map(toLogo));
    })(),
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
}

export const getIndustryPageBySlug = cache(
  async (slug: string): Promise<ManufacturingContent | null> => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    if (!cleanSlug) return null;

    const payload = await getPayloadClient();
    const blueprintFallback = manufacturingIndustryFallback;

    if (payload) {
      try {
        const res = (await payload.find({
          collection: "industry-pages" as "users",
          where: {
            or: [
              { slug: { equals: cleanSlug } },
              { slug: { equals: `/${cleanSlug}` } },
            ],
          },
          limit: 1,
          depth: 2,
        })) as unknown as { docs: RawIndustryDoc[] };

        if (res.docs && res.docs.length > 0 && res.docs[0]) {
          return parseIndustryDoc(res.docs[0], blueprintFallback);
        }
      } catch (error) {
        console.warn("[cms] industry-pages collection query error:", error);
      }
    }

    if (cleanSlug === "manufacturing") {
      return blueprintFallback;
    }

    return null;
  },
);
