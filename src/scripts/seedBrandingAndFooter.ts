import "dotenv/config";
import { getPayload } from "payload";
import config from "@payload-config";
import { FOOTER_COLUMNS } from "../data/footer";
import { marqueeRow1, marqueeRow2 } from "../data/clients";
import {
  articleSections,
  brandingExperts,
  brandingExpertsHeading,
  brandingProjects,
  breadcrumbCurrent,
  clientBrandingTabs,
  introduction,
  relatedBlogs,
  relatedBlogsHeading,
  serviceFaqItems,
} from "../data/brandingAgencyPage";

const footerFields = {
  Work: "work",
  Company: "company",
  Solutions: "solutions",
  Services: "services",
  Industries: "industries",
  Studio: "studio",
} as const;

async function seedPageCms() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "site-footer",
    data: Object.fromEntries(
      Object.entries(footerFields).map(([title, field]) => {
        const column = FOOTER_COLUMNS.find((item) => item.title === title);
        return [
          field,
          (column?.links ?? []).map((link) => ({
            label: link.label,
            href: link.href === "#" ? undefined : link.href,
          })),
        ];
      }),
    ),
  });

  await payload.updateGlobal({
    slug: "branding-strategy",
    data: {
      breadcrumbCurrent,
      heroTitle: "Branding agency in Pune",
      heroIntro:
        "A branding agency should answer one question first: what do you want a buyer, an investor, or a hire to believe about you before they meet you. Most agencies skip the question and go straight to logo exploration. Design Asylum starts where every B2B brand actually has to start — with diagnosis, positioning, and the words on the page — and only then builds the identity.",
      lead: introduction,
      sections: articleSections.map((section) => ({
        anchor: section.id,
        tocLabel: section.tocLabel,
        headingBefore: section.before,
        headingAccent: section.accent,
        headingAfter: section.after,
        paragraphs: section.paragraphs.map((text) => ({ text })),
        pointers: (section.pointers ?? []).map((item) => ({
          term: item.term,
          text: item.text,
        })),
        closing: (section.closing ?? []).map((text) => ({ text })),
        highlightTitle: section.highlight?.title,
        highlightBody: section.highlight?.body,
      })),
      logos: [...marqueeRow1, ...marqueeRow2].map((logo, index) => ({
        name: logo.name,
        width: logo.width,
        height: logo.height,
        row: (index < marqueeRow1.length ? "1" : "2") as "1" | "2",
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
        href: project.href,
      })),
      faqs: serviceFaqItems.map((item) => ({
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
  });

  payload.logger.info("Branding strategy page and footer lists seeded.");
  process.exit(0);
}

seedPageCms().catch((error) => {
  console.error(error);
  process.exit(1);
});
