export const BRANDING_AGENCY_PATH = "/blogs/branding-agency-in-pune";

export const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/" },
] as const;

export const breadcrumbCurrent = "Branding Agency";

export type PointerEntry = {
  /** Leading clause. Rendered at Satoshi 500 when set. */
  term?: string;
  /** Explanation, or the full line when there is no separate term. */
  text: string;
};

export type ArticleSection = {
  id: string;
  tocLabel: string;
  before?: string;
  accent?: string;
  after?: string;
  paragraphs: string[];
  pointers?: PointerEntry[];
  closing?: string[];
  highlight?: {
    title: string;
    body: string;
  };
  /** Title plus one or more paragraphs, stacked rather than inline. */
  blocks?: { title: string; paragraphs: string[] }[];
};

export const introduction =
  "A design agency for manufacturing firms builds branding and websites that highlight industrial expertise, driving online visibility and client engagement — turning decades of engineering credibility into something a buyer can feel in the first ten seconds.";

export const articleSections: ArticleSection[] = [
  {
    id: "everything-you-need-to-know",
    tocLabel:
      "Everything You Need to Know About Choosing a B2B Branding Agency in India",
    before: "Everything You Need to Know About Choosing a B2B ",
    accent: "Branding Agency",
    after: " in India",
    paragraphs: [
      "Choosing a branding partner is one of the highest-leverage decisions a B2B company makes, and one of the hardest to evaluate from the outside. The work is intangible until it ships, the vocabulary is unfamiliar, and every agency claims the same outcomes. This guide is built to fix that — a structured reading path that takes you from understanding what branding actually is to shortlisting the few agencies worth a conversation.",
      "Read it in order if you are starting cold, or jump to the resource that matches your stage. Each section below is self-contained, and the table of contents on the left tracks where you are.",
    ],
  },
  {
    id: "definitive-guide",
    tocLabel: "The Definitive Guide to B2B Branding Agencies",
    before: "The Definitive Guide to ",
    accent: "B2B Branding Agencies",
    paragraphs: [
      "B2B branding is not a logo and a colour palette. It is the deliberate construction of belief in a market where the buyer is rational, the cycle is long, and the decision is made by a committee. A real branding agency works across three layers, in this order:",
    ],
    pointers: [
      {
        term: "Strategy",
        text: "positioning, narrative, and the single idea that makes you the obvious choice for a specific buyer.",
      },
      {
        term: "Messaging",
        text: "the words that carry that idea across the website, the deck, and the sales conversation.",
      },
      {
        term: "Identity",
        text: "the logo, type, colour, motion, and system that make the strategy recognisable and repeatable.",
      },
    ],
    closing: [
      "Agencies that lead with identity tend to produce work that looks good and changes nothing. The order matters because the identity is only as good as the idea it is dressing.",
    ],
  },
  {
    id: "buyers-guide-2026",
    tocLabel: "The 2026 Buyer's Guide",
    before: "The 2026 ",
    accent: "Buyer's Guide",
    paragraphs: [
      "The market has shifted. Buyers research in private, AI summarises your category before a human ever reads your homepage, and a generic brand is now actively penalised — it gets compressed into a list of interchangeable vendors. In 2026, a brand earns its place by being legible to a machine and memorable to a person at the same time.",
      "When you brief an agency this year, press on three things: how they diagnose your current positioning, how they write (ask to read their copy, not see their logos), and how they think about the brand showing up across formats — site, film, deck, and search — as one coherent system rather than a set of assets.",
    ],
    highlight: {
      title:
        "How much does a B2B branding agency cost, and how long does a brand build take?",
      body: "A focused positioning-and-identity engagement is a different number from a full brand-plus-website-plus-film build — cost tracks scope, depth of strategy, and the number of touchpoints we extend the brand across. A typical B2B brand build runs three to five months end to end: roughly two to three weeks of diagnosis and positioning, four to six weeks of identity and messaging, and the balance on the website and collateral. We scope every project against the outcome you need, then quote a fixed engagement so there are no surprises mid-build.",
    },
  },
  {
    id: "top-10",
    tocLabel:
      "Top 10 B2B Branding Agencies in India — The Strategic Guide",
    before: "Top 10 B2B Branding Agencies in India — The ",
    accent: "Strategic Guide",
    paragraphs: [
      "Rankings are a starting point, not a verdict. The right agency for a seed-stage cybersecurity startup is rarely the right agency for a forty-year-old manufacturing firm. Instead of a fixed top-ten, evaluate any shortlist against the work itself: depth in your sector, evidence of strategy (not just visuals), and clients who came back for a second and third project.",
      "Design Asylum’s own portfolio runs across manufacturing, cybersecurity, fintech, SaaS, and deep tech — Sevenloop, Fortuna Cysec, Ximkart, Progcap, and others — with a pattern of long, compounding relationships rather than one-off rebrands. That repeat-engagement record is the signal worth looking for in any agency you consider.",
    ],
  },
  {
    id: "best-fit",
    tocLabel: "Best B2B Branding Agency Based on Your Needs",
    before: "Best B2B Branding Agency Based on ",
    accent: "Your Needs",
    paragraphs: [
      "There is no single best agency — only the best fit for your situation. Match the partner to the problem:",
    ],
    pointers: [
      {
        term: "Repositioning a company that has outgrown its story",
        text: "you need a strategy-led agency that writes well, not a studio that only designs.",
      },
      {
        term: "Launching a new brand from zero",
        text: "you need a team that can build naming, narrative, identity, and a site as one engagement.",
      },
      {
        term: "A category nobody understands yet",
        text: "you need an agency with the patience to learn your domain and the craft to make it legible.",
      },
    ],
    closing: [
      "Be honest about which of these you are. The brief you write determines the partner you should pick.",
    ],
  },
  {
    id: "how-to-identify",
    tocLabel: "How to Identify a B2B Branding Agency That Actually Delivers",
    before: "How to Identify a B2B Branding Agency That ",
    accent: "Actually Delivers",
    paragraphs: [
      "The reliable signals are the unglamorous ones. Look for an agency whose case studies explain the thinking, not just show the artwork. Look for repeat clients and referrals — the clearest proof a relationship worked. Look for a single team that carries a project from strategy through build, so the strategic thread never gets lost in a handoff.",
      "Be wary of the opposite: a portfolio of beautiful logos with no story attached, a pitch that opens with visual directions before anyone has diagnosed the problem, and a team that disappears behind account managers after the kickoff.",
    ],
  },
  {
    id: "critical-factors",
    tocLabel: "20 Critical Factors Every Decision-Maker Must Know",
    before: "20 Critical Factors Every Decision-Maker ",
    accent: "Must Know",
    paragraphs: [
      "Before you sign, run the engagement against a checklist. The factors that most often separate a brand that works from one that gathers dust:",
    ],
    pointers: [
      { text: "Strategy comes before identity — always." },
      { text: "The same core team stays on from kickoff to launch." },
      { text: "They write your copy, not just design your pages." },
      { text: "They have genuine depth in your sector or category." },
      { text: "The brand is built as a system, not a set of files." },
      { text: "Pricing is fixed and scoped to a clear outcome." },
      { text: "Repeat clients and referrals back up the pitch." },
      { text: "They can extend the brand to film, deck, and search." },
    ],
    closing: [
      "The remaining factors — governance, asset handoff, motion guidelines, accessibility, SEO architecture, and ongoing support — matter just as much once the brand is live. Ask how each is handled before, not after, you commit.",
    ],
  },
  {
    id: "ultimate-guide",
    tocLabel: "The Ultimate Guide to Selecting B2B Branding Agencies in India",
    before: "The Ultimate Guide to Selecting ",
    accent: "B2B Branding Agencies in India",
    paragraphs: [
      "Pull it together into a process. Write a brief that states the belief you want to create, not the deliverables you think you need. Shortlist three to five agencies on evidence of strategy and sector depth. Ask each to walk you through one project end to end — the diagnosis, the decision, the result. Read their writing. Talk to a repeat client.",
      "The agency that asks the sharpest questions about your business, rather than the one with the slickest deck, is almost always the right one. A branding engagement is a partnership measured in years, not a transaction measured in assets.",
    ],
  },
  {
    id: "how-to-use",
    tocLabel: "How to Use These Resources",
    before: "How to Use These ",
    accent: "Resources",
    paragraphs: [
      "Start with the Definitive Guide if branding is new territory, or the 2026 Buyer’s Guide if you are briefing an agency this quarter. Use the 20 Critical Factors as a scorecard while you shortlist, and the Ultimate Guide to run your selection process. When you are ready to talk, bring the belief you want to build — we will start with the diagnosis.",
    ],
  },
];

