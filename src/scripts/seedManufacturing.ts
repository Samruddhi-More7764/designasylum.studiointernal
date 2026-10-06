import { getPayload } from "payload";
import config from "@payload-config";
import {
  brandingExperts,
  brandingExpertsHeading,
  brandingProjects,
  clientBrandingTabs,
  relatedBlogs,
  relatedBlogsHeading,
} from "../data/brandingAgencyPage";
import {
  manufacturingBreadcrumbCurrent,
  manufacturingFaqItems,
  manufacturingHero,
  manufacturingLead,
  manufacturingPreface,
  manufacturingSections,
} from "../data/manufacturingIndustryPage";

async function seedManufacturing() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "manufacturing-industry" as "site-footer",
    data: {
      breadcrumbCurrent: manufacturingBreadcrumbCurrent,
      heroTitle: manufacturingHero.title,
      heroIntro: manufacturingHero.intro,
      lead: manufacturingLead,
      preface: manufacturingPreface.map((text) => ({ text })),
      sections: manufacturingSections.map((section) => ({
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
        highlightTitle: section.highlight?.title,
        highlightBody: section.highlight?.body,
      })),
      clientsBefore: "Clients we did ",
      clientsAccent: "branding",
      clientsAfter: " for",
      clientTabs: clientBrandingTabs.map((tab) => ({
        tabId: tab.id,
        label: tab.label,
      })),
      projects: brandingProjects.map((project) => ({
        name: project.name,
        description: project.description,
      })),
      faqs: manufacturingFaqItems.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
      expertsBefore: brandingExpertsHeading.before,
      expertsAccent: brandingExpertsHeading.accent,
      expertsSubheading: brandingExpertsHeading.subheading,
      experts: brandingExperts.map((member) => ({
        name: member.name,
        role: member.role,
      })),
      relatedBefore: relatedBlogsHeading.before,
      relatedAccent: relatedBlogsHeading.accent,
      relatedBlogs: relatedBlogs.map((post) => ({
        date: post.date,
        readTime: post.readTime,
        title: post.title,
        href: post.href,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Manufacturing page CMS prefilled. Project URLs were left empty.");
  process.exit(0);
}

seedManufacturing().catch((error) => {
  console.error(error);
  process.exit(1);
});
