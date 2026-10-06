import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import { workFilters, workProjects, type WorkFilterId } from "@/data/workPage";

const filterIds = new Set<WorkFilterId>(workFilters.map((filter) => filter.id));
const projectCategories = new Set<Exclude<WorkFilterId, "all">>([
  "fashion",
  "health",
  "technology",
  "finance",
  "home",
  "industry",
]);

export type WorkContent = {
  breadcrumbCurrent: string;
  heading: string;
  filters: { id: WorkFilterId; label: string }[];
  projects: {
    id: string;
    name: string;
    service: string;
    image: string;
    category: Exclude<WorkFilterId, "all">;
    href: string;
  }[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: WorkContent = {
  breadcrumbCurrent: "Work",
  heading: "Worked with companies from a diverse set of industries",
  filters: workFilters.map((filter) => ({ id: filter.id, label: filter.label })),
  projects: workProjects.map((project) => ({ ...project, href: "#" })),
};

export const getWorkPage = cache(async (): Promise<WorkContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "work-page" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      heading?: string | null;
      filters?: Array<{ filterId?: string | null; label?: string | null } | null> | null;
      projects?: Array<{
        image?: unknown;
        name?: string | null;
        service?: string | null;
        category?: string | null;
        href?: string | null;
      } | null> | null;
    };

    const filters = (doc.filters || [])
      .map((row) => {
        const id = row?.filterId?.trim() || "";
        const label = row?.label?.trim() || "";
        if (!label || !filterIds.has(id as WorkFilterId)) return null;
        return { id: id as WorkFilterId, label };
      })
      .filter((row): row is { id: WorkFilterId; label: string } => Boolean(row));

    const projects = (doc.projects || [])
      .map((row, index) => {
        const name = row?.name?.trim() || "";
        const category = row?.category?.trim() || "";
        if (!name || !projectCategories.has(category as Exclude<WorkFilterId, "all">)) return null;
        const designed = fallback.projects[index];
        return {
          id: `work-${index}`,
          name,
          service: row?.service?.trim() || designed?.service || "",
          image: storedImage(row?.image, designed?.image || "/assets/images/work/01.png"),
          category: category as Exclude<WorkFilterId, "all">,
          href: row?.href?.trim() || "#",
        };
      })
      .filter((row): row is WorkContent["projects"][number] => Boolean(row));

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      heading: text(doc.heading, fallback.heading),
      filters: filters.length ? filters : fallback.filters,
      projects: projects.length ? projects : fallback.projects,
    };
  } catch (error) {
    console.warn("[cms] work page fallback", error);
    return fallback;
  }
});
