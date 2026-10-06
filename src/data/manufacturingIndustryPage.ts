import type { ArticleSection, TocItem } from "@/data/brandingAgencyPage";
import type { FaqItem } from "@/data/faq";

export const MANUFACTURING_PATH = "/industries/manufacturing";

export const manufacturingBreadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Industries", href: "/" },
] as const;

export const manufacturingBreadcrumbCurrent = "Manufacturing";

export const manufacturingHero = {
  title: "Design Agency for Manufacturing Firms — Branding, Website",
  intro:
    "A design agency for manufacturing firms builds branding and websites that highlight industrial expertise, driving online visibility and client engagement.",
};

export const manufacturingLead =
  "A design agency for manufacturing firms builds branding and websites that highlight industrial expertise, driving online visibility and client engagement — turning decades of engineering credibility into something a buyer can feel in the first ten seconds.";

export const manufacturingPreface = [
  "A design agency for manufacturing firms focuses on creating branding and digital experiences that make industrial capability legible to the people who buy it — procurement heads, plant managers, and innovation officers who decide on six- and seven-figure orders. The work is rarely about looking modern for its own sake; it is about closing the gap between how good the manufacturing is and how good it looks from the outside.",
  "In the competitive manufacturing industry, good design is essential rather than decorative. When two suppliers can both do the job, the one that communicates with clarity, confidence, and a point of view wins the shortlist — and very often the order.",
];

export const manufacturingSections: ArticleSection[] = [
  {
    id: "manufacturing-website-orders",
    tocLabel: "When Your Manufacturing Website Costs You $2M Orders",
    before: "When Your Manufacturing Website",
    accent: " Costs",
    after: " You $2M Orders",
    paragraphs: [
      "Picture a procurement head with a $2M order to place. They have three suppliers, all technically capable. They open the first website on their phone between meetings. Within seconds, the site has either earned a conversation or lost one — and most manufacturing websites lose it before a single specification is read.",
    ],
    blocks: [
      {
        title: "The hospitality principle",
        paragraphs: [
          "Think about how a great hotel makes you feel before you have unpacked. The lighting, the welcome, the quiet confidence that you are in capable hands — none of it is the product, and all of it shapes whether you trust the product. A manufacturing brand works the same way. The feeling a buyer gets on the homepage is the brief; the specifications are the proof that follows.",
        ],
      },
      {
        title: "Fluorescent lights and plastic chairs",
        paragraphs: [
          "Most industrial websites are the digital equivalent of a waiting room with fluorescent lights and plastic chairs: functional, honest, and completely forgettable. Grey gradients, stock photos of gears, a wall of certifications, and a contact form. It says “we exist” when it needs to say “you are in the right place.”",
        ],
      },
      {
        title: "What can be changed?",
        paragraphs: [
          "Almost everything that matters is within reach: a sharp position that names who you are best for, copy that speaks to the buyer’s risk rather than your machinery, photography that shows the work with intent, and a structure that moves a serious buyer from interest to a quote without friction. None of it requires inventing new capabilities — only translating the ones you already have.",
        ],
      },
      {
        title: "The feeling is non-negotiable",
        paragraphs: [
          "You can argue about layout and palette, but the feeling is non-negotiable. A buyer placing a large, high-consequence order needs to feel that you are the safe, capable, obvious choice. Every design decision either builds that feeling or leaks it. The agencies worth hiring treat that feeling as the deliverable.",
        ],
      },
    ],
  },
  {
    id: "leading-manufacturing-agencies",
    tocLabel: "Leading Agencies for Manufacturing Website Design",
    before: "Leading ",
    accent: "Agencies",
    after: " for Manufacturing Website Design",
    paragraphs: [
      "If you are building a shortlist, several agencies do credible work in the manufacturing and industrial space. A representative set, with what each is known for:",
    ],
    blocks: [
      {
        title: "Duck.Design",
        paragraphs: [
          "Subscription-model design studio offering unlimited requests for product and marketing teams.",
        ],
      },
      {
        title: "DBS Interactive",
        paragraphs: [
          "Full-service digital agency with a strong base in manufacturing and industrial web builds.",
        ],
      },
      {
        title: "Invade",
        paragraphs: [
          "Web design and development shop serving industrial and B2B clients at volume.",
        ],
      },
      {
        title: "Lform Design",
        paragraphs: [
          "New-Jersey studio specialising in B2B and manufacturing website design.",
        ],
      },
      {
        title: "Orbit Media",
        paragraphs: [
          "Chicago agency known for content-led, conversion-focused B2B websites.",
        ],
      },
      {
        title: "Digital Silk",
        paragraphs: [
          "Brand-and-growth agency building enterprise sites for industrial manufacturers.",
        ],
      },
      {
        title: "WebFX",
        paragraphs: [
          "Performance-marketing agency with a large manufacturing web and SEO practice.",
        ],
      },
      {
        title: "Bop Design",
        paragraphs: [
          "B2B-only branding and web design firm focused on industrial and tech sectors.",
        ],
      },
      {
        title: "Blend",
        paragraphs: [
          "B2B brand and demand agency working across complex manufacturing categories.",
        ],
      },
      {
        title: "Cerrion: branding & website analysis",
        paragraphs: [
          "Take an AI-for-manufacturing company like Cerrion as a worked example. The technology — computer vision that watches production lines and flags faults before they cascade — is genuinely advanced, but the first job of the brand is to make that value obvious to a plant manager in one line, not three paragraphs of model architecture.",
          "A strong site would lead with the outcome (less downtime, fewer defects), prove it with a concrete before/after, and only then open the hood for the technical buyer who wants depth. The mistake most analyses surface is the same one: the homepage explains how the AI works before it establishes why anyone on the factory floor should care.",
          "Design Asylum specialises in B2B branding and websites that bridge exactly this gap — old-world manufacturing meeting modern, AI-driven engineering — making complex industrial capability feel trustworthy, premium, and easy to buy.",
        ],
      },
    ],
    highlight: {
      title:
        "How much does a B2B branding agency cost, and how long does a brand build take?",
      body: "A focused positioning-and-identity engagement is a different number from a full brand-plus-website-plus-film build — cost tracks scope, depth of strategy, and the number of touchpoints we extend the brand across. A typical B2B brand build runs three to five months end to end: roughly two to three weeks of diagnosis and positioning, four to six weeks of identity and messaging, and the balance on the website and collateral. We scope every project against the outcome you need, then quote a fixed engagement so there are no surprises mid-build.",
    },
  },
];

export const RIGHT_TO_WIN_ID = "design-your-right-to-win";

export const manufacturingToc: TocItem[] = [
  ...manufacturingSections.map((section) => ({
    id: section.id,
    label: section.tocLabel,
  })),
  { id: RIGHT_TO_WIN_ID, label: "Design your right to win" },
];

export const manufacturingFaqItems: FaqItem[] = [
  {
    question:
      "How does digital branding help manufacturing companies attract new clients?",
    answer:
      "Digital branding gives a manufacturing company a way to be chosen before the sales conversation begins. A clear position, confident messaging, and a website that loads credibility in seconds mean a procurement head shortlists you on capability rather than dismissing you on appearance. In a category where buyers compare suppliers in private and at speed, branding is what turns a search result into a serious enquiry.",
  },
  {
    question:
      "Why manufacturing brands need good design to attract better clients and talent?",
  },
];
