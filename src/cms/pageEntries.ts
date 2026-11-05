import {
  brandingProjects,
  relatedBlogs,
} from "../data/brandingAgencyPage";
import { blogCategories, blogPosts, featuredPosts, type BlogPost } from "../data/blogIndexPage";
import { faqCategories, faqEntries } from "../data/faqPage";
import { faqDetails } from "../data/faqDetailPage";
import { FOOTER_COLUMNS } from "../data/footer";
import { clientCards, clientsHeading } from "../data/clientsIndexPage";
import {
  ahmedabadBreadcrumbCurrent,
  ahmedabadCallout,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
} from "../data/ahmedabadLocationPage";
import {
  studioFit,
  studioHero,
  studioMiss,
  studioProjects,
  studioProjectsHeading,
  studioTeam,
  studioTestimonial,
} from "../data/studioPage";
import { teamGroup, teamHeading, teamIntro, teamLeadership } from "../data/teamPage";
import { jobCategories, jobDetailHeadings, jobRoles, openRolesHeading } from "../data/openRolesPage";
import { workFilters, workProjects } from "../data/workPage";
import {
  careersForm,
  lifeOutside,
  openRoles,
  teamWords,
  whyBenefits,
  whyHero,
} from "../data/whyDesignAsylumPage";

export type PageEntry = {
  slug: string;
  data: Record<string, unknown>;
};

const footerFields = {
  Work: "work",
  Company: "company",
  Solutions: "solutions",
  Services: "services",
  Industries: "industries",
  Studio: "studio",
} as const;

function seedPost(post: BlogPost) {
  return {
    title: post.title,
    date: post.date,
    category: post.category,
    href: post.href,
    ...(post.badge ? { badge: post.badge } : {}),
    ...(post.badgeIcon ? { badgeIcon: post.badgeIcon } : {}),
  };
}

/** Copy already shown on the public pages. Photos and some URLs stay empty. */
export function pageEntries(): PageEntry[] {
  const detail = faqDetails["defense-tech"];

  return [
    {
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
    },
    {
      slug: "ahmedabad-location",
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
    },
    {
      slug: "blog-index",
      data: {
        breadcrumbCurrent: "Blogs",
        titleBefore: "Things ",
        titleAccent: "worth",
        titleAfter: " thinking about.",
        intro:
          "Ideas, opinions, lessons and the occasional rabbit hole from the people behind Design Asylum.",
        featuredBefore: "What’s getting ",
        featuredAccent: "attention",
        featuredAfter: " around here",
        featuredPosts: featuredPosts.map(seedPost),
        listingBefore: "Looking for something ",
        listingAccent: "specific",
        listingAfter: "?",
        categories: blogCategories.map((label) => ({ label })),
        posts: blogPosts.map(seedPost),
      },
    },
    {
      slug: "faq-page",
      data: {
        titleBefore: "Frequently ",
        titleAccent: "Asked",
        titleAfter: " questions!",
        categories: faqCategories.map((category) => ({
          categoryId: category.id,
          label: category.label,
        })),
        entries: faqEntries.map((entry) => ({
          entryId: entry.id,
          question: entry.question,
          category: entry.category,
          ...(entry.answer ? { answer: entry.answer } : {}),
          ...(entry.detailSlug ? { detailSlug: entry.detailSlug } : {}),
        })),
      },
    },
    {
      slug: "faq-detail",
      data: {
        slug: detail.slug,
        breadcrumbCurrent: "Sevenloop Brand Website Redesign",
        question: detail.question,
        lead: detail.lead,
        sections: detail.sections.map((section) => ({
          anchor: section.id,
          title: section.title,
          body: section.body,
        })),
      },
    },
    {
      slug: "careers-page",
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
    },
    {
      slug: "open-roles-page",
      data: {
        titleBefore: openRolesHeading.before,
        titleAccent: openRolesHeading.accent,
        titleAfter: openRolesHeading.after,
        dutiesHeading: jobDetailHeadings.duties,
        lookingHeading: jobDetailHeadings.looking,
        categories: jobCategories.map((category) => ({
          categoryId: category.id,
          label: category.label,
        })),
        roles: jobRoles.map((role) => ({
          title: role.title,
          slug: role.slug,
          breadcrumb: role.breadcrumb,
          summary: role.summary,
          category: role.category,
          location: role.location,
          employment: role.employment,
          experience: role.experience,
          applyLabel: role.applyLabel,
          detailLocation: role.detailLocation,
          detailExperience: role.detailExperience,
          detailType: role.detailType,
          responsibilities: role.responsibilities.map((text) => ({ text })),
          requirements: role.requirements.map((text) => ({ text })),
          applyNowLabel: role.applyNowLabel,
          applyNowHref: role.applyNowHref,
        })),
      },
    },
    {
      slug: "work-page",
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
    },
    {
      slug: "clients-index",
      data: {
        breadcrumbCurrent: "Clients",
        heading: clientsHeading,
        cards: clientCards.map((card) => ({
          name: card.name,
          service: card.service,
        })),
      },
    },
    {
      slug: "studio-page",
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
    },
    {
      slug: "team-page",
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
    },
    {
      slug: "clients-grid",
      data: {
        heading: "8 in 10 clients come back for more.",
        subheading:
          "Once people work with us, they tend to keep working with us. The number we’re quietly proud of.",
        cards: [],
      },
    },
  ];
}
