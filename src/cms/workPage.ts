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

    const projects = (
      await Promise.all(
        (doc.projects || []).map(async (row, index) => {
          const name = row?.name?.trim() || "";
          const category = row?.category?.trim() || "";
          if (!name || !projectCategories.has(category as Exclude<WorkFilterId, "all">)) return null;
          const designed = fallback.projects[index];
          let imageSrc = storedImage(row?.image, "");

          if (!imageSrc && row?.image != null) {
            const mediaId =
              typeof row.image === "number"
                ? row.image
                : typeof row.image === "string" && /^\d+$/.test(row.image)
                  ? Number(row.image)
                  : typeof row.image === "object" && "id" in row.image
                    ? Number((row.image as { id: unknown }).id)
                    : null;
            if (mediaId && Number.isFinite(mediaId)) {
              try {
                const mediaDoc = await payload.findByID({
                  collection: "media",
                  id: mediaId,
                  depth: 0,
                });
                imageSrc = storedImage(mediaDoc, "");
              } catch {}
            }
          }

          if (!imageSrc) {
            let clientDoc: Record<string, unknown> | null = null;
            const slugMatch = row?.href?.match(/^\/(?:clients|work)\/([^/?#]+)/);
            const clientSlug = slugMatch ? slugMatch[1].trim() : "";
            if (clientSlug) {
              try {
                const found = await payload.find({
                  collection: "clients",
                  where: { slug: { equals: clientSlug } },
                  limit: 1,
                  depth: 1,
                });
                clientDoc = (found.docs[0] as unknown as Record<string, unknown>) || null;
              } catch {}
            }
            if (!clientDoc && name) {
              try {
                const found = await payload.find({
                  collection: "clients",
                  where: { name: { equals: name } },
                  limit: 1,
                  depth: 1,
                });
                clientDoc = (found.docs[0] as unknown as Record<string, unknown>) || null;
              } catch {}
            }

            if (clientDoc) {
              const hubHeroImg = (clientDoc.hero as { image?: unknown } | undefined)?.image;
              imageSrc = storedImage(hubHeroImg, "");
              if (!imageSrc && hubHeroImg != null) {
                const id =
                  typeof hubHeroImg === "number"
                    ? hubHeroImg
                    : (hubHeroImg as { id?: unknown })?.id;
                if (typeof id === "number" || (typeof id === "string" && /^\d+$/.test(id))) {
                  try {
                    const mediaDoc = await payload.findByID({
                      collection: "media",
                      id: Number(id),
                      depth: 0,
                    });
                    imageSrc = storedImage(mediaDoc, "");
                  } catch {}
                }
              }

              if (!imageSrc) {
                let studyDoc: Record<string, unknown> | null = null;
                const studyId =
                  typeof clientDoc.featuredStudy === "object" && clientDoc.featuredStudy !== null
                    ? (clientDoc.featuredStudy as { id?: unknown }).id
                    : clientDoc.featuredStudy;
                if (typeof studyId === "number" || (typeof studyId === "string" && /^\d+$/.test(studyId))) {
                  try {
                    studyDoc = (await payload.findByID({
                      collection: "case-studies",
                      id: Number(studyId),
                      depth: 1,
                    })) as unknown as Record<string, unknown>;
                  } catch {}
                }
                if (!studyDoc && clientDoc.id) {
                  try {
                    const found = await payload.find({
                      collection: "case-studies",
                      where: { client: { equals: clientDoc.id } },
                      limit: 1,
                      depth: 1,
                    });
                    studyDoc = (found.docs[0] as unknown as Record<string, unknown>) || null;
                  } catch {}
                }
                if (studyDoc) {
                  const studyHero = studyDoc.hero as {
                    layout?: string;
                    left?: { image?: unknown };
                    right?: { image?: unknown };
                    image?: { image?: unknown };
                  } | undefined;
                  const candidate =
                    studyHero?.layout === "split"
                      ? studyHero?.left?.image || studyHero?.right?.image || studyHero?.image?.image || studyHero?.image
                      : studyHero?.image?.image || studyHero?.image || studyHero?.left?.image || studyHero?.right?.image;
                  imageSrc = storedImage(candidate, "");
                  if (!imageSrc && candidate != null) {
                    const id =
                      typeof candidate === "number"
                        ? candidate
                        : (candidate as { id?: unknown })?.id;
                    if (typeof id === "number" || (typeof id === "string" && /^\d+$/.test(id))) {
                      try {
                        const mediaDoc = await payload.findByID({
                          collection: "media",
                          id: Number(id),
                          depth: 0,
                        });
                        imageSrc = storedImage(mediaDoc, "");
                      } catch {}
                    }
                  }
                  if (!imageSrc) {
                    imageSrc = "/assets/images/client-hub/case-study-hero.jpg";
                  }
                }
              }
            }
          }

          if (!imageSrc) {
            imageSrc =
              designed?.image && designed.name.toLowerCase() === name.toLowerCase()
                ? designed.image
                : "/assets/images/work/01.png";
          }

          return {
            id: `work-${index}`,
            name,
            service: row?.service?.trim() || designed?.service || "",
            image: imageSrc,
            category: category as Exclude<WorkFilterId, "all">,
            href: row?.href?.trim() || "#",
          };
        }),
      )
    ).filter((row): row is WorkContent["projects"][number] => Boolean(row));

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
