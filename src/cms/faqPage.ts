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
      depth: 0,
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

    const entries = (doc.entries || [])
      .map((row) => {
        const question = row?.question?.trim() || "";
        const category = row?.category?.trim() || "";
        if (!question || !categoryIds.has(category as FaqCategory)) return null;
        const entry: FaqEntry = {
          id: row?.entryId?.trim() || question,
          question,
          category: category as FaqCategory,
        };
        const answer = row?.answer?.trim();
        const detailSlug = row?.detailSlug?.trim();
        if (answer) entry.answer = answer;
        if (detailSlug) entry.detailSlug = detailSlug;
        return entry;
      })
      .filter((entry): entry is FaqEntry => Boolean(entry));

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
