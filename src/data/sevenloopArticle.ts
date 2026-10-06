import type { FaqItem } from "@/data/faq";

export const SEVENLOOP_ARTICLE_PATH = "/blogs/sevenloop-brand-website-redesign";

export type TextPart = string | { strong: string };

export type ArticleBlock =
  | { kind: "paragraphs"; items: string[] }
  | { kind: "rich"; parts: TextPart[] }
  | { kind: "subhead"; title: string; body?: string }
  | { kind: "arrows"; items: { lead?: string; rest: string }[] }
  | { kind: "rows"; items: { label: string; value: string }[] }
  | { kind: "image"; src: string; alt: string }
  | { kind: "gallery"; srcs: string[]; alt: string }
  | { kind: "quote"; quote: string; name: string; role: string }
  | { kind: "note"; kicker: string; body: string }
  | { kind: "links"; kicker: string; items: { href: string; label: string }[] };

export type ArticleSection = {
  id: string;
  label: string;
  before?: string;
  accent?: string;
  after?: string;
  blocks: ArticleBlock[];
};

export const sevenloopLead =
  "The Sevenloop brand and website redesign transformed a respected precision-manufacturing business into an enterprise-ready brand — repositioning the company, rebuilding its identity, and shipping a Webflow site in five months. What follows is the full story: the brief, the strategy, the build, and the conversations it opened.";

