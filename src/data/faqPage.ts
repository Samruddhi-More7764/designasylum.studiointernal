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
    answer:
      "Aerospace and defense manufacturing branding focuses on precision, certification, and proven engineering rigor. The identity must signal compliance, security clearances, and operational reliability to prime contractors and government bodies, while presenting a modern, capable industrial capability to commercial partners.",
    detailSlug: "aerospace",
  },
  {
    id: "legal",
    category: "branding",
    question: "How do you brand a legal or compliance professional-services firm?",
    answer:
      "Positioning centers on specialized authority, discretion, and deep industry knowledge. We replace generic corporate templates with distinctive typography, restrained color palettes, and clear practice-area narratives that demonstrate commercial understanding rather than abstract legal theory.",
    detailSlug: "legal",
  },
  {
    id: "explainer-agency",
    category: "marketing",
    question: "What makes a good B2B explainer-video agency?",
    answer:
      "A good B2B explainer agency understands complex product architectures and business incentives before touching a storyboard. The animation should serve clarity rather than decoration, distilling complex workflows into compelling 60 to 90 second narratives that drive pipeline conversion.",
    detailSlug: "explainer-agency",
  },
  {
    id: "fintech-video",
    category: "marketing",
    question: "How should a fintech company approach explainer videos?",
    answer:
      "Balance security compliance with user adoption. Fintech explainers need to quickly answer how funds flow, who holds custody, and how data is encrypted, while keeping the UI demonstrations fluid, reassuring, and effortless to digest.",
    detailSlug: "fintech-video",
  },
  {
    id: "cyber-video",
    category: "marketing",
    question: "What should a cybersecurity explainer video communicate?",
    answer:
      "Focus on real threat vectors and architectural resilience rather than generic fear-based marketing. Chief Information Security Officers respond to technical architecture diagrams, latency metrics, and clear integration workflows that prove enterprise viability.",
    detailSlug: "cyber-video",
  },
  {
    id: "proptech-video",
    category: "marketing",
    question: "How do you make an explainer video for a proptech platform?",
    answer:
      "Highlight the operational friction solved across brokers, tenants, and asset managers. Use clean interface fly-throughs paired with real-world spatial context to show measurable time and yield improvements.",
    detailSlug: "proptech-video",
  },
  {
    id: "3d",
    category: "marketing",
    question: "When does a B2B company need 3D design or animation?",
    answer:
      "When your product is physical, microscopic, subterranean, or architectural — or when software needs a tangible sense of depth and tactile polish. 3D cutaways and component animations explain internal mechanics faster than thousands of words.",
    detailSlug: "3d",
  },
  {
    id: "multilingual",
    category: "branding",
    question: "How do you handle branding for a multilingual or global audience?",
    answer:
      "Design modular layout grids that accommodate text expansion across translations, select universal typefaces with comprehensive glyph sets, and build culture-neutral imagery and icon systems that preserve clarity across regional markets.",
    detailSlug: "multilingual",
  },
  {
    id: "cost",
    category: "about",
    question: "How much does a B2B branding project cost?",
    answer:
      "Engagements typically range based on scope, from focused visual identity sprints to comprehensive company rebrands encompassing research, naming, positioning, motion systems, and custom web design and engineering.",
    detailSlug: "cost",
  },
  {
    id: "website-time",
    category: "website",
    question: "How long does a B2B website redesign take?",
    answer:
      "Most comprehensive B2B website projects take between 8 to 14 weeks from initial architecture and messaging through design, 3D/motion production, CMS integration, and performance-optimized deployment.",
    detailSlug: "website-time",
  },
  {
    id: "refresh",
    category: "branding",
    question: "What is the difference between branding and a brand refresh?",
    answer:
      "A complete rebrand redefines strategic positioning, target audiences, and foundational identity. A brand refresh modernizes visual execution — typography, color contrast, digital components, and design systems — while retaining established market equity.",
    detailSlug: "refresh",
  },
  {
    id: "deep-tech",
    category: "branding",
    question: "How do you write messaging for a deep-tech company?",
    answer:
      "Translate advanced science and patent-level innovation into clear commercial value propositions. We frame foundational technology in terms of unit economics, speed to market, and strategic advantage without losing technical credibility.",
    detailSlug: "deep-tech",
  },
  {
    id: "saas",
    category: "branding",
    question: "What should a SaaS rebrand prioritise?",
    answer:
      "Clarity of value over generic product screenshots. Prioritize modular messaging for different buying personas, differentiated visual art direction, and a conversion-engineered design system that scales seamlessly across marketing and in-app experiences.",
    detailSlug: "saas",
  },
  {
    id: "venture",
    category: "branding",
    question: "How do you brand a venture-capital or investment firm?",
    answer:
      "Founders look for domain conviction, strategic network value, and decisive culture. A venture firm brand needs distinctive editorial typography, authentic partner perspectives, and proof of founder support rather than standard financial stock imagery.",
    detailSlug: "venture",
  },
  {
    id: "manufacturing",
    category: "website",
    question: "What makes a strong manufacturing website?",
    answer:
      "Clear product hierarchies, downloadable CAD/spec sheets, interactive capability matrices, and high-fidelity facility and machinery imagery that prove production scale and tolerance capabilities to procurement engineers.",
    detailSlug: "manufacturing",
  },
  {
    id: "climate",
    category: "branding",
    question: "How do you approach branding for a climate-tech startup?",
    answer:
      "Avoid greenwashing tropes like generic leaves and watercolor gradients. Climate-tech buyers and investors demand hard engineering metrics, carbon accounting verification, and scalable industrial infrastructure positioning.",
    detailSlug: "climate",
  },
  {
    id: "healthcare",
    category: "branding",
    question: "What does a healthcare-tech brand need to get right?",
    answer:
      "Human empathy balanced with rigorous clinical and regulatory trust. Visual and verbal messaging must navigate HIPAA/FDA compliance while communicating measurable patient and practitioner workflow benefits.",
    detailSlug: "healthcare",
  },
  {
    id: "brochure",
    category: "marketing",
    question: "How do you design a brochure for enterprise sales?",
    answer:
      "Structure it as an executive briefing: executive summary, quantifiable problem statement, architectural solution, case metrics, and clear next steps, formatted with high typographic precision for both digital review and tactile print.",
    detailSlug: "brochure",
  },
  {
    id: "brand-film",
    category: "marketing",
    question: "When should a startup invest in a brand film?",
    answer:
      "When entering major fundraising rounds, launching category-defining products, or hiring key executive leadership. A brand film establishes emotional resonance and long-term conviction that static pitch decks cannot match.",
    detailSlug: "brand-film",
  },
  {
    id: "freelancer",
    category: "about",
    question: "How do you choose between a freelancer, a boutique, and a large agency?",
    answer:
      "Freelancers suit isolated tasks; large agency conglomerates carry high overhead and junior staffing. Boutique specialized studios provide direct senior partner involvement, unified creative-engineering execution, and agile turnaround.",
    detailSlug: "freelancer",
  },
  {
    id: "positioning",
    category: "about",
    question: "What is B2B brand positioning, really?",
    answer:
      "Positioning is the deliberate choice of which battle to fight and which audience to win. It defines what category you operate in, why legacy alternatives fail, and what irreplaceable advantage you deliver to your customer.",
    detailSlug: "positioning",
  },
  {
    id: "impact",
    category: "about",
    question: "How do you measure the impact of a rebrand?",
    answer:
      "Through inbound enterprise lead quality, sales cycle velocity, average contract value (ACV), talent recruitment rates, and investor valuation multiples post-launch.",
    detailSlug: "impact",
  },
];
