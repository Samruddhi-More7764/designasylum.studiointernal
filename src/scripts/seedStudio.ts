import { getPayload } from "payload";
import config from "@payload-config";
import {
  studioFit,
  studioHero,
  studioMiss,
  studioProjects,
  studioProjectsHeading,
  studioTeam,
  studioTestimonial,
} from "../data/studioPage";

async function seedStudio() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "studio-page" as "site-footer",
    data: {
      breadcrumbCurrent: studioHero.breadcrumb,
      headingBefore: studioHero.before,
      headingAccent: studioHero.accent,
      headingAfter: studioHero.after,
      quote: studioTestimonial.quote,
      quoteName: studioTestimonial.name,
      quoteRole: studioTestimonial.role,
      chips: studioTestimonial.chips,
      projectsBefore: studioProjectsHeading.before,
      projectsAccent: studioProjectsHeading.accent,
      projects: studioProjects.map((project) => ({
        name: project.name,
        body: project.body,
      })),
      fitBefore: studioFit.before,
      fitAccent: studioFit.accent,
      fitAfter: studioFit.after,
      fitCards: studioFit.cards.map((caption) => ({ caption })),
      missBefore: studioMiss.before,
      missAccent: studioMiss.accent,
      missAfter: studioMiss.after,
      missCards: studioMiss.cards.map((caption) => ({ caption })),
      teamBefore: studioTeam.before,
      teamAccent: studioTeam.accent,
      people: studioTeam.people.map((person) => ({ name: person.name })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Studio page CMS prefilled. Photos, the video URL, and project URLs were left empty.");
  process.exit(0);
}

seedStudio().catch((error) => {
  console.error(error);
  process.exit(1);
});
