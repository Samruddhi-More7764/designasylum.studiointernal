import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import {
  teamPerson,
  teamPersonBlogs,
  teamPersonClients,
  teamPersonIndustries,
  teamPersonPortrait,
  teamPersonProjects,
  teamPersonServices,
  teamPersonSolutions,
} from "@/data/teamPersonPage";

export type PersonChip = { id: string; label: string; icon: string | null };
export type PersonProject = { id: string; name: string; body: string; image: string; href: string };
export type PersonPost = { id: string; title: string; href: string };

export type TeamPersonContent = {
  breadcrumbCurrent: string;
  name: string;
  role: string;
  photos: Array<string | null>;
  paragraphs: string[];
  servicesBefore: string;
  servicesAccent: string;
  servicesAfter: string;
  services: PersonChip[];
  clientsBefore: string;
  clientsAccent: string;
  clientsAfter: string;
  logos: string[];
  projectsBefore: string;
  projectsAccent: string;
  projectsAfter: string;
  projects: PersonProject[];
  blogsBefore: string;
  blogsAccent: string;
  blogsAfter: string;
  posts: PersonPost[];
  solutionsBefore: string;
  solutionsAccent: string;
  solutionsAfter: string;
  solutions: PersonChip[];
  industriesBefore: string;
  industriesAccent: string;
  industriesAfter: string;
  industries: PersonChip[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function optionalImage(upload: unknown): string | null {
  const src = storedImage(upload, "");
  return src || null;
}

const fallback: TeamPersonContent = {
  breadcrumbCurrent: teamPerson.breadcrumbCurrent,
  name: teamPerson.name,
  role: teamPerson.role,
  photos: [null, null, null],
  paragraphs: [...teamPerson.paragraphs],
  servicesBefore: teamPersonServices.before,
  servicesAccent: teamPersonServices.accent,
  servicesAfter: teamPersonServices.after,
  services: teamPersonServices.chips.map((label, index) => ({
    id: `service-${index}`,
    label,
    icon: null,
  })),
  clientsBefore: teamPersonClients.before,
  clientsAccent: teamPersonClients.accent,
  clientsAfter: teamPersonClients.after,
  logos: [...teamPersonClients.logos],
  projectsBefore: teamPersonProjects.before,
  projectsAccent: teamPersonProjects.accent,
  projectsAfter: teamPersonProjects.after,
  projects: teamPersonProjects.items.map((item, index) => ({
    id: `project-${index}`,
    ...item,
  })),
  blogsBefore: teamPersonBlogs.before,
  blogsAccent: teamPersonBlogs.accent,
  blogsAfter: teamPersonBlogs.after,
  posts: teamPersonBlogs.posts.map((title, index) => ({
    id: `post-${index}`,
    title,
    href: "#",
  })),
  solutionsBefore: teamPersonSolutions.before,
  solutionsAccent: teamPersonSolutions.accent,
  solutionsAfter: teamPersonSolutions.after,
  solutions: teamPersonSolutions.chips.map((label, index) => ({
    id: `solution-${index}`,
    label,
    icon: null,
  })),
  industriesBefore: teamPersonIndustries.before,
  industriesAccent: teamPersonIndustries.accent,
  industriesAfter: teamPersonIndustries.after,
  industries: teamPersonIndustries.chips.map((label, index) => ({
    id: `industry-${index}`,
    label,
    icon: null,
  })),
};

function chips(
  rows: Array<{ icon?: unknown; label?: string | null } | null> | null | undefined,
  designed: PersonChip[],
  prefix: string,
): PersonChip[] {
  const next = (rows || [])
    .map((row, index) => {
      const label = row?.label?.trim() || "";
      if (!label) return null;
      return {
        id: `${prefix}-${index}`,
        label,
        icon: optionalImage(row?.icon),
      };
    })
    .filter((row): row is PersonChip => Boolean(row));
  return next.length ? next : designed;
}

export const getTeamPerson = cache(async (): Promise<TeamPersonContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "team-person" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      name?: string | null;
      role?: string | null;
      photoOne?: unknown;
      photoTwo?: unknown;
      photoThree?: unknown;
      paragraphs?: Array<{ text?: string | null } | null> | null;
      servicesBefore?: string | null;
      servicesAccent?: string | null;
      servicesAfter?: string | null;
      services?: Array<{ icon?: unknown; label?: string | null } | null> | null;
      clientsBefore?: string | null;
      clientsAccent?: string | null;
      clientsAfter?: string | null;
      logos?: Array<{ image?: unknown } | null> | null;
      projectsBefore?: string | null;
      projectsAccent?: string | null;
      projectsAfter?: string | null;
      projects?: Array<{
        image?: unknown;
        name?: string | null;
        body?: string | null;
        href?: string | null;
      } | null> | null;
      blogsBefore?: string | null;
      blogsAccent?: string | null;
      blogsAfter?: string | null;
      posts?: Array<{ title?: string | null; href?: string | null } | null> | null;
      solutionsBefore?: string | null;
      solutionsAccent?: string | null;
      solutionsAfter?: string | null;
      solutions?: Array<{ icon?: unknown; label?: string | null } | null> | null;
      industriesBefore?: string | null;
      industriesAccent?: string | null;
      industriesAfter?: string | null;
      industries?: Array<{ icon?: unknown; label?: string | null } | null> | null;
    };

    const paragraphs = (doc.paragraphs || [])
      .map((row) => row?.text?.trim() || "")
      .filter(Boolean);
    const logos = (doc.logos || [])
      .map((row) => optionalImage(row?.image))
      .filter((src): src is string => Boolean(src));
    const projects = (doc.projects || [])
      .map((row, index) => {
        const name = row?.name?.trim() || "";
        if (!name) return null;
        const designed = fallback.projects[index];
        return {
          id: `project-${index}`,
          name,
          body: row?.body?.trim() || designed?.body || "",
          image: storedImage(row?.image, designed?.image || teamPersonPortrait),
          href: row?.href?.trim() || "#",
        };
      })
      .filter((row): row is PersonProject => Boolean(row));
    const posts = (doc.posts || [])
      .map((row, index) => {
        const title = row?.title?.trim() || "";
        if (!title) return null;
        return { id: `post-${index}`, title, href: row?.href?.trim() || "#" };
      })
      .filter((row): row is PersonPost => Boolean(row));

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      name: text(doc.name, fallback.name),
      role: text(doc.role, fallback.role),
      photos: [optionalImage(doc.photoOne), optionalImage(doc.photoTwo), optionalImage(doc.photoThree)],
      paragraphs: paragraphs.length ? paragraphs : fallback.paragraphs,
      servicesBefore: text(doc.servicesBefore, fallback.servicesBefore),
      servicesAccent: text(doc.servicesAccent, fallback.servicesAccent),
      servicesAfter: text(doc.servicesAfter, fallback.servicesAfter),
      services: chips(doc.services, fallback.services, "service"),
      clientsBefore: text(doc.clientsBefore, fallback.clientsBefore),
      clientsAccent: text(doc.clientsAccent, fallback.clientsAccent),
      clientsAfter: text(doc.clientsAfter, fallback.clientsAfter),
      logos: logos.length ? logos : fallback.logos,
      projectsBefore: text(doc.projectsBefore, fallback.projectsBefore),
      projectsAccent: text(doc.projectsAccent, fallback.projectsAccent),
      projectsAfter: text(doc.projectsAfter, fallback.projectsAfter),
      projects: projects.length ? projects : fallback.projects,
      blogsBefore: text(doc.blogsBefore, fallback.blogsBefore),
      blogsAccent: text(doc.blogsAccent, fallback.blogsAccent),
      blogsAfter: text(doc.blogsAfter, fallback.blogsAfter),
      posts: posts.length ? posts : fallback.posts,
      solutionsBefore: text(doc.solutionsBefore, fallback.solutionsBefore),
      solutionsAccent: text(doc.solutionsAccent, fallback.solutionsAccent),
      solutionsAfter: text(doc.solutionsAfter, fallback.solutionsAfter),
      solutions: chips(doc.solutions, fallback.solutions, "solution"),
      industriesBefore: text(doc.industriesBefore, fallback.industriesBefore),
      industriesAccent: text(doc.industriesAccent, fallback.industriesAccent),
      industriesAfter: text(doc.industriesAfter, fallback.industriesAfter),
      industries: chips(doc.industries, fallback.industries, "industry"),
    };
  } catch (error) {
    console.warn("[cms] team person fallback", error);
    return fallback;
  }
});
