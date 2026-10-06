import { getPayload } from "payload";
import config from "@payload-config";
import {
  teamPerson,
  teamPersonBlogs,
  teamPersonClients,
  teamPersonIndustries,
  teamPersonProjects,
  teamPersonServices,
  teamPersonSolutions,
} from "../data/teamPersonPage";

async function seedTeamPerson() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "team-person" as "site-footer",
    data: {
      breadcrumbCurrent: teamPerson.breadcrumbCurrent,
      name: teamPerson.name,
      role: teamPerson.role,
      paragraphs: teamPerson.paragraphs.map((text) => ({ text })),
      servicesBefore: teamPersonServices.before,
      servicesAccent: teamPersonServices.accent,
      services: teamPersonServices.chips.map((label) => ({ label })),
      clientsBefore: teamPersonClients.before,
      clientsAccent: teamPersonClients.accent,
      clientsAfter: teamPersonClients.after,
      projectsBefore: teamPersonProjects.before,
      projectsAccent: teamPersonProjects.accent,
      projects: teamPersonProjects.items.map((item) => ({
        name: item.name,
        body: item.body,
      })),
      blogsBefore: teamPersonBlogs.before,
      blogsAccent: teamPersonBlogs.accent,
      posts: teamPersonBlogs.posts.map((title) => ({ title })),
      solutionsAccent: teamPersonSolutions.accent,
      solutionsAfter: teamPersonSolutions.after,
      solutions: teamPersonSolutions.chips.map((label) => ({ label })),
      industriesAccent: teamPersonIndustries.accent,
      industriesAfter: teamPersonIndustries.after,
      industries: teamPersonIndustries.chips.map((label) => ({ label })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info(
    "Team person CMS prefilled. Photos, icons, logos, and URLs were left empty.",
  );
  process.exit(0);
}

seedTeamPerson().catch((error) => {
  console.error(error);
  process.exit(1);
});
