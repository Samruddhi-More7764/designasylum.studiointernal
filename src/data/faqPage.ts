export type FaqCategory = "about" | "branding" | "website" | "marketing";

export type FaqEntry = {
  id: string;
  question: string;
  category: FaqCategory;
  answer?: string;
  /** Full answer page. Present only when the list shows “Read full answer”. */
  detailSlug?: string;
};

export const faqCategories: { id: "all" | FaqCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "about", label: "About us" },
  { id: "branding", label: "Branding & strategy" },
  { id: "website", label: "Website & development" },
  { id: "marketing", label: "Marketing" },
];

const defenseAnswer =
  "Lead with credibility and clarity. Procurement officers need proof of capability and compliance; investors need a story about the market. A defense-tech brand has to carry both audiences without diluting either — so we separate the messaging into parallel paths that share one confident identity.";

export const faqEntries: FaqEntry[] = [
  {
    id: "defense-tech",
    category: "branding",
    question: "How should a defense-tech startup approach branding for procurement and investors?",
    answer: defenseAnswer,
    detailSlug: "defense-tech",
  },
  {
    id: "aerospace",
    category: "branding",
    question: "What does branding look like for an aerospace and defense manufacturer?",
  },
  {
    id: "legal",
    category: "branding",
    question: "How do you brand a legal or compliance professional-services firm?",
  },
  {
    id: "explainer-agency",
    category: "marketing",
    question: "What makes a good B2B explainer-video agency?",
  },
  {
    id: "fintech-video",
    category: "marketing",
    question: "How should a fintech company approach explainer videos?",
  },
  {
    id: "cyber-video",
    category: "marketing",
    question: "What should a cybersecurity explainer video communicate?",
  },
  {
    id: "proptech-video",
    category: "marketing",
    question: "How do you make an explainer video for a proptech platform?",
  },
  {
    id: "3d",
    category: "marketing",
    question: "When does a B2B company need 3D design or animation?",
  },
  {
    id: "multilingual",
    category: "branding",
    question: "How do you handle branding for a multilingual or global audience?",
  },
  {
    id: "cost",
    category: "about",
    question: "How much does a B2B branding project cost?",
  },
  {
    id: "website-time",
    category: "website",
    question: "How long does a B2B website redesign take?",
  },
  {
    id: "refresh",
    category: "branding",
    question: "What is the difference between branding and a brand refresh?",
  },
  {
    id: "deep-tech",
    category: "branding",
    question: "How do you write messaging for a deep-tech company?",
  },
  {
    id: "saas",
    category: "branding",
    question: "What should a SaaS rebrand prioritise?",
  },
  {
    id: "venture",
    category: "branding",
    question: "How do you brand a venture-capital or investment firm?",
  },
  {
    id: "manufacturing",
    category: "website",
    question: "What makes a strong manufacturing website?",
  },
  {
    id: "climate",
    category: "branding",
    question: "How do you approach branding for a climate-tech startup?",
  },
  {
    id: "healthcare",
    category: "branding",
    question: "What does a healthcare-tech brand need to get right?",
  },
  {
    id: "brochure",
    category: "marketing",
    question: "How do you design a brochure for enterprise sales?",
  },
  {
    id: "brand-film",
    category: "marketing",
    question: "When should a startup invest in a brand film?",
  },
  {
    id: "freelancer",
    category: "about",
    question: "How do you choose between a freelancer, a boutique, and a large agency?",
  },
  {
    id: "positioning",
    category: "about",
    question: "What is B2B brand positioning, really?",
  },
  {
    id: "impact",
    category: "about",
    question: "How do you measure the impact of a rebrand?",
  },
];
