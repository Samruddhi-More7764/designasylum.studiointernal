// Shared footer link-column content + AI link labels, used by both the
// full Homepage/Client-Hub footer (`Footer`) and the Case Study footer
// (`CaseStudyFooter`), which reuses the same column copy minus "Sales"
// (folded into the Case Study's top contact block instead) and without a
// dedicated "Follow Us" column (social icons move into that same block).
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_HREFS: Record<string, string> = {
  "Why Design Asylum": "/why-design-asylum",
  Work: "/work",
  Clients: "/clients",
  Team: "/team",
  Blogs: "/blogs",
  Careers: "/why-design-asylum",
  Contact: "/contact",
  FAQs: "/faq",
  Manufacturing: "/industries/manufacturing",
  "Brand Systems": "/blogs/branding-agency-in-pune",
};

export function footerLinkHref(label: string): string {
  return FOOTER_HREFS[label] ?? "#";
}

function footerLink(label: string): FooterLink {
  return { label, href: footerLinkHref(label) };
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Sales",
    links: ["+91 9767085896", "+91 9158315015"].map(footerLink),
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
    ].map(footerLink),
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
    ].map(footerLink),
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
    ].map(footerLink),
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
    ].map(footerLink),
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
    ].map(footerLink),
  },
  {
    title: "Studio",
    links: ["Work", "Blogs", "Clients", "Team", "Careers", "Reviews", "Contact"].map(
      footerLink,
    ),
  },
];

export const AI_LINKS = ["ChatGPT", "Gemini", "Perplexity", "Claude"];

const AI_HOMEPAGES: Record<string, string> = {
  chatgpt: "https://chatgpt.com/",
  gemini: "https://gemini.google.com/",
  perplexity: "https://www.perplexity.ai/",
  claude: "https://claude.ai/",
};

export function aiHomepage(name: string): string | null {
  return AI_HOMEPAGES[name.trim().toLowerCase()] ?? null;
}

/** Compact pill widths from the footer design (height is 48px for all). */
const AI_BUTTON_WIDTH: Record<string, string> = {
  chatgpt: "w-[125px]",
  gemini: "w-[121px]",
  perplexity: "w-[144px]",
  claude: "w-[125px]",
};

export function aiButtonWidth(name: string): string {
  return AI_BUTTON_WIDTH[name.trim().toLowerCase()] ?? "w-auto";
}
