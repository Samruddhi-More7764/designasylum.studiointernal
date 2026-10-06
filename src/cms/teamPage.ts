import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import {
  teamGroup,
  teamHeading,
  teamIntro,
  teamLeadership,
  teamPortrait,
} from "@/data/teamPage";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  href: string;
};

export type TeamPageContent = {
  breadcrumbCurrent: string;
  heading: string;
  intro: string;
  leadershipHeading: string;
  leadership: TeamMember[];
  teamAccent: string;
  teamAfter: string;
  members: TeamMember[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: TeamPageContent = {
  breadcrumbCurrent: "Team",
  heading: teamHeading,
  intro: teamIntro,
  leadershipHeading: teamLeadership.heading,
  leadership: teamLeadership.members.map((member, index) => ({
    id: `leadership-${index}`,
    ...member,
  })),
  teamAccent: teamGroup.accent,
  teamAfter: teamGroup.after,
  members: teamGroup.members.map((member, index) => ({
    id: `member-${index}`,
    ...member,
  })),
};

type MemberRow = {
  image?: unknown;
  name?: string | null;
  role?: string | null;
  href?: string | null;
} | null;

function members(
  rows: MemberRow[] | null | undefined,
  designed: TeamMember[],
  prefix: string,
): TeamMember[] {
  const next = (rows || [])
    .map((row, index) => {
      const name = row?.name?.trim() || "";
      if (!name) return null;
      const designedMember = designed[index];
      return {
        id: `${prefix}-${index}`,
        name,
        role: row?.role?.trim() || designedMember?.role || "",
        image: storedImage(row?.image, designedMember?.image || teamPortrait),
        href: row?.href?.trim() || designedMember?.href || "#",
      };
    })
    .filter((row): row is TeamMember => Boolean(row));

  return next.length ? next : designed;
}

export const getTeamPage = cache(async (): Promise<TeamPageContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "team-page" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      heading?: string | null;
      intro?: string | null;
      leadershipHeading?: string | null;
      leadership?: MemberRow[] | null;
      teamAccent?: string | null;
      teamAfter?: string | null;
      members?: MemberRow[] | null;
    };

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      heading: text(doc.heading, fallback.heading),
      intro: text(doc.intro, fallback.intro),
      leadershipHeading: text(doc.leadershipHeading, fallback.leadershipHeading),
      leadership: members(doc.leadership, fallback.leadership, "leadership"),
      teamAccent: text(doc.teamAccent, fallback.teamAccent),
      teamAfter: text(doc.teamAfter, fallback.teamAfter),
      members: members(doc.members, fallback.members, "member"),
    };
  } catch (error) {
    console.warn("[cms] team page fallback", error);
    return fallback;
  }
});
