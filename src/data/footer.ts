// Shared footer link-column content + AI link labels, used by both the
// full Homepage/Client-Hub footer (`Footer`) and the Case Study footer
// (`CaseStudyFooter`), which reuses the same column copy minus "Sales"
// (folded into the Case Study's top contact block instead) and without a
// dedicated "Follow Us" column (social icons move into that same block).
export interface FooterColumn {
  title: string;
  links: string[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Sales",
    links: ["+91 9767085896", "+91 9158315015"],
  },
  {
    title: "Work",
    links: [
      "B2B Website Design",
      "Website Projects",
      "3D & Motion",
      "Thinking",
      "Website Audit",
      "Print Studio",
      "Studio Reviews",
    ],
  },
  {
    title: "Company",
    links: [
      "Studio",
      "Why Design Asylum",
      "Recent Updates",
      "Our Terms",
      "FAQs",
      "The No Brainer Offer",
    ],
  },
  {
    title: "Solutions",
    links: [
      "B2B Branding",
      "Brand Strategy",
      "Rebrand",
      "Naming",
      "Positioning",
      "Visual Identity",
    ],
  },
  {
    title: "Services",
    links: [
      "Website Design",
      "Webflow Build",
      "Film & Motion",
      "Print Design",
      "Campaigns",
      "Brand Systems",
    ],
  },
  {
    title: "Industries",
    links: [
      "Fintech",
      "Deeptech",
      "Enterprise SaaS",
      "Manufacturing",
      "Cybersecurity",
      "Healthcare",
    ],
  },
  {
    title: "Studio",
    links: ["Work", "Thinking", "Clients", "Team", "Reviews", "Contact"],
  },
];

export const AI_LINKS = ["ChatGPT", "Gemini", "Perplexity", "Claude"];
