import type { ArticleSection, TocItem } from "@/data/brandingAgencyPage";
import type { FaqItem } from "@/data/faq";

export const AHMEDABAD_PATH = "/locations/ahmedabad";

export const ahmedabadBreadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/" },
] as const;

export const ahmedabadBreadcrumbCurrent = "Ahmedabad Web Design Agency";

export const ahmedabadHero = {
  title: "Best Web Design & Branding Agency in Ahmedabad",
  intro:
    "Ahmedabad’s economy has three layers — a deep manufacturing base, a fast-growing B2B and product-tech base, and the GIFT City fintech build-out. Each one needs a different kind of brand, but they share a buyer who has been around for a while and is hard to impress.",
};

export const ahmedabadCallout = {
  before: "What does an Ahmedabad founder ",
  accent: "gain",
  after: " from a Bangalore B2B studio?",
  body: "We work with Ahmedabad founders on positioning-led brand and Webflow builds. Same timezone, full working-day overlap, four to six weeks for standard scope. We are comfortable across modern SaaS and traditional manufacturing — and we know the difference.",
};

export const ahmedabadProjectTabs = [
  { id: "solution", label: "Solution" },
  { id: "service", label: "Service" },
  { id: "industry", label: "Industry" },
  { id: "location", label: "Location" },
] as const;

export const ahmedabadLead = ahmedabadHero.intro;

export const ahmedabadSections: ArticleSection[] = [
  {
    id: "why-ahmedabad-brands",
    tocLabel:
      "Why Ahmedabad B2B brands need a branding partner that understands the local market",
    before: "Why Ahmedabad B2B brands need a ",
    accent: "branding",
    after: " partner that understands the local market",
    paragraphs: [
      "Ahmedabad founders are pragmatic. They have built real businesses with real revenue, often in categories where the buyer values substance over polish. A branding partner who does not understand that walks in with a generic ‘startup’ aesthetic and immediately loses the room. The work here has to respect the operator’s instinct while still moving the brand somewhere more ambitious.",
      "That is the gap we fill: a B2B studio that takes Ahmedabad’s industrial seriousness as a starting point, not a problem to design away.",
    ],
  },
  {
    id: "what-goes-wrong",
    tocLabel: "What goes wrong with most Ahmedabad agency engagements",
    before: "What goes ",
    accent: "wrong",
    after: " with most Ahmedabad agency engagements",
    paragraphs: [
      "Across the founders we talk to, the same four patterns come up again and again:",
    ],
    blocks: [
      {
        title: "Manufacturing-style websites",
        paragraphs: [
          "Sites built like a product catalogue — specs, certifications, and a contact form — with no story and no point of view. They prove you exist; they do not make anyone want to work with you.",
        ],
      },
      {
        title: "No positioning depth",
        paragraphs: [
          "The agency jumps to visuals before anyone has decided who the brand is for or what it stands against. The result looks fine and says nothing.",
        ],
      },
      {
        title: "Weak copywriting",
        paragraphs: [
          "Words treated as filler around the design rather than the load-bearing part of the brand. In B2B, the copy is the product demo — weak words mean a weak pitch.",
        ],
      },
      {
        title: "Vendor mentality",
        paragraphs: [
          "An agency that waits for instructions instead of bringing a strategy. You end up art-directing your own brand, which is exactly what you hired out.",
        ],
      },
    ],
  },
  {
    id: "how-we-work",
    tocLabel: "How we work with Ahmedabad B2B founders",
    before: "How we work with Ahmedabad B2B founders",
    paragraphs: [],
  },
  {
    id: "named-clients",
    tocLabel: "Named clients and work",
    before: "Named ",
    accent: "clients",
    after: " and work",
    paragraphs: [
      "Our industrial and manufacturing work is directly relevant to Ahmedabad’s base. We built the brand and messaging for Ximkart, a custom-manufacturing sourcing platform, and the full brand and website for Sevenloop, an end-to-end custom manufacturing solutions provider — both projects that sit exactly at the intersection of old-world manufacturing and modern engineering that defines much of Ahmedabad’s growth.",
    ],
  },
  {
    id: "best-for",
    tocLabel: "Best for",
    accent: "Best",
    after: " for",
    paragraphs: [],
    pointers: [
      {
        text: "Ahmedabad manufacturers ready to look as modern as their engineering already is.",
      },
      {
        text: "B2B and product-tech founders who need positioning and copy, not just a redesign.",
      },
      {
        text: "GIFT City fintech teams building an enterprise-credible brand from day one.",
      },
    ],
  },
  {
    id: "what-is-included",
    tocLabel: "What is included",
    before: "What is ",
    accent: "included",
    paragraphs: [
      "Brand diagnosis and positioning, messaging and website copywriting, visual identity, and a Webflow build — plus the collateral (deck, one-pager) that the sales team actually uses. Everything is delivered by the same core team, so the strategy carries all the way to the live page.",
    ],
  },
  {
    id: "engagement-model",
    tocLabel: "Engagement model",
    accent: "Engagement",
    after: " model",
    paragraphs: [
      "A fixed-scope engagement quoted against a clear outcome, typically four to six weeks for standard scope, with full working-day overlap and a single point of contact. No open-ended retainers and no surprise change-orders mid-build.",
    ],
  },
  {
    id: "bridging-legacy",
    tocLabel: "Bridging legacy industry and modern tech in one brand",
    accent: "Bridging",
    after: " legacy industry and modern tech in one brand",
    paragraphs: [
      "Ahmedabad’s real branding challenge is range. A single brand often has to speak to a fifty-year-old manufacturing buyer and a venture-backed product team in the same week. The GIFT City fintech build-out sharpens this further — institutions there need a brand that signals regulatory seriousness and modern capability at once.",
      "That is the work we are built for: holding industrial credibility and contemporary ambition in one coherent brand, so you do not have to choose between looking trustworthy and looking current.",
    ],
  },
];

export const AHMEDABAD_CTA_ID = "ready-to-transform";

export const ahmedabadToc: TocItem[] = [
  ...ahmedabadSections.map((section) => ({
    id: section.id,
    label: section.tocLabel,
  })),
  {
    id: AHMEDABAD_CTA_ID,
    label: "Ready to transform your Ahmedabad brand?",
  },
];

export const ahmedabadCta = {
  body: "Book a 30-minute diagnosis call — no pitch, just a clear read on where your brand stands.",
  button: "Talk to a design expert",
};

export const ahmedabadFaqItems: FaqItem[] = [
  {
    question: "How does B2B web design differ from B2C?",
    answer:
      "B2B web design serves a rational buyer in a long, multi-person decision — the job is clarity and credibility, not impulse. Instead of optimising for an instant emotional purchase, a B2B site has to explain a complex offer, earn trust with proof, and give different stakeholders (the user, the budget-holder, the technical evaluator) what each of them needs. The aesthetics matter, but they serve the argument rather than replace it.",
  },
  {
    question:
      "What makes a boutique agency better than a large agency for B2B web design?",
  },
  { question: "How to choose the right web design agency?" },
  {
    question: "How much does a B2B website redesign cost in India and the US?",
  },
  { question: "How long does a B2B website redesign take?" },
  {
    question:
      "What should a high-quality B2B website include in design, messaging, and UX?",
  },
];
