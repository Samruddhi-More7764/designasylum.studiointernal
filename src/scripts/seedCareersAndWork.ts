import { getPayload } from "payload";
import config from "@payload-config";
import { workFilters, workProjects } from "../data/workPage";
import {
  careersForm,
  lifeOutside,
  openRoles,
  teamWords,
  whyBenefits,
  whyHero,
} from "../data/whyDesignAsylumPage";

async function seedCareersAndWork() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "careers-page" as "site-footer",
    data: {
      breadcrumbCurrent: "Careers",
      titleBefore: whyHero.titleBefore,
      titleAccent: whyHero.titleAccent,
      titleAfter: whyHero.titleAfter,
      intro: whyHero.dek,
      benefitsBefore: whyBenefits.titleBefore,
      benefitsAccent: whyBenefits.titleAccent,
      benefitsAfter: whyBenefits.titleAfter,
      benefits: whyBenefits.items,
      lifeBefore: lifeOutside.titleBefore,
      lifeAccent: lifeOutside.titleAccent,
      lifeAfter: lifeOutside.titleAfter,
      lifeDek: lifeOutside.dek,
      teamBefore: teamWords.titleBefore,
      teamAccent: teamWords.titleAccent,
      teamAfter: teamWords.titleAfter,
      quotes: teamWords.quotes.map((person) => ({
        name: person.name,
        role: person.role,
        quote: person.quote,
        body: person.body,
      })),
      rolesBefore: openRoles.titleBefore,
      rolesAccent: openRoles.titleAccent,
      rolesAfter: openRoles.titleAfter,
      rolesBody: openRoles.body,
      rolesButton: openRoles.button,
      formBefore: careersForm.titleBefore,
      formAccent: careersForm.titleAccent,
      formAfter: careersForm.titleAfter,
      formDek: careersForm.dek,
      interests: careersForm.interests.map((label) => ({ label })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  await payload.updateGlobal({
    slug: "work-page" as "site-footer",
    data: {
      breadcrumbCurrent: "Work",
      heading: "Worked with companies from a diverse set of industries",
      filters: workFilters.map((filter) => ({
        filterId: filter.id,
        label: filter.label,
      })),
      projects: workProjects.map((project) => ({
        name: project.name,
        service: project.service,
        category: project.category,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Careers and Work CMS prefilled. Project URLs and photos were left empty.");
  process.exit(0);
}

seedCareersAndWork().catch((error) => {
  console.error(error);
  process.exit(1);
});