export const sevenloopSections: ArticleSection[] = [
  {
    id: "transforming",
    label: "Transforming Precision Manufacturing: The Complete Sevenloop Brand & Website Redesign",
    before: "Transforming Precision Manufacturing: The ",
    accent: "Complete",
    after: " Sevenloop Brand & Website Redesign",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Sevenloop builds precision-engineered components for the sectors that can least afford failure — defense, mining, metro, and automotive. The engineering was world-class; the brand was not yet telling that story. Our remit was to close the gap between how good the work was and how good it looked from the outside",
        ],
      },
      {
        kind: "rich",
        parts: [
          "The timing mattered. With roughly ",
          { strong: "$8 million in Series A interest on the table — about ₹184 Crores" },
          " — Sevenloop needed a brand and a digital presence that could stand in front of global buyers and institutional investors without apology. This was not a cosmetic refresh; it was infrastructure for the next stage of the company.",
        ],
      },
      { kind: "image", src: "/assets/images/blog/story.jpg", alt: "Sevenloop brand and website" },
    ],
  },
  {
    id: "voice-of-success",
    label: "The Voice of Success",
    before: "The",
    accent: " Voice ",
    after: "of Success",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "The clearest measure of a rebrand is what changes in the room after it ships — how sales conversations start, how quickly trust is established, how little has to be explained.",
        ],
      },
      {
        kind: "quote",
        quote:
          "“Our entire experience, from design concept to the final product was glitch-free. Conversations with our clients have become so much more easier now.”",
        name: "Tanmaya Rao",
        role: "CEO & Co-Founder, Sevenloop",
      },
      {
        kind: "paragraphs",
        items: [
          "That ease is the point. When the brand carries the credibility, the team gets to spend its time on the work instead of the introduction.",
        ],
      },
    ],
  },
  {
    id: "understanding-sevenloop",
    label: "Understanding Sevenloop: The Client Profile",
    accent: "Understanding",
    after: " Sevenloop: The Client Profile",
    blocks: [
      {
        kind: "subhead",
        title: "Company overview",
        body: "Sevenloop is a Bengaluru-based custom metal manufacturing platform that owns the full supply-chain stack — from raw-material sourcing across 20+ countries through factory technology to execution — serving global clients including Komatsu, Hydac, and Jindal.",
      },
      {
        kind: "subhead",
        title: "The financial backing",
        body: "Sevenloop is backed by a strong syndicate of institutional investors who underwrite its growth across sourcing, technology, and manufacturing capacity.",
      },
      {
        kind: "arrows",
        items: [
          { lead: "Z47", rest: "(previously Matrix Partners India)" },
          { rest: "Multiply Ventures" },
          { rest: "Alteria Capital" },
        ],
      },
      { kind: "subhead", title: "Our Relationship" },
      {
        kind: "rows",
        items: [
          { label: "2022", value: "First engagement — branding and messaging for Ximkart, the sourcing platform." },
          { label: "2024", value: "Return engagement — the full Sevenloop parent brand and website." },
          { label: "Current", value: "Ongoing collaboration — homepage revamp, brand film, and an investor-referred project in progress." },
        ],
      },
    ],
  },
  {
    id: "the-challenge",
    label: "The Challenge: Excellence That Wasn't Translating",
    before: "The Challenge: Excellence That Wasn't ",
    accent: "Translating",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Sevenloop’s capabilities were ahead of its communication. Three gaps stood out.",
          "When you brief an agency this year, press on three things: how they diagnose your current positioning, how they write (ask to read their copy, not see their logos), and how they think about the brand showing up across formats — site, film, deck, and search — as one coherent system rather than a set of assets.",
        ],
      },
      {
        kind: "subhead",
        title: "Problem 01 — Positioning",
        body: "A company sitting at the intersection of old-world metal manufacturing and AI-driven engineering had no single, sharp way to say so. Buyers met the depth only after a long conversation, not before it.",
      },
      {
        kind: "subhead",
        title: "Problem 02 — Credibility at first glance",
        body: "The old site read like a product company, not an enterprise partner. For procurement heads and innovation officers vetting a vendor, first impressions were doing the company a disservice.",
      },
      {
        kind: "subhead",
        title: "Problem 03 — A fragmented story",
        body: "Sourcing, technology, and execution were three strong stories told separately. There was no spine connecting them into one platform narrative.",
      },
      {
        kind: "note",
        kicker: "The bottom line",
        body: "Great engineering was losing deals it should have won — not on capability, but on how the capability was presented.",
      },
    ],
  },
  {
    id: "strategic-approach",
    label: "Our Strategic Approach: Discovering the Core",
    before: "Our Strategic Approach: Discovering the ",
    accent: "Core",
    blocks: [
      {
        kind: "subhead",
        title: "Discovery process",
        body: "We started inside the business — founder interviews, sales-call transcripts, buyer objections, and a hard look at the competitive set across India, the US, and Europe. The brief wasn’t to invent a story; it was to find the true one and make it legible.",
      },
      {
        kind: "subhead",
        title: "Strategic insight — precision",
        body: "Precision turned out to be the through-line: precise sourcing, precise tolerances, precise delivery. It became the organizing idea for the language, the identity, and the way the site is structured — one word the whole company could stand behind.",
      },
    ],
  },
  {
    id: "brand-manifesto",
    label: "The Brand Manifesto: Articulating Vision",
    before: "The Brand ",
    accent: "Manifesto",
    after: ": Articulating Vision",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Before a logo or a layout, we wrote the brand down — a manifesto the team could use as a compass for every decision that followed.",
        ],
      },
      {
        kind: "note",
        kicker: "",
        body: "“We don’t make India the alternative to anywhere. We make India the source — precision built loop by loop, from the raw material to the finished part.”",
      },
      {
        kind: "paragraphs",
        items: [
          "It reframed Sevenloop from a vendor competing on price to a platform competing on reliability and control of the stack — a position the rest of the work could build on.",
        ],
      },
    ],
  },
  {
    id: "logo-redesign",
    label: "Logo Redesign: Symbolizing Partnership",
    before: "Logo Redesign: ",
    accent: "Symbolizing",
    after: " Partnership",
    blocks: [
      {
        kind: "subhead",
        title: "Out with the old",
        body: "The previous mark was generic — readable, but interchangeable with a hundred other industrial logos. It carried none of the platform story.",
      },
      {
        kind: "subhead",
        title: "In with the new: interlocking loops",
        body: "The new identity is built on interlocking loops — the supply chain closing on itself, partnership designed in. It scales from a favicon to a factory sign, reads in a single ink, and finally looks like the company behind it.",
      },
      {
        kind: "gallery",
        alt: "Sevenloop logo explorations",
        srcs: [
          "/assets/images/blog/logo-1.jpg",
          "/assets/images/blog/logo-2.jpg",
          "/assets/images/blog/logo-3.jpg",
        ],
      },
    ],
  },
  {
    id: "website-guide",
    label: "The Ultimate Guide to Selecting B2B Branding Agencies in India",
    before: "The ",
    accent: "Ultimate",
    after: " Guide to Selecting B2B Branding Agencies in India",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "The site was rebuilt on Webflow with one job: make a complex manufacturing platform feel simple to buy from. Three differentiators carry the experience.",
        ],
      },
      {
        kind: "subhead",
        title: "Core differentiator 01 — Own the whole stack",
        body: "Sourcing, factory technology, and execution presented as one continuous capability, not three services to assemble.",
      },
      {
        kind: "subhead",
        title: "Core differentiator 02 — Built for the buyer",
        body: "Every page answers a procurement question — tolerances, sectors, certifications, lead times — in the order a buyer actually asks them.",
      },
      {
        kind: "subhead",
        title: "Core differentiator 03 — A clear path to quote",
      },
      {
        kind: "rich",
        parts: [
          "A prominent ",
          { strong: "Get a Quote" },
          " flow turns interest into a structured brief, so the sales team starts every conversation with context already in hand.",
        ],
      },
    ],
  },
  {
    id: "website-architecture",
    label: "Website Architecture: Comprehensive Page Structure",
    before: "Website ",
    accent: "Architecture",
    after: ": Comprehensive Page Structure",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "The information architecture maps to how enterprise buyers evaluate a manufacturing partner.",
        ],
      },
      {
        kind: "arrows",
        items: [
          { lead: "Homepage", rest: "— the platform story in one scroll: positioning, proof, and a path to quote." },
          { lead: "Capabilities", rest: "— processes, materials, and tolerances, organized for fast scanning." },
          { lead: "Solutions", rest: "— outcomes framed by buyer problem, not by internal department." },
          { lead: "Industries", rest: "— defense, mining, metro, and automotive, each with relevant proof." },
          { lead: "Resources", rest: "— the depth that supports a considered B2B decision." },
          { lead: "Contact & Quote flow", rest: "— a structured brief that feeds straight into sales." },
        ],
      },
    ],
  },
  {
    id: "visual-identity",
    label: "Visual Identity: Custom Illustrations & Icons",
    before: "Visual Identity: ",
    accent: "Custom ",
    after: "Illustrations & Icons",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Rather than stock imagery, we built a custom system of illustrations and icons drawn from real manufacturing geometry — loops, tolerances, and machined forms. It gives every page a consistent, ownable texture and explains technical ideas without a wall of text.",
        ],
      },
      { kind: "image", src: "/assets/images/blog/identity.jpg", alt: "Custom illustration system" },
    ],
  },
  {
    id: "responsive-design",
    label: "Responsive Design: Excellence Across All Devices",
    before: "Responsive Design: Excellence Across ",
    accent: "All",
    after: " Devices",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Buyers move between a phone on the factory floor and a desktop in a procurement review. The site holds up across both.",
        ],
      },
      { kind: "subhead", title: "Mobile", body: "Quote flow and key capabilities are reachable in a thumb’s reach, with no loss of detail." },
      { kind: "subhead", title: "Tablet", body: "Two-column layouts keep dense technical content scannable in review settings." },
      { kind: "subhead", title: "Desktop", body: "The full platform narrative gets room to breathe, with generous type and deliberate pacing." },
    ],
  },
  {
    id: "brand-collaterals",
    label: "Brand Collaterals: Beyond the Website",
    before: "Brand ",
    accent: "Collaterals",
    after: ": Beyond the Website",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "A brand has to survive contact with the real world — a pitch room, a printed brochure, a trade-show booth. We extended the system across the touchpoints that close enterprise deals.",
        ],
      },
      {
        kind: "subhead",
        title: "Print",
        body: "A project brochure built for the hand-off moment of a sales conversation — capabilities, sectors, and proof, designed to be left behind and remembered.",
      },
      {
        kind: "subhead",
        title: "Pitch deck",
        body: "An investor- and buyer-ready deck that carries the same language and identity as the site, so the story never resets between channels.",
      },
      {
        kind: "subhead",
        title: "Marketing",
        body: "Templates and components that let the team produce on-brand material without a designer in the loop for every asset.",
      },
    ],
  },
  {
    id: "animation-motion",
    label: "Animation & Motion Design",
    before: "Animation & Motion ",
    accent: "Design",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Motion is where the manufacturing story comes alive — loops closing, parts assembling, precision made visible. The brand film and on-site motion were built by the same team that designed the identity, so the strategic thread held from static to moving image. The result reads as a true expression of the brand, not a generic explainer.",
        ],
      },
      { kind: "image", src: "/assets/images/blog/motion.jpg", alt: "Brand film still" },
    ],
  },
  {
    id: "project-team",
    label: "The Project Team: Expertise Across Disciplines",
    before: "The Project Team: Expertise",
    accent: " Across",
    after: " Disciplines",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Sevenloop was delivered by a cross-functional team, many of whom had already worked on Ximkart and Revind — so the strategic context carried forward from day one.",
        ],
      },
      { kind: "subhead", title: "Design leadership" },
      {
        kind: "arrows",
        items: [
          { lead: "Ekta Manchanda", rest: "— Co-Founder, Principal Designer" },
          { lead: "Tanmaya Rao", rest: "— Lead Brand Designer, Illustrator" },
        ],
      },
      { kind: "subhead", title: "Content & strategy" },
      {
        kind: "arrows",
        items: [
          { lead: "Mejo Kuriachan", rest: "— Partner, Brand Strategist" },
          { lead: "Athira Krishnan", rest: "— Lead Designer, Content Strategist" },
        ],
      },
      { kind: "subhead", title: "Development" },
      {
        kind: "arrows",
        items: [
          { lead: "Saurabh Chakradhari", rest: "— Head of Webflow" },
          { lead: "Burhan Upad", rest: "— Webflow Developer" },
        ],
      },
      { kind: "subhead", title: "Motion & 3D" },
      {
        kind: "arrows",
        items: [
          { lead: "Tejus Yakhob", rest: "— Creative Director, Films" },
          { lead: "Yugankita Aich", rest: "— Associate Editor, Films" },
        ],
      },
      { kind: "subhead", title: "Project management" },
      {
        kind: "arrows",
        items: [
          { lead: "Arpan Sen", rest: "— Chief of Staff, Project Manager" },
          { lead: "Akshay A D", rest: "— Project Manager" },
        ],
      },
    ],
  },
  {
    id: "the-process",
    label: "The Process: From Research to Launch",
    before: "The Process: From Research to",
    accent: " Launch",
    blocks: [
      { kind: "paragraphs", items: ["Five months, five phases — each with a clear exit before the next began."] },
      {
        kind: "rows",
        items: [
          { label: "Weeks 1–3", value: "Discovery — Interviews, sales-call analysis, competitive audit, positioning brief." },
          { label: "Weeks 4–6", value: "Strategy — Manifesto, messaging hierarchy, naming and language system." },
          { label: "Weeks 7–11", value: "Identity — Logo, color, type, illustration and icon system." },
          { label: "Weeks 12–18", value: "Build — Webflow design and development, content, responsive QA." },
          { label: "Weeks 19–20", value: "Launch — Collateral, brand film, hand-off, and go-live." },
        ],
      },
    ],
  },
  {
    id: "service-delivery",
    label: "Comprehensive Service Delivery",
    before: "Comprehensive Service ",
    accent: "Delivery",
    blocks: [
      { kind: "paragraphs", items: ["One team, one accountable scope — brand and build under the same roof."] },
      {
        kind: "arrows",
        items: [
          { lead: "Brand strategy", rest: "— Positioning, manifesto, messaging, naming." },
          { lead: "Visual identity", rest: "— Logo, color, type, illustration, iconography." },
          { lead: "Website", rest: "— UX, design, and Webflow development." },
          { lead: "Collateral", rest: "— Brochure, pitch deck, marketing templates." },
          { lead: "Motion", rest: "— Brand film and on-site animation." },
        ],
      },
    ],
  },
  {
    id: "the-results",
    label: "The Results: Measurable Impact",
    before: "The ",
    accent: "Results",
    after: ": Measurable Impact",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "The clearest result is qualitative and came straight from the founder: client conversations got easier. Beyond that, the brand now does work it couldn’t before — opening enterprise doors, supporting fundraising, and giving the sales team a credible first impression to lead with.",
        ],
      },
      { kind: "subhead", title: "What changed" },
      {
        kind: "arrows",
        items: [
          { rest: "A site that reads as enterprise-ready to procurement and investors alike." },
          { rest: "A structured quote flow that starts every sales conversation with context." },
          { rest: "A coherent brand system that extends cleanly to print, deck, and film." },
        ],
      },
    ],
  },
  {
    id: "key-takeaways",
    label: "Key Takeaways: Lessons from the Sevenloop Transformation",
    before: "Key ",
    accent: "Takeaways",
    after: ": Lessons from the Sevenloop Transformation",
    blocks: [
      { kind: "paragraphs", items: ["One team, one accountable scope — brand and build under the same roof."] },
      {
        kind: "arrows",
        items: [
          { lead: "01 — Find the true story, don’t invent one.", rest: "The strongest positioning was already inside the business." },
          { lead: "02 — One organizing idea beats ten features.", rest: "“Precision” aligned language, identity, and structure." },
          { lead: "03 — Brand and build belong together.", rest: "One team kept the thread from strategy to Webflow to film." },
          { lead: "04 — Design for the buyer’s questions.", rest: "Architecture should mirror how the decision actually gets made." },
          { lead: "05 — Continuity compounds.", rest: "A returning team starts the next project miles ahead." },
        ],
      },
    ],
  },
  {
    id: "looking-forward",
    label: "Looking Forward: Building on Success",
    before: "Looking Forward: ",
    accent: "Building",
    after: " on Success",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "The relationship didn’t end at launch. Sevenloop returned for a homepage revamp and the brand film, and the founder referred us to their investors for a new engagement — the model we work best in: deep partnerships where each project builds on the last.",
        ],
      },
    ],
  },
  {
    id: "why-this-matters",
    label: "Why This Matters: The Bigger Picture",
    before: "Why This ",
    accent: "Matters",
    after: ": The Bigger Picture",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "Indian manufacturing is at an inflection point, and the companies that win global trust will be the ones that can communicate as precisely as they engineer. Sevenloop is a small proof of a larger thesis: world-class capability deserves world-class brand, and the gap between the two is where deals are won or lost.",
        ],
      },
    ],
  },
  {
    id: "final-thoughts",
    label: "Final Thoughts",
    before: "Final ",
    accent: "Thoughts",
    blocks: [
      {
        kind: "paragraphs",
        items: [
          "A rebrand is only as good as the conversations it changes. By that measure, Sevenloop worked — the brand now carries the credibility, and the team gets to spend its time on the work. That is the whole job.",
        ],
      },
      { kind: "subhead", title: "Project information" },
      {
        kind: "rows",
        items: [
          { label: "Client", value: "Sevenloop" },
          { label: "Industry", value: "Manufacturing Solutions" },
          { label: "Timeline", value: "5 Months" },
          { label: "Agency", value: "Design Asylum" },
        ],
      },
      {
        kind: "links",
        kicker: "Contact",
        items: [
          { href: "mailto:hello@designasylum.in", label: "hello@designasylum.in" },
          { href: "tel:+918547807934", label: "+91 85478 07934" },
          { href: "https://www.designasylum.in", label: "www.designasylum.in" },
        ],
      },
    ],
  },
];

export const sevenloopFaqItems: FaqItem[] = [
  {
    question: "How much does a B2B website design project typically cost?",
    answer:
      "It depends on scope — a focused redesign sits in one range, a full brand-plus-Webflow build like Sevenloop sits in another. The honest answer is that cost tracks complexity: number of templates, depth of strategy, custom illustration, motion, and collateral. We scope every project against the outcome you need, then quote a fixed engagement so there are no surprises mid-build.",
  },
  { question: "Can a B2B branding agency help with website design?" },
  { question: "Can one agency handle branding and Webflow development?" },
];

export const sevenloopTopics = [
  "Website redesign services",
  "Website redesign",
  "B2B SaaS website redesign agency",
  "Website revamp for B2B SaaS",
  "Website redesign for Series A startup",
];
