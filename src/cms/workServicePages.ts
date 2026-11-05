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
  hero?: { image?: unknown; heading?: string | null; subheading?: string | null } | null;
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
  heroImage?: unknown;
  slug?: string | null;
  href?: string | null;
};

type RawWorkServiceDoc = {
  title?: string | null;
  slug?: string | null;
  breadcrumbCurrent?: string | null;
  heroTitle?: string | null;
  heroIntro?: string | null;
  heroImage?: unknown;
  lead?: string | null;
  sections?: CmsSection[] | null;
  logos?: Array<{
    clientLogo?: { name?: string; image?: unknown } | string | number | null;
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
    heading?: string | null;
    name?: string | null;
    description?: string | null;
    href?: string | null;
    category?: string | null;
    tab?: string | null;
    order?: number | null;
    ctaText?: string | null;
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

async function parseWorkServiceDoc(
  doc: RawWorkServiceDoc,
  fallback: BrandingStrategyContent,
  payload?: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>,
): Promise<BrandingStrategyContent> {
  const sections = sectionsFrom(doc.sections) || [];

  const tabs = (doc.clientTabs || [])
    .map((tab) => {
      const id = tab?.tabId?.trim() || "";
      const label = tab?.label?.trim() || "";
      if (!id || !label) return null;
      return { id, label };
    })
    .filter((tab): tab is { id: string; label: string } => Boolean(tab));

  const projects = (
    await Promise.all(
      (doc.projects || []).map(async (project, index) => {
        let linked =
          project?.client && typeof project.client === "object" ? project.client : null;
        let cleanClientSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();

        if (!cleanClientSlug && project?.client && payload) {
          const clientId =
            typeof project.client === "object"
              ? (project.client as { id?: string | number }).id
              : project.client;
          if (clientId) {
            try {
              const clientDoc = await payload.findByID({
                collection: "clients",
                id: clientId,
                depth: 0,
              });
              if (clientDoc) {
                cleanClientSlug = clientDoc.slug?.replace(/^\/+|\/+$/g, "").trim();
                if (!linked) {
                  linked = clientDoc as unknown as typeof linked;
                }
              }
            } catch {}
          }
        }

        const name =
          project?.heading?.trim() || project?.name?.trim() || linked?.name?.trim() || "";
        if (!name) return null;
        const image = mediaSrc(
          project?.image || (linked as { hero?: { image?: unknown } })?.hero?.image || linked?.heroImage,
          defaultHeroImage,
        );
        const defaultHref = cleanClientSlug ? `/clients/${cleanClientSlug}` : "";
        const href = project?.href?.trim() || defaultHref || "#";
        const description =
          project?.description?.trim() ||
          linked?.adminTitle?.trim() ||
          "";
        const order = typeof project?.order === "number" ? project.order : index;

        return {
          image,
          name,
          description,
          href,
          ctaText: "View website",
          key: `work-service-proj-${index}`,
          tab: project?.category?.trim() || project?.tab?.trim() || undefined,
          order,
        };
      }),
    )
  )
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .sort((a, b) => a.order - b.order);

  const faqs = (doc.faqs || [])
    .map((faq) => {
      const question = faq?.question?.trim() || "";
      if (!question) return null;
      return {
        question,
        answer: faq?.answer?.trim() || undefined,
      };
    })
    .filter((faq): faq is NonNullable<typeof faq> => Boolean(faq));

  const experts = (
    await Promise.all(
      (doc.experts || []).map(async (expert, index) => {
        let linked =
          expert?.member && typeof expert.member === "object" ? expert.member : null;
        let cleanMemberSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();

        if (!cleanMemberSlug && expert?.member && payload) {
          const memberId =
            typeof expert.member === "object"
              ? (expert.member as { id?: string | number }).id
              : expert.member;
          if (memberId) {
            try {
              const memberDoc = await payload.findByID({
                collection: "team-members" as "users",
                id: memberId,
                depth: 0,
              });
              if (memberDoc) {
                cleanMemberSlug = (memberDoc as unknown as { slug?: string }).slug?.replace(/^\/+|\/+$/g, "").trim();
                if (!linked) {
                  linked = memberDoc as unknown as typeof linked;
                }
              }
            } catch {}
          }
        }

        const name = expert?.name?.trim() || linked?.name?.trim() || "";
        if (!name) return null;
        const role = expert?.role?.trim() || linked?.role?.trim() || "";
        const image = mediaSrc(
          expert?.image || linked?.photoOne,
          defaultHeroImage,
        );
        const cleanMemberSlugFinal = cleanMemberSlug || "";
        const defaultHref = cleanMemberSlugFinal ? `/team/${cleanMemberSlugFinal}` : "#";
        const href = expert?.readMoreUrl?.trim() || defaultHref;

        return {
          image,
          name,
          role,
          key: `work-service-expert-${index}`,
          href,
        };
      }),
    )
  ).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const posts = (
    await Promise.all(
      (doc.relatedBlogs || []).map(async (post, index) => {
        let linked = post?.post && typeof post.post === "object" ? post.post : null;
        let cleanPostSlug = linked?.slug?.replace(/^\/+|\/+$/g, "").trim();

        if (!cleanPostSlug && post?.post && payload) {
          const postId =
            typeof post.post === "object"
              ? (post.post as { id?: string | number }).id
              : post.post;
          if (postId) {
            try {
              const postDoc = await payload.findByID({
                collection: "blog-posts",
                id: postId,
                depth: 0,
              });
              if (postDoc) {
                cleanPostSlug = postDoc.slug?.replace(/^\/+|\/+$/g, "").trim();
                if (!linked) {
                  linked = postDoc as unknown as typeof linked;
                }
              }
            } catch {}
          }
        }

        const title = post?.title?.trim() || linked?.title?.trim() || "";
        if (!title) return null;
        const date = post?.date?.trim() || linked?.date?.trim() || "";
        const readTime = post?.readTime?.trim() || linked?.readTime?.trim() || "";
        const image = mediaSrc(
          post?.image || linked?.heroImage || linked?.image,
          defaultHeroImage,
        );
        const href = cleanPostSlug ? `/blogs/${cleanPostSlug}` : (post?.href?.trim() || "#");

        return {
          image,
          date,
          readTime,
          title,
          href,
          key: `work-service-blog-${index}`,
        };
      }),
    )
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const logos = (doc.logos || [])
    .map((logo, index) => {
      const linked =
        logo && "clientLogo" in logo && logo.clientLogo && typeof logo.clientLogo === "object"
          ? (logo.clientLogo as { name?: string; image?: unknown })
          : null;
      const name = logo?.name?.trim() || linked?.name?.trim() || "";
      if (!name) return null;
      return {
        name,
        image: mediaSrc(logo?.image || linked?.image, defaultHeroImage),
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

  const distributed = (() => {
    if (!logos.length) return { row1: [], row2: [] };
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
    doc.breadcrumbCurrent?.trim() || doc.title?.trim() || "";

  return {
    breadcrumbCurrent: resolvedBreadcrumb,
    heroTitle: doc.heroTitle?.trim() || doc.title?.trim() || "",
    heroIntro: doc.heroIntro?.trim() || "",
    heroImage: resolveMediaUrl(doc.heroImage) || defaultHeroImage,
    lead: doc.lead?.trim() || "",
    sections: sections,
    logoRow1: distributed.row1,
    logoRow2: distributed.row2,
    clientsBefore: doc.clientsBefore?.trim() || fallback.clientsBefore,
    clientsAccent: doc.clientsAccent?.trim() || fallback.clientsAccent,
    clientsAfter: doc.clientsAfter?.trim() || fallback.clientsAfter,
    clientTabs: tabs,
    projects: projects,
    faqs: faqs,
    expertsBefore: doc.expertsBefore?.trim() || fallback.expertsBefore,
    expertsAccent: doc.expertsAccent?.trim() || fallback.expertsAccent,
    expertsSubheading: doc.expertsSubheading?.trim() || fallback.expertsSubheading,
    experts: experts,
    relatedBefore: doc.relatedBefore?.trim() || fallback.relatedBefore,
    relatedAccent: doc.relatedAccent?.trim() || fallback.relatedAccent,
    relatedBlogs: posts,
  };
}

export const getWorkServicePageBySlug = cache(
  async (slug: string): Promise<BrandingStrategyContent | null> => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    if (!cleanSlug) return null;

    const payload = await getPayloadClient();
    const blueprintFallback = brandingStrategyFallback;

    if (payload) {
      try {
        const res = (await payload.find({
          collection: "work-service-pages" as "users",
          where: {
            or: [
              { slug: { equals: cleanSlug } },
              { slug: { equals: `/${cleanSlug}` } },
            ],
          },
          limit: 1,
          depth: 2,
        })) as unknown as { docs: RawWorkServiceDoc[] };

        if (res.docs && res.docs.length > 0 && res.docs[0]) {
          return await parseWorkServiceDoc(res.docs[0], blueprintFallback, payload);
        }
      } catch (error) {
        console.warn("[cms] work-service-pages collection query error:", error);
      }
    }

    if (cleanSlug === "brand-systems") {
      return blueprintFallback;
    }

    return null;
  },
);
