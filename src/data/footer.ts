// Shared footer link-column content + AI link labels, used by both the
// full Homepage/Client-Hub footer (`Footer`) and the Case Study footer
// (`CaseStudyFooter`), which reuses the same column copy minus "Sales"
// (folded into the Case Study's top contact block instead) and without a
// dedicated "Follow Us" column (social icons move into that same block).
export interface FooterLink {
  label: string;
  /** null = render as plain text (no anchor) */
  href: string | null;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/design-asylum-studio/posts/?feedView=all",
  instagram: "https://www.instagram.com/designasylum.studio?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw==",
  youtube: "https://www.youtube.com/@DesignAsylumStudio",
};

const FOOTER_HREFS: Record<string, string> = {
  // Company & Main Pages
  "Why Design Asylum": "/why-design-asylum",
  Work: "/work",
  Clients: "/clients",
  Team: "/team",
  Blogs: "/blogs",
  Careers: "/why-design-asylum",
  Contact: "/contact",
  Studio: "/studio",
  FAQs: "/faq",
  Reviews: "/why-design-asylum",
  "Recent Updates": "/blogs",
  "Our Terms": "/why-design-asylum",
  "The No Brainer Offer": "/why-design-asylum",

  // Industries
  Manufacturing: "/industries/manufacturing",
  Fintech: "/industries/fintech",
  Deeptech: "/industries/deeptech",
  "Enterprise SaaS": "/industries/enterprise-saas",
  Cybersecurity: "/industries/cybersecurity",
  Healthcare: "/industries/healthcare",

  // Services
  "Brand Systems": "/services/brand-systems",
  "Website Design": "/services/website-design",
  "Webflow Build": "/services/webflow-build",
  "Film & Motion": "/services/film-motion",
  "Print Design": "/services/print-design",
  Campaigns: "/services/campaigns",

  // Solutions
  "B2B Branding": "/solutions/b2b-branding",
  "Brand Strategy": "/solutions/brand-strategy",
  Rebrand: "/solutions/rebrand",
  Naming: "/solutions/naming",
  Positioning: "/solutions/positioning",
  "Visual Identity": "/solutions/visual-identity",

  // Work
  "B2B Website Design": "/work/b2b-website-design",
  "Website Projects": "/work/website-projects",
  "3D & Motion": "/work/3d-motion",
  Thinking: "/work/thinking",
  "Website Audit": "/work/website-audit",
  "Print Studio": "/work/print-studio",
  "Studio Reviews": "/work/studio-reviews",
};

export function footerLinkHref(label: string): string {
  if (FOOTER_HREFS[label]) return FOOTER_HREFS[label];
  const normalized = label.trim().toLowerCase();
  for (const [key, href] of Object.entries(FOOTER_HREFS)) {
    if (key.toLowerCase().trim() === normalized) return href;
  }
  return "#";
}

function footerLink(label: string): FooterLink {
  return { label, href: footerLinkHref(label) };
}

/** A footer entry rendered as plain non-clickable text (href=null). */
function footerText(label: string): FooterLink {
  return { label, href: null };
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
      footerText("Why Design Asylum"),
      footerLink("Studio"),
      footerLink("Recent Updates"),
      footerLink("Our Terms"),
      footerLink("FAQs"),
      footerLink("The No Brainer Offer"),
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
