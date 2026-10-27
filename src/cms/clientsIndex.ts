import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import { clientCards, clientsHeading } from "@/data/clientsIndexPage";

export type ClientsIndexContent = {
  breadcrumbCurrent: string;
  heading: string;
  cards: {
    id: string;
    name: string;
    service: string;
    image: string;
    href: string;
  }[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: ClientsIndexContent = {
  breadcrumbCurrent: "Clients",
  heading: clientsHeading,
  cards: clientCards.map((card) => ({ ...card })),
};

export const getClientsIndex = cache(async (): Promise<ClientsIndexContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "clients-index" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      heading?: string | null;
      cards?: Array<{
        image?: unknown;
        name?: string | null;
        service?: string | null;
        href?: string | null;
        order?: number | string | null;
      } | null> | null;
    };


    const cards = (
      await Promise.all(
        (doc.cards || []).map(async (row, index) => {
          const name = row?.name?.trim() || "";
          if (!name) return null;
          const designed = fallback.cards[index];
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
                : clientCards[0].image;
          }

          const rawOrder = row?.order;
          const order =
            typeof rawOrder === "number" && !isNaN(rawOrder)
              ? rawOrder
              : typeof rawOrder === "string" && /^\d+/.test(rawOrder)
                ? parseInt(rawOrder, 10)
                : index + 1;

          return {
            id: `client-card-${index}`,
            name,
            service: row?.service?.trim() || designed?.service || "",
            image: imageSrc,
            href: row?.href?.trim() || "#",
            order,
          };
        }),
      )
    )
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .sort((a, b) => a.order - b.order)
      .map(({ order: _order, ...card }) => card);

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      heading: text(doc.heading, fallback.heading),
      cards: cards.length ? cards : fallback.cards,
    };

  } catch (error) {
    console.warn("[cms] clients page fallback", error);
    return fallback;
  }
});
