import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { isVideoMedia, isVideoSrc } from "@/cms/media";
import { storedImage } from "@/cms/storedImage";
import { resolvedClientHref } from "@/cms/urls";
import {
  studioFit,
  studioHero,
  studioMiss,
  studioProjects,
  studioProjectsHeading,
  studioTeam,
  studioTestimonial,
} from "@/data/studioPage";

export type StudioChip = { label: string; value: string };
export type StudioProject = { id: string; name: string; body: string; image: string; href: string };
export type StudioPerson = { name: string; image: string; href: string };

export type StudioContent = {
  breadcrumbCurrent: string;
  headingBefore: string;
  headingAccent: string;
  headingAfter: string;
  heroImage: string;
  portrait: string;
  portraitIsVideo: boolean;
  quote: string;
  quoteName: string;
  quoteRole: string;
  chips: StudioChip[];
  projectsBefore: string;
  projectsAccent: string;
  projects: StudioProject[];
  fitBefore: string;
  fitAccent: string;
  fitAfter: string;
  fitCards: string[];
  missBefore: string;
  missAccent: string;
  missAfter: string;
  missCards: string[];
  teamBefore: string;
  teamAccent: string;
  people: StudioPerson[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: StudioContent = {
  breadcrumbCurrent: studioHero.breadcrumb,
  headingBefore: studioHero.before,
  headingAccent: studioHero.accent,
  headingAfter: studioHero.after,
  heroImage: studioHero.image,
  portrait: studioTestimonial.image,
  portraitIsVideo: false,
  quote: studioTestimonial.quote,
  quoteName: studioTestimonial.name,
  quoteRole: studioTestimonial.role,
  chips: studioTestimonial.chips.map((chip) => ({ ...chip })),
  projectsBefore: studioProjectsHeading.before,
  projectsAccent: studioProjectsHeading.accent,
  projects: studioProjects.map((project) => ({ ...project })),
  fitBefore: studioFit.before,
  fitAccent: studioFit.accent,
  fitAfter: studioFit.after,
  fitCards: [...studioFit.cards],
  missBefore: studioMiss.before,
  missAccent: studioMiss.accent,
  missAfter: studioMiss.after,
  missCards: [...studioMiss.cards],
  teamBefore: studioTeam.before,
  teamAccent: studioTeam.accent,
  people: studioTeam.people.map((person) => ({ ...person, href: "" })),
};

export const getStudioPage = cache(async (): Promise<StudioContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "studio-page" as "site-footer",
      depth: 2,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      headingBefore?: string | null;
      headingAccent?: string | null;
      headingAfter?: string | null;
      heroImage?: unknown;
      portrait?: unknown;
      quote?: string | null;
      quoteName?: string | null;
      quoteRole?: string | null;
      chips?: Array<{ label?: string | null; value?: string | null } | null> | null;
      projectsBefore?: string | null;
      projectsAccent?: string | null;
      projects?: Array<{
        client?: {
          id?: string | number;
          slug?: string;
          name?: string;
          projectType?: "hub" | "direct" | null;
          featuredStudy?: { slug?: string; title?: string } | string | number | null;
          hero?: { image?: unknown; heading?: string; description?: string };
        } | string | number | null;
        image?: unknown;
        name?: string | null;
        body?: string | null;
        href?: string | null;
      } | null> | null;
      fitBefore?: string | null;
      fitAccent?: string | null;
      fitAfter?: string | null;
      fitCards?: Array<{ caption?: string | null } | null> | null;
      missBefore?: string | null;
      missAccent?: string | null;
      missAfter?: string | null;
      missCards?: Array<{ caption?: string | null } | null> | null;
      teamBefore?: string | null;
      teamAccent?: string | null;
      people?: Array<{
        member?: { name?: string; slug?: string; photoOne?: unknown } | string | null;
        image?: unknown;
        name?: string | null;
        href?: string | null;
      } | null> | null;
    };

    const chips = (doc.chips || [])
      .map((row) => {
        const label = row?.label?.trim() || "";
        if (!label) return null;
        return { label, value: row?.value?.trim() || "" };
      })
      .filter((row): row is StudioChip => Boolean(row));

    const projects = (
      await Promise.all(
        (doc.projects || []).map(async (row, index) => {
          let linkedClient =
            row?.client && typeof row.client === "object" ? row.client : null;

          if (!linkedClient && row?.client) {
            const clientId =
              typeof row.client === "object" && "id" in row.client
                ? (row.client as { id?: unknown }).id
                : row.client;
            if (typeof clientId === "number" || (typeof clientId === "string" && /^\d+$/.test(clientId))) {
              try {
                const clientDoc = await payload.findByID({
                  collection: "clients",
                  id: Number(clientId),
                  depth: 2,
                });
                if (clientDoc) linkedClient = clientDoc as unknown as typeof linkedClient;
              } catch {}
            }
          }

          const designed = fallback.projects[index];
          const name = row?.name?.trim() || linkedClient?.name?.trim() || designed?.name || "";
          if (!name) return null;

          const image = storedImage(
            row?.image || linkedClient?.hero?.image,
            designed?.image || studioProjects[0].image,
          );

          const body =
            row?.body?.trim() ||
            (linkedClient?.hero as { description?: string })?.description?.trim() ||
            designed?.body ||
            "";

          let href = "";
          if (linkedClient) {
            href =
              resolvedClientHref(linkedClient) ||
              (linkedClient.slug ? `/clients/${linkedClient.slug}` : "");
          }
          if (!href && row?.href?.trim()) {
            href = row.href.trim();
          }
          if (!href && designed?.href) {
            href = designed.href;
          }

          return {
            id: `studio-project-${index}`,
            name,
            body,
            image,
            href,
          };
        }),
      )
    ).filter((row): row is StudioProject => Boolean(row));

    const captions = (rows: Array<{ caption?: string | null } | null> | null | undefined, designed: string[]) => {
      const next = (rows || [])
        .map((row) => row?.caption?.trim() || "")
        .filter(Boolean);
      return next.length ? next : designed;
    };

    const people = (doc.people || [])
      .map((row, index) => {
        const linked =
          row?.member && typeof row.member === "object" ? row.member : null;
        const name = row?.name?.trim() || linked?.name?.trim() || "";
        if (!name) return null;
        const designed = fallback.people[index];
        const customHref = row?.href?.trim();
        const memberSlug = linked?.slug ? linked.slug.replace(/^\/+|\/+$/g, "").trim() : "";
        const href =
          customHref ||
          (memberSlug ? `/team/${memberSlug}` : designed?.href || "");
        const image = storedImage(
          row?.image || linked?.photoOne,
          designed?.image || studioTeam.people[0].image,
        );

        return {
          name,
          image,
          href,
        };
      })
      .filter((row): row is StudioPerson => Boolean(row));

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      headingBefore: text(doc.headingBefore, fallback.headingBefore),
      headingAccent: text(doc.headingAccent, fallback.headingAccent),
      headingAfter: text(doc.headingAfter, fallback.headingAfter),
      heroImage: storedImage(doc.heroImage, fallback.heroImage),
      ...(() => {
        const portrait = storedImage(doc.portrait, fallback.portrait);
        return {
          portrait,
          portraitIsVideo:
            portrait !== fallback.portrait && (isVideoMedia(doc.portrait) || isVideoSrc(portrait)),
        };
      })(),
      quote: text(doc.quote, fallback.quote),
      quoteName: text(doc.quoteName, fallback.quoteName),
      quoteRole: text(doc.quoteRole, fallback.quoteRole),
      chips: chips.length ? chips : fallback.chips,
      projectsBefore: text(doc.projectsBefore, fallback.projectsBefore),
      projectsAccent: text(doc.projectsAccent, fallback.projectsAccent),
      projects: projects.length ? projects : fallback.projects,
      fitBefore: text(doc.fitBefore, fallback.fitBefore),
      fitAccent: text(doc.fitAccent, fallback.fitAccent),
      fitAfter: text(doc.fitAfter, fallback.fitAfter),
      fitCards: captions(doc.fitCards, fallback.fitCards),
      missBefore: text(doc.missBefore, fallback.missBefore),
      missAccent: text(doc.missAccent, fallback.missAccent),
      missAfter: text(doc.missAfter, fallback.missAfter),
      missCards: captions(doc.missCards, fallback.missCards),
      teamBefore: text(doc.teamBefore, fallback.teamBefore),
      teamAccent: text(doc.teamAccent, fallback.teamAccent),
      people: people.length ? people : fallback.people,
    };
  } catch (error) {
    console.warn("[cms] studio page fallback", error);
    return fallback;
  }
});