export const tocItems = articleSections.map((section) => ({
  id: section.id,
  label: section.tocLabel,
}));

export type TocItem = (typeof tocItems)[number];

/**
 * Tabs are interactive. The frame repeats one project set on every tab,
 * so each tab shows the same cards until a real taxonomy exists.
 */
export const clientBrandingTabs = [
  { id: "solution", label: "Solution" },
  { id: "service", label: "Service" },
  { id: "industry", label: "Industry" },
  { id: "branding-projects", label: "Branding Projects" },
] as const;

export type ClientBrandingTabId = (typeof clientBrandingTabs)[number]["id"];

const projectDescription =
  "Brand strategy and website design for Fortuna Cysec, an AI-driven managed security services provider.";

export const brandingProjects = [
  "project-1",
  "project-2",
  "project-3",
  "project-4",
  "project-5",
  "project-6",
].map((file, index) => ({
  image: `/assets/images/branding-agency/${file}.png`,
  name: "Fortuna Cysec",
  description: projectDescription,
  href: "/",
  key: `${file}-${index}`,
}));

export const brandingExpertsHeading = {
  before: "Branding ",
  accent: "experts",
  subheading:
    "The same core team across Ximkart, Revind and Sevenloop strategy, design, film and build under one roof.",
};

export const brandingExperts = Array.from({ length: 6 }, (_, index) => ({
  image: "/assets/images/branding-agency/team-portrait.png",
  name: "Tanmaya Rao",
  role: "Lead Brand Designer | Illustrator",
  key: `tanmaya-${index}`,
}));

export const relatedBlogsHeading = {
  before: "Related ",
  accent: "blogs",
};

export const relatedBlogs = Array.from({ length: 6 }, (_, index) => ({
  image: "/assets/images/branding-agency/related-blog.png",
  date: "September 7, 2026",
  readTime: "10 min read",
  title: "Top 10 Branding Agencies in Bangalore (2026 Shortlist)",
  href: BRANDING_AGENCY_PATH,
  key: `related-${index}`,
}));

export const serviceFaqItems = [
  {
    question: "What is B2B branding and why does it matter?",
    answer:
      "B2B branding is the deliberate construction of belief — the positioning, narrative, and identity that decide what a buyer, an investor, or a hire thinks about you before they ever speak to your team. In long, committee-driven sales cycles, that pre-belief is what gets you shortlisted, shortens the conversation, and lets you command a premium. A weak brand forces your salespeople to explain who you are on every call; a strong one does that work before the call begins.",
  },
  { question: "What should you look for when hiring a branding agency?" },
  { question: "How to evaluate a branding agency's portfolio?" },
  { question: "Questions to ask a branding agency?" },
  { question: "How much does a B2B branding agency charge?" },
  { question: "What is brand identity and why does it matter?" },
];
