import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import {
  jobCategories,
  jobDetailHeadings,
  jobRoles,
  openRolesHeading,
  type JobCategoryId,
  type JobDepartment,
  type JobRole,
} from "@/data/openRolesPage";

const categoryIds = new Set<JobCategoryId>(jobCategories.map((category) => category.id));
const departments = new Set<JobDepartment>(
  jobCategories.flatMap((category) => (category.id === "all" ? [] : [category.id])),
);

export type OpenRolesContent = {
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  dutiesHeading: string;
  lookingHeading: string;
  categories: { id: JobCategoryId; label: string }[];
  roles: JobRole[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: OpenRolesContent = {
  titleBefore: openRolesHeading.before,
  titleAccent: openRolesHeading.accent,
  titleAfter: openRolesHeading.after,
  dutiesHeading: jobDetailHeadings.duties,
  lookingHeading: jobDetailHeadings.looking,
  categories: jobCategories.map((category) => ({ id: category.id, label: category.label })),
  roles: jobRoles,
};

export const getOpenRolesPage = cache(async (): Promise<OpenRolesContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "open-roles-page" as "site-footer",
      depth: 0,
    })) as unknown as {
      titleBefore?: string | null;
      titleAccent?: string | null;
      titleAfter?: string | null;
      dutiesHeading?: string | null;
      lookingHeading?: string | null;
      categories?: Array<{ categoryId?: string | null; label?: string | null } | null> | null;
      roles?: Array<{
        title?: string | null;
        slug?: string | null;
        breadcrumb?: string | null;
        summary?: string | null;
        category?: string | null;
        location?: string | null;
        employment?: string | null;
        experience?: string | null;
        applyLabel?: string | null;
        detailLocation?: string | null;
        detailExperience?: string | null;
        detailType?: string | null;
        responsibilities?: string | Array<{ text?: string | null } | null> | null;
        requirements?: string | Array<{ text?: string | null } | null> | null;
        content?: string | null;
        applyNowLabel?: string | null;
        applyNowHref?: string | null;
      } | null> | null;
    };

    const categories = (doc.categories || [])
      .map((row) => {
        const id = row?.categoryId?.trim() || "";
        const label = row?.label?.trim() || "";
        if (!label || !categoryIds.has(id as JobCategoryId)) return null;
        return { id: id as JobCategoryId, label };
      })
      .filter((row): row is { id: JobCategoryId; label: string } => Boolean(row));

    const roles: JobRole[] = (doc.roles || [])
      .map((row, index): JobRole | null => {
        const title = row?.title?.trim() || "";
        const summary = row?.summary?.trim() || "";
        const category = row?.category?.trim() || "";
        if (!title || !summary || !departments.has(category as JobDepartment)) return null;
        const designed = fallback.roles[index];
        const slug = text(row?.slug, designed?.slug || slugFrom(title, index));
        const responsibilities = lines(row?.responsibilities);
        const requirements = lines(row?.requirements);
        const roleContent = row?.content?.trim() || null;
        return {
          id: slug,
          slug,
          category: category as JobDepartment,
          title,
          breadcrumb: text(row?.breadcrumb, designed?.breadcrumb || title),
          summary,
          location: text(row?.location, designed?.location || "100% Remote"),
          employment: text(row?.employment, designed?.employment || "Full time"),
          experience: text(row?.experience, designed?.experience || ""),
          applyLabel: text(row?.applyLabel, "Apply"),
          detailLocation: text(row?.detailLocation, designed?.detailLocation || "Remote"),
          detailExperience: text(row?.detailExperience, designed?.detailExperience || ""),
          detailType: text(row?.detailType, designed?.detailType || "Full-time"),
          responsibilities: responsibilities.length ? responsibilities : designed?.responsibilities || [],
          requirements: requirements.length ? requirements : designed?.requirements || [],
          content: roleContent,
          applyNowLabel: text(row?.applyNowLabel, designed?.applyNowLabel || "Apply now"),
          applyNowHref: text(row?.applyNowHref, designed?.applyNowHref || "/why-design-asylum#apply"),
        };
      })
      .filter((row): row is JobRole => row !== null);

    return {
      titleBefore: text(doc.titleBefore, fallback.titleBefore),
      titleAccent: text(doc.titleAccent, fallback.titleAccent),
      titleAfter: text(doc.titleAfter, fallback.titleAfter),
      dutiesHeading: text(doc.dutiesHeading, fallback.dutiesHeading),
      lookingHeading: text(doc.lookingHeading, fallback.lookingHeading),
      categories: categories.length ? categories : fallback.categories,
      roles: roles.length ? roles : fallback.roles,
    };
  } catch (error) {
    console.warn("[cms] open roles page fallback", error);
    return fallback;
  }
});

function lines(value: string | Array<{ text?: string | null } | null> | null | undefined): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim().replace(/^[\u2022\u25E6\u2219\u00B7\u25AA\u25CF\-*]\s*/, "").replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return (value as unknown[])
      .map((row) => {
        if (typeof row === "string") return row.trim();
        if (row && typeof row === "object" && "text" in row) {
          return String((row as { text?: unknown }).text || "").trim();
        }
        return "";
      })
      .filter(Boolean);
  }
  return [];
}

function slugFrom(title: string, index: number) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "role"}-${index + 1}`;
}

export async function getOpenRole(slug: string) {
  const page = await getOpenRolesPage();
  const role = page.roles.find((item) => item.slug === slug);
  if (!role) return null;
  return {
    role,
    dutiesHeading: page.dutiesHeading,
    lookingHeading: page.lookingHeading,
  };
}
