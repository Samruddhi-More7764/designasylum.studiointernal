import { getPayload } from "payload";
import config from "@payload-config";
import { brandingProjects, relatedBlogs } from "../data/brandingAgencyPage";
import {
  ahmedabadBreadcrumbCurrent,
  ahmedabadCallout,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
} from "../data/ahmedabadLocationPage";

async function seedAhmedabad() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "ahmedabad-location" as "site-footer",
    data: {
      breadcrumbCurrent: ahmedabadBreadcrumbCurrent,
      heroTitle: ahmedabadHero.title,
      heroIntro: ahmedabadHero.intro,
      clientsBefore: "Design projects for ",
      clientsAccent: "Ahmedabad",
      clientsAfter: " brands",
      clientTabs: ahmedabadProjectTabs.map((tab) => ({
        tabId: tab.id,
        label: tab.label,
      })),
      projects: brandingProjects.map((project) => ({
        name: project.name,
        description: project.description,
      })),
      calloutBefore: ahmedabadCallout.before,
      calloutAccent: ahmedabadCallout.accent,
      calloutAfter: ahmedabadCallout.after,
      calloutBody: ahmedabadCallout.body,
      lead: ahmedabadLead,
      sections: ahmedabadSections.map((section) => ({
        anchor: section.id,
        tocLabel: section.tocLabel,
        headingBefore: section.before,
        headingAccent: section.accent,
        headingAfter: section.after,
        paragraphs: section.paragraphs.map((text) => ({ text })),
        blocks: (section.blocks ?? []).map((block) => ({
          title: block.title,
          paragraphs: block.paragraphs.map((text) => ({ text })),
        })),
        pointers: (section.pointers ?? []).map((pointer) => ({ text: pointer.text })),
      })),
      faqs: ahmedabadFaqItems.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
      relatedBefore: "",
      relatedAccent: "Related ",
      relatedAfter: "blogs",
      relatedBlogs: relatedBlogs.map((post) => ({
        date: post.date,
        readTime: post.readTime,
        title: post.title,
        href: post.href,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info(
    "Ahmedabad page CMS prefilled. Project URLs were left empty. Logos were left empty.",
  );
  process.exit(0);
}

seedAhmedabad().catch((error) => {
  console.error(error);
  process.exit(1);
});
