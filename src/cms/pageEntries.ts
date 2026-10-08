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
import { blogCategories, blogPosts, featuredPosts, type BlogPost } from "../data/blogIndexPage";
import { marqueeRow1, marqueeRow2 } from "../data/clients";
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
  manufacturingBreadcrumbCurrent,
  manufacturingFaqItems,
  manufacturingHero,
  manufacturingLead,
  manufacturingPreface,
  manufacturingSections,
} from "../data/manufacturingIndustryPage";
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
import {
  teamPerson,
  teamPersonBlogs,
  teamPersonClients,
  teamPersonIndustries,
  teamPersonProjects,
  teamPersonServices,
  teamPersonSolutions,
} from "../data/teamPersonPage";
import { workFilters, workProjects } from "../data/workPage";
import {
  careersForm,
  lifeOutside,
  openRoles,
  teamWords,
  whyBenefits,
  whyHero,
} from "../data/whyDesignAsylumPage";
import {
  sevenloopFaqItems,
  sevenloopLead,
  sevenloopSections,
  sevenloopTopics,
  type ArticleBlock,
} from "../data/sevenloopArticle";

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

function seedBlock(block: ArticleBlock) {
  switch (block.kind) {
    case "paragraphs":
      return { blockType: "paragraphs", items: block.items.map((text) => ({ text })) };
    case "rich":
      return {
        blockType: "rich",
        parts: block.parts.map((part) =>
          typeof part === "string"
            ? { text: part, strong: false }
            : { text: part.strong, strong: true },
        ),
      };
    case "subhead":
      return { blockType: "subhead", title: block.title, body: block.body ?? "" };
    case "arrows":
      return {
        blockType: "arrows",
        items: block.items.map((item) => ({ lead: item.lead ?? "", rest: item.rest })),
      };
    case "rows":
      return { blockType: "rows", items: block.items };
    case "image":
      return { blockType: "image", src: block.src, alt: block.alt };
    case "gallery":
      return {
        blockType: "gallery",
        alt: block.alt,
        images: block.srcs.map((src) => ({ src })),
      };
    case "quote":
      return { blockType: "quote", quote: block.quote, name: block.name, role: block.role };
    case "note":
      return { blockType: "note", kicker: block.kicker, body: block.body };
    case "links":
      return { blockType: "links", kicker: block.kicker, items: block.items };
  }
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
          row: index < marqueeRow1.length ? "1" : "2",
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
    },
    {
      slug: "manufacturing-industry",
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
      slug: "blog-article",
      data: {
        breadcrumbCurrent: "Sevenloop Brand Website Redesign",
        titleBefore: "Sevenloop ",
        titleAccent: "Rebrand",
        titleMiddle: " & Webflow Site: ",
        titleLine: "A 5-Month Case Study",
        intro:
          "How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.",
        bylineName: "Tanmaya Rao",
        bylineDate: "Sept 28, 2026",
        lead: sevenloopLead,
        sections: sevenloopSections.map((section) => ({
          anchor: section.id,
          tocLabel: section.label,
          headingBefore: section.before ?? "",
          headingAccent: section.accent ?? "",
          headingAfter: section.after ?? "",
          blocks: section.blocks.map(seedBlock),
        })),
        faqs: sevenloopFaqItems.map((item) => ({
          question: item.question,
          ...(item.answer ? { answer: item.answer } : {}),
        })),
        authorName: "Athira Krishnan",
        authorRole: "Lead Designer | Content Strategist",
        authorBio:
          "Articulate with a clear thought process, she excels in content writing, driving design in B2B SaaS and B2C websites.",
        topicsBefore: "Solutions ",
        topicsAccent: "we ",
        topicsAfter: "offer",
        topics: sevenloopTopics.map((label) => ({ label })),
        relatedBefore: relatedBlogsHeading.before,
        relatedAccent: relatedBlogsHeading.accent,
        relatedBlogs: relatedBlogs.map((post) => ({
          date: post.date,
          readTime: post.readTime,
          title: post.title,
          href: post.href,
        })),
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
      slug: "team-person",
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
    },
  ];
}
