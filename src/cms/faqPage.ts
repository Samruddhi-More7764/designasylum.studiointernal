import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { faqCategories, faqEntries, type FaqCategory, type FaqEntry } from "@/data/faqPage";

const categoryIds = new Set<FaqCategory>(["about", "branding", "website", "marketing"]);

export type FaqPageContent = {
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  categories: { id: "all" | FaqCategory; label: string }[];
  entries: FaqEntry[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: FaqPageContent = {
  titleBefore: "Frequently ",
  titleAccent: "Asked",
  titleAfter: " questions!",
  categories: faqCategories,
  entries: faqEntries,
};

export const getFaqPage = cache(async (): Promise<FaqPageContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "faq-page" as "site-footer",
      depth: 2,
    })) as unknown as {
      titleBefore?: string | null;
      titleAccent?: string | null;
      titleAfter?: string | null;
      categories?: Array<{ categoryId?: string | null; label?: string | null } | null> | null;
      entries?: Array<{
        entryId?: string | null;
        question?: string | null;
        category?: string | null;
        answer?: string | null;
        detailSlug?: string | null;
        faqDetail?: { slug?: string; id?: unknown } | string | number | null;
      } | null> | null;
    };

    const categories = (doc.categories || [])
      .map((row) => {
        const id = row?.categoryId?.trim() || "";
        const label = row?.label?.trim() || "";
        if (!label || (id !== "all" && !categoryIds.has(id as FaqCategory))) return null;
        return { id: id as "all" | FaqCategory, label };
      })
      .filter((row): row is { id: "all" | FaqCategory; label: string } => Boolean(row));

    const entries = (
      await Promise.all(
        (doc.entries || []).map(async (row, index) => {
          const question = row?.question?.trim() || "";
          const category = row?.category?.trim() || "";
          if (!question || !categoryIds.has(category as FaqCategory)) return null;

          const rowEntryId = row?.entryId?.trim() || "";
          const designed =
            fallback.entries.find(
              (e) =>
                (rowEntryId && e.id === rowEntryId) ||
                e.question.toLowerCase() === question.toLowerCase(),
            ) || fallback.entries[index];

          let detailSlug = "";

          // 1. Populated faqDetail object
          if (row?.faqDetail && typeof row.faqDetail === "object" && "slug" in row.faqDetail) {
            detailSlug = (row.faqDetail as { slug?: string }).slug?.trim() || "";
          }

          // 2. Unpopulated ID: query faq-details collection
          if (!detailSlug && row?.faqDetail) {
            const detailId =
              typeof row.faqDetail === "object" && "id" in row.faqDetail
                ? (row.faqDetail as { id?: unknown }).id
                : row.faqDetail;
            if (typeof detailId === "number" || (typeof detailId === "string" && /^\d+$/.test(detailId))) {
              try {
                const detailDoc = await payload.findByID({
                  collection: "faq-details",
                  id: Number(detailId),
                  depth: 0,
                });
                if (detailDoc?.slug) detailSlug = detailDoc.slug.trim();
              } catch {}
            }
          }

          // 3. Direct detailSlug text in CMS
          if (!detailSlug && row?.detailSlug?.trim()) {
            detailSlug = row.detailSlug.trim().replace(/^\/+|\/+$/g, "");
          }

          // 4. Fallback to designed entry's detailSlug
          if (!detailSlug && designed?.detailSlug) {
            detailSlug = designed.detailSlug;
          }

          // 5. Fallback to rowEntryId or designed.id so CTA is always available
          if (!detailSlug) {
            detailSlug = rowEntryId || designed?.id || "";
          }

          const answer = row?.answer?.trim() || designed?.answer?.trim() || "";

          const entry: FaqEntry = {
            id: rowEntryId || designed?.id || `faq-${index}`,
            question,
            category: category as FaqCategory,
          };
          if (answer) entry.answer = answer;
          if (detailSlug) entry.detailSlug = detailSlug;
          return entry;
        }),
      )
    ).filter((entry): entry is FaqEntry => Boolean(entry));

    return {
      titleBefore: text(doc.titleBefore, fallback.titleBefore),
      titleAccent: text(doc.titleAccent, fallback.titleAccent),
      titleAfter: text(doc.titleAfter, fallback.titleAfter),
      categories: categories.length ? categories : fallback.categories,
      entries: entries.length ? entries : fallback.entries,
    };
  } catch (error) {
    console.warn("[cms] faq page fallback", error);
    return fallback;
  }
});
