import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { faqDetails, type FaqDetail } from "@/data/faqDetailPage";

const designedCrumb = "Sevenloop Brand Website Redesign";

export type FaqDetailContent = FaqDetail & { breadcrumbCurrent: string };

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

export const getFaqDetail = cache(async (slug: string): Promise<FaqDetailContent | null> => {
  const designed = faqDetails[slug];
  const payload = await getPayloadClient();
  if (!payload) {
    return designed ? { ...designed, breadcrumbCurrent: designedCrumb } : null;
  }

  try {
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
    if (cmsSlug !== slug) {
      return designed ? { ...designed, breadcrumbCurrent: designedCrumb } : null;
    }

    const base = designed ?? { slug, question: "", lead: "", sections: [] };
    const sections = (doc.sections || [])
      .map((section) => ({
        id: section?.anchor?.trim() || "",
        title: section?.title?.trim() || "",
        body: section?.body?.trim() || "",
      }))
      .filter((section) => section.id && section.title && section.body);

    if (!text(doc.question, base.question)) return null;

    return {
      slug,
      question: text(doc.question, base.question),
      lead: text(doc.lead, base.lead),
      sections: sections.length ? sections : base.sections,
      breadcrumbCurrent: text(doc.breadcrumbCurrent, designedCrumb),
    };
  } catch (error) {
    console.warn("[cms] faq detail fallback", error);
    return designed ? { ...designed, breadcrumbCurrent: designedCrumb } : null;
  }
});
