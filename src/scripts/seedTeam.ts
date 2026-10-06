import { getPayload } from "payload";
import config from "@payload-config";
import { teamGroup, teamHeading, teamIntro, teamLeadership } from "../data/teamPage";

async function seedTeam() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "team-page" as "site-footer",
    data: {
      breadcrumbCurrent: "Team",
      heading: teamHeading,
      intro: teamIntro,
      leadershipHeading: teamLeadership.heading,
      leadership: teamLeadership.members.map((member) => ({
        name: member.name,
        role: member.role,
      })),
      teamAccent: teamGroup.accent,
      teamAfter: teamGroup.after,
      members: teamGroup.members.map((member) => ({
        name: member.name,
        role: member.role,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Team page CMS prefilled. Photos and Read more URLs were left empty.");
  process.exit(0);
}

seedTeam().catch((error) => {
  console.error(error);
  process.exit(1);
});
