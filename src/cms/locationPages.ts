import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import {
  brandingProjects,
  relatedBlogs,
  type ArticleSection,
} from "@/data/brandingAgencyPage";
import type { ClientLogo } from "@/data/clients";
import {
  ahmedabadCallout,
  ahmedabadFaqItems,
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

type LinkedClient = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  hero?: { image?: unknown; heading?: string | null; subheading?: string | null } | null;
  adminTitle?: string | null;
};

type LinkedLogo = {
  id?: string | number;
  name?: string | null;
  image?: unknown;
};

type LinkedBlogPost = {
  id?: string | number;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  readTime?: string | null;
  heroImage?: unknown;
  image?: unknown;
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
          collection: "location-pages" as "users",
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
              client?: unknown;
              category?: string | null;
              order?: number | null;
              heading?: string | null;
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
              clientLogo?: unknown;
              image?: unknown;
              name?: string | null;
              row?: string | null;
            } | null> | null;
            lead?: string | null;
            sections?: CmsSection[] | null;
            faqs?: Array<{ question?: string | null; answer?: string | null } | null> | null;
            relatedBefore?: string | null;
            relatedAccent?: string | null;
            relatedAfter?: string | null;
            relatedBlogs?: Array<{
              post?: unknown;
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
            .map((project, index) => {
              const linkedClient =
                project?.client && typeof project.client === "object"
                  ? (project.client as LinkedClient)
                  : null;

              const name =
                project?.heading?.trim() ||
                project?.name?.trim() ||
                linkedClient?.name?.trim() ||
                "";
              const description =
                project?.description?.trim() ||
                linkedClient?.adminTitle?.trim() ||
                linkedClient?.hero?.subheading?.trim() ||
                linkedClient?.hero?.heading?.trim() ||
                "";
              const image = storedImage(
                project?.image || linkedClient?.hero?.image,
                brandingProjects[index]?.image || defaultHeroImage,
              );
              const cleanClientSlug = linkedClient?.slug
                ? linkedClient.slug.replace(/^\/+|\/+$/g, "").trim()
                : "";
              const href =
                project?.href?.trim() ||
                (cleanClientSlug ? `/clients/${cleanClientSlug}` : "");
              const tab =
                project?.category?.trim() ||
                project?.tab?.trim() ||
                "location";

              return {
                name,
                description,
                image,
                href,
                key: `project-${index}`,
                tab,
                order: project?.order ?? index,
              };
            })
            .filter((project) => project.name && project.description)
            .sort((a, b) => a.order - b.order);

          const faqs = (doc.faqs || [])
            .map((item) => ({
              question: item?.question?.trim() || "",
              answer: item?.answer?.trim() || undefined,
            }))
            .filter((item) => item.question);

          const posts = (doc.relatedBlogs || [])
            .map((post, index) => {
              const linkedPost =
                post?.post && typeof post.post === "object"
                  ? (post.post as LinkedBlogPost)
                  : null;

              const title = post?.title?.trim() || linkedPost?.title?.trim() || "";
              const cleanPostSlug = linkedPost?.slug
                ? linkedPost.slug.replace(/^\/+|\/+$/g, "").trim()
                : "";
              const href =
                post?.href?.trim() ||
                (cleanPostSlug ? `/blogs/${cleanPostSlug}` : "/");

              return {
                image: storedImage(
                  post?.image || linkedPost?.heroImage || linkedPost?.image,
                  relatedBlogs[0]?.image || defaultHeroImage,
                ),
                date: post?.date?.trim() || linkedPost?.date?.trim() || "",
                readTime: post?.readTime?.trim() || linkedPost?.readTime?.trim() || "",
                title,
                href,
                key: `related-${index}`,
              };
            })
            .filter((post) => post.title);

          const logos = (doc.logos || [])
            .map((logo, index) => {
              const linkedLogo =
                logo?.clientLogo && typeof logo.clientLogo === "object"
                  ? (logo.clientLogo as LinkedLogo)
                  : null;

              const name = logo?.name?.trim() || linkedLogo?.name?.trim() || "";
              if (!name) return null;
              return {
                name,
                image: storedImage(logo?.image || linkedLogo?.image, defaultHeroImage),
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
        collection: "location-pages" as "users",
        limit: 100,
        depth: 0,
      });
      for (const doc of res.docs) {
        const item = doc as { slug?: string | null };
        if (item?.slug) {
          slugs.add(String(item.slug).trim().toLowerCase());
        }
      }
    } catch {}
  }

  return Array.from(slugs);
});

