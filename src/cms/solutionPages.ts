import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { resolveMediaUrl } from "@/cms/media";
import { distributeLogosTriangle } from "@/cms/content";
import type { ClientLogo } from "@/data/clients";
import {
  brandingStrategyFallback,
  type BrandingStrategyContent,
} from "@/cms/brandingStrategy";
import type { ArticleSection } from "@/data/brandingAgencyPage";

const defaultHeroImage = "/assets/images/branding-agency/hero-media.png";

type TextRow = { text?: string | null } | null | undefined;
type PointerRow = { term?: string | null; text?: string | null } | null | undefined;
type CmsSection = {
  anchor?: string | null;
  tocLabel?: string | null;
  headingBefore?: string | null;
  headingAccent?: string | null;
  headingAfter?: string | null;
  paragraphs?: TextRow[] | null;
  pointers?: PointerRow[] | null;
  closing?: TextRow[] | null;
  highlightTitle?: string | null;
  highlightBody?: string | null;
};

type LinkedClient = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  heroImage?: unknown;
  adminTitle?: string | null;
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

type RawSolutionDoc = {
  title?: string | null;
  slug?: string | null;
  breadcrumbCurrent?: string | null;
  heroTitle?: string | null;
  heroIntro?: string | null;
  heroImage?: unknown;
  lead?: string | null;
  sections?: CmsSection[] | null;
  logos?: Array<{
    name?: string | null;
    image?: unknown;
    width?: number | null;
    height?: number | null;
    row?: "1" | "2" | null;
  } | null> | null;
  clientsBefore?: string | null;
  clientsAccent?: string | null;
  clientsAfter?: string | null;
  clientTabs?: Array<{ tabId?: string | null; label?: string | null } | null> | null;
  projects?: Array<{
    client?: LinkedClient | string | number | null;
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
    member?: LinkedMember | string | number | null;
    image?: unknown;
    name?: string | null;
    role?: string | null;
    readMoreUrl?: string | null;
  } | null> | null;
  relatedBefore?: string | null;
  relatedAccent?: string | null;
  relatedBlogs?: Array<{
    post?: LinkedBlogPost | string | number | null;
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

function lines(rows: TextRow[] | null | undefined): string[] {
  if (!rows?.length) return [];
  return rows.map((row) => row?.text?.trim() || "").filter(Boolean);
}

function mediaSrc(value: unknown, fallback: string): string {
  const src = resolveMediaUrl(value);
  return src || fallback;
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

function parseSolutionDoc(
  doc: RawSolutionDoc,
  fallback: BrandingStrategyContent,
): BrandingStrategyContent {
  const sections = sectionsFrom(doc.sections);

  const tabs = (doc.clientTabs || [])
    .map((tab) => {
      const id = tab?.tabId?.trim() || "";
      const label = tab?.label?.trim() || "";
      if (!id || !label) return null;
      return { id, label };
    })
    .filter((tab): tab is { id: string; label: string } => Boolean(tab));

  const projects = (doc.projects || [])
    .map((row, index) => {
      const linked =
        row?.client && typeof row.client === "object" ? row.client : null;
      const name = row?.name?.trim() || linked?.name?.trim() || "";
      if (!name) return null;

      const fallbackHref = linked?.slug ? `/clients/${linked.slug}` : "/";
      const href = row?.href?.trim() || fallbackHref;
      const description = row?.description?.trim() || "";
      const image = mediaSrc(row?.image || linked?.heroImage, defaultHeroImage);

      return {
        key: `solution-proj-${index}`,
        name,
        description,
        href,
        image,
        tab: row?.tab || undefined,
      };
    })
    .filter((proj): proj is NonNullable<typeof proj> => Boolean(proj));

  const faqs = (doc.faqs || [])
    .map((faq) => {
      const question = faq?.question?.trim() || "";
      if (!question) return null;
      return {
        question,
        answer: faq?.answer?.trim() || "",
      };
    })
    .filter((faq): faq is NonNullable<typeof faq> => Boolean(faq));

  const experts = (doc.experts || [])
    .map((row, index) => {
      const linked =
        row?.member && typeof row.member === "object" ? row.member : null;
      const name = row?.name?.trim() || linked?.name?.trim() || "";
      if (!name) return null;

      const role = row?.role?.trim() || linked?.role?.trim() || "Strategy & Design";
      const fallbackHref = linked?.slug ? `/team/${linked.slug}` : "/team";
      const href = row?.readMoreUrl?.trim() || fallbackHref;
      const image = mediaSrc(row?.image || linked?.photoOne, defaultHeroImage);

      return {
        key: `solution-expert-${index}`,
        name,
        role,
        href,
        image,
      };
    })
    .filter((exp): exp is NonNullable<typeof exp> => Boolean(exp));

  const posts = (doc.relatedBlogs || [])
    .map((row, index) => {
      const linked = row?.post && typeof row.post === "object" ? row.post : null;
      const title = row?.title?.trim() || linked?.title?.trim() || "";
      if (!title) return null;

      const fallbackHref = linked?.slug ? `/blogs/${linked.slug}` : "/blogs";
      const href = row?.href?.trim() || fallbackHref;
      const date = row?.date?.trim() || linked?.date?.trim() || "Recent";
      const readTime = row?.readTime?.trim() || linked?.readTime?.trim() || "5 min read";
      const image = mediaSrc(row?.image || linked?.image, defaultHeroImage);

      return {
        key: `solution-blog-${index}`,
        title,
        date,
        readTime,
        href,
        image,
      };
    })
    .filter((blog): blog is NonNullable<typeof blog> => Boolean(blog));

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

  const distributed = (() => {
    if (!logos.length) return { row1: fallback.logoRow1, row2: fallback.logoRow2 };
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
  })();

  const resolvedBreadcrumb =
    doc.breadcrumbCurrent?.trim() || doc.title?.trim() || fallback.breadcrumbCurrent;

  return {
    breadcrumbCurrent: resolvedBreadcrumb,
    heroTitle: text(doc.heroTitle, fallback.heroTitle),
    heroIntro: text(doc.heroIntro, fallback.heroIntro),
    heroImage: mediaSrc(doc.heroImage, fallback.heroImage),
    lead: text(doc.lead, fallback.lead),
    sections: sections ?? fallback.sections,
    logoRow1: distributed.row1,
    logoRow2: distributed.row2,
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

export const getSolutionPageBySlug = cache(
  async (slug: string): Promise<BrandingStrategyContent | null> => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    if (!cleanSlug) return null;

    const payload = await getPayloadClient();
    const blueprintFallback = brandingStrategyFallback;

    if (payload) {
      try {
        const res = (await payload.find({
          collection: "solution-pages" as "users",
          where: {
            or: [
              { slug: { equals: cleanSlug } },
              { slug: { equals: `/${cleanSlug}` } },
            ],
          },
          limit: 1,
          depth: 2,
        })) as unknown as { docs: RawSolutionDoc[] };

        if (res.docs && res.docs.length > 0 && res.docs[0]) {
          return parseSolutionDoc(res.docs[0], blueprintFallback);
        }
      } catch (error) {
        console.warn("[cms] solution-pages collection query error:", error);
      }
    }

    return null;
  },
);
