import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { isVideoMedia, isVideoSrc } from "@/cms/media";
import { storedImage } from "@/cms/storedImage";
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
export type StudioPerson = { name: string; image: string };

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
  people: studioTeam.people.map((person) => ({ ...person })),
};

export const getStudioPage = cache(async (): Promise<StudioContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "studio-page" as "site-footer",
      depth: 1,
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
      projects?: Array<{ image?: unknown; name?: string | null; body?: string | null; href?: string | null } | null> | null;
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
      people?: Array<{ image?: unknown; name?: string | null } | null> | null;
    };

    const chips = (doc.chips || [])
      .map((row) => {
        const label = row?.label?.trim() || "";
        if (!label) return null;
        return { label, value: row?.value?.trim() || "" };
      })
      .filter((row): row is StudioChip => Boolean(row));

    const projects = (doc.projects || [])
      .map((row, index) => {
        const name = row?.name?.trim() || "";
        if (!name) return null;
        const designed = fallback.projects[index];
        return {
          id: `studio-project-${index}`,
          name,
          body: row?.body?.trim() || designed?.body || "",
          image: storedImage(row?.image, designed?.image || studioProjects[0].image),
          href: row?.href?.trim() || "",
        };
      })
      .filter((row): row is StudioProject => Boolean(row));

    const captions = (rows: Array<{ caption?: string | null } | null> | null | undefined, designed: string[]) => {
      const next = (rows || [])
        .map((row) => row?.caption?.trim() || "")
        .filter(Boolean);
      return next.length ? next : designed;
    };

    const people = (doc.people || [])
      .map((row, index) => {
        const name = row?.name?.trim() || "";
        if (!name) return null;
        const designed = fallback.people[index];
        return {
          name,
          image: storedImage(row?.image, designed?.image || studioTeam.people[0].image),
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
