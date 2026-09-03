// FAQ — Group 1707480273.png. Only the first item is expanded in the design,
// so only its answer text exists in the Figma file. Remaining items have no
// answer copy yet — they render as non-expandable until the client provides
// the content (do not invent answers).
export interface FaqItem {
  question: string;
  answer?: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What does Design Asylum do?",
    answer:
      "We build brand strategy, identity and digital for ambitious B2B companies, positioning, naming, visual identity, websites, film and campaigns. The kind of brand work that changes how the market reads you.",
  },
  { question: "What kind of companies do you work with?" },
  { question: "How does your branding process work?" },
  { question: "How much does a B2B branding project cost?" },
  { question: "Where are you, and do you work internationally?" },
  { question: "Why does branding matter for B2B?" },
  { question: "When should a startup invest in branding?" },
  { question: "What\u2019s the difference between a refresh and a full rebrand?" },
  { question: "How do you measure the ROI of branding?" },
  { question: "How long does a typical project take?" },
  { question: "Do you build websites, or just brand?" },
  { question: "Can you help with video and motion?" },
  { question: "What makes you different from other B2B agencies?" },
  { question: "How do I get started?" },
];
