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

  const existing = await payload.find({
    collection: "team-members",
    where: {
      slug: { equals: "tanmaya-rao" },
    },
    limit: 1,
  } as Parameters<typeof payload.find>[0]);

  const memberData = {
    name: teamPerson.name,
    slug: "tanmaya-rao",
    role: teamPerson.role,
    isLeadership: true,
    breadcrumbCurrent: teamPerson.breadcrumbCurrent,
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
  };

  if (existing.docs.length > 0 && existing.docs[0]) {
    await payload.update({
      collection: "team-members",
      id: existing.docs[0].id,
      data: memberData,
    } as Parameters<typeof payload.update>[0]);
  } else {
    await payload.create({
      collection: "team-members",
      data: memberData,
    } as Parameters<typeof payload.create>[0]);
  }

  payload.logger.info(
    "Team member (Tanmaya Rao) prefilled into team-members collection.",
  );
  process.exit(0);
}

seedTeamPerson().catch((error) => {
  console.error(error);
  process.exit(1);
});
