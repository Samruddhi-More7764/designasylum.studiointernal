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
      } | null> | null;
    };

    const cards = (doc.cards || [])
      .map((row, index) => {
        const name = row?.name?.trim() || "";
        if (!name) return null;
        const designed = fallback.cards[index];
        return {
          id: `client-card-${index}`,
          name,
          service: row?.service?.trim() || designed?.service || "",
          image: storedImage(row?.image, designed?.image || clientCards[0].image),
          href: row?.href?.trim() || "#",
        };
      })
      .filter((row): row is ClientsIndexContent["cards"][number] => Boolean(row));

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
