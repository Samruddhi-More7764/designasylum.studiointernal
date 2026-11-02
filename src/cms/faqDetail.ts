import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { faqDetails, type FaqDetail } from "@/data/faqDetailPage";
import { faqEntries } from "@/data/faqPage";

const designedCrumb = "Sevenloop Brand Website Redesign";

export type FaqDetailContent = FaqDetail & { breadcrumbCurrent: string };

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function fallbackDetailFromFaq(cleanSlug: string): FaqDetailContent | null {
  const designed = faqDetails[cleanSlug];
  if (designed) return { ...designed, breadcrumbCurrent: designedCrumb };

  const matched = faqEntries.find((e) => e.id === cleanSlug || e.detailSlug === cleanSlug);
  if (!matched) return null;

  return {
    slug: cleanSlug,
    question: matched.question,
    lead: matched.answer || matched.question,
    sections: [
      {
        id: "strategic-overview",
        title: "Strategic Overview",
        body:
          matched.answer ||
          "Developing a rigorous brand framework requires direct alignment with market expectations and commercial objectives.",
      },
      {
        id: "messaging-positioning",
        title: "Messaging & Positioning",
        body:
          "Clear differentiation stems from translating complex technical value into unambiguous commercial incentives for enterprise decision-makers.",
      },
      {
        id: "execution-impact",
        title: "Execution & Commercial Impact",
        body:
          "A disciplined identity system accelerates sales velocity, elevates market perception, and establishes lasting authority across competitive sectors.",
      },
    ],
    breadcrumbCurrent: matched.question,
  };
}

export const getFaqDetail = cache(async (slug: string): Promise<FaqDetailContent | null> => {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim();
  const designed = faqDetails[cleanSlug];
  const payload = await getPayloadClient();
  if (!payload) {
    return fallbackDetailFromFaq(cleanSlug);
  }

  try {
    // 1. Check collection first
    const fromCollection = await payload.find({
      collection: "faq-details",
      where: { slug: { equals: cleanSlug } },
      limit: 1,
      depth: 0,
    });

    if (fromCollection.docs.length) {
      const doc = fromCollection.docs[0] as unknown as {
        slug?: string | null;
        breadcrumbCurrent?: string | null;
        question?: string | null;
        lead?: string | null;
        sections?: Array<{
          anchor?: string | null;
          title?: string | null;
          body?: string | null;
        } | null> | null;
      };

      const sections = (doc.sections || [])
        .map((section) => ({
          id: section?.anchor?.trim() || "",
          title: section?.title?.trim() || "",
          body: section?.body?.trim() || "",
        }))
        .filter((section) => section.id && section.title && section.body);

      const question = text(doc.question, designed?.question || "");
      if (!question) return null;

      return {
        slug: cleanSlug,
        question,
        lead: text(doc.lead, designed?.lead || ""),
        sections: sections.length ? sections : designed?.sections || [],
        breadcrumbCurrent: text(doc.breadcrumbCurrent, designedCrumb),
      };
    }

    // 2. Check legacy global
    const doc = (await payload.findGlobal({
      slug: "faq-detail" as "site-footer",
      depth: 0,
    })) as unknown as {
      slug?: string | null;
      breadcrumbCurrent?: string | null;
      question?: string | null;
      lead?: string | null;
      sections?: Array<{
        anchor?: string | null;
        title?: string | null;
        body?: string | null;
      } | null> | null;
    };

    const cmsSlug = doc.slug?.trim() || "defense-tech";
    if (cmsSlug !== cleanSlug) {
      return fallbackDetailFromFaq(cleanSlug);
    }

    const base = designed ?? { slug: cleanSlug, question: "", lead: "", sections: [] };
    const sections = (doc.sections || [])
      .map((section) => ({
        id: section?.anchor?.trim() || "",
        title: section?.title?.trim() || "",
        body: section?.body?.trim() || "",
      }))
      .filter((section) => section.id && section.title && section.body);

    if (!text(doc.question, base.question)) return null;

    return {
      slug: cleanSlug,
      question: text(doc.question, base.question),
      lead: text(doc.lead, base.lead),
      sections: sections.length ? sections : base.sections,
      breadcrumbCurrent: text(doc.breadcrumbCurrent, designedCrumb),
    };
  } catch (error) {
    console.warn("[cms] faq detail fallback", error);
    return fallbackDetailFromFaq(cleanSlug);
  }
});
