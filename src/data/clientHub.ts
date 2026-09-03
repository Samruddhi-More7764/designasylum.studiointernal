export const clientHubNavItems = [
  { id: "about-client", label: "About Client" },
  { id: "logo-design", label: "Logo Design" },
  { id: "website-design", label: "Website Design & Development" },
  { id: "project-brochure", label: "Project Brochure" },
  { id: "brand-video", label: "Brand Video" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
  { id: "case-study", label: "Case Study" },
] as const;

export type ClientHubNavId = (typeof clientHubNavItems)[number]["id"];

export const sevenloopAbout = {
  italic: "About",
  rest: "Client",
  body: "Sevenloop is a Bengaluru-based custom metal manufacturing platform that owns the full supply chain stack — from raw materials sourcing across 20+ countries through factory technology to execution. Founded by Sharan Urubail (ex-Tata Motors, ex-Udaan) and backed by Z47 at the seed stage, Sevenloop produces precision-engineered components for defense, mining, metro, and automotive sectors, serving global clients including Komatsu, Hydac, and Jindal. Their Ximkart platform builds reliability and pricing power for Indian factories, positioning India not as a China alternative but as a global manufacturing leader.",
  websiteHref: "https://sevenloop.com",
};

export const sevenloopLogoDesign = {
  italic: "Logo",
  rest: "Design",
  images: [
    {
      src: "/assets/images/client-hub/logo-1.jpg",
      alt: "Sevenloop logo on dark abstract background",
    },
    {
      src: "/assets/images/client-hub/logo-2.jpg",
      alt: "Arclap wordmark on red gradient",
    },
    {
      src: "/assets/images/client-hub/logo-3.jpg",
      alt: "Geometric logo on orange architectural fins",
    },
  ],
};

export const sevenloopWebsiteDesign = {
  italic: "Website",
  rest: "Design & Development",
  image: {
    src: "/assets/images/client-hub/website-design.jpg",
    alt: "Sevenloop website design preview",
  },
};

export const sevenloopProjectBrochure = {
  // Figma: "Project" is plain Figtree; "Brochure" is the Playfair italic span.
  rest: "Project",
  italic: "Brochure",
  images: [
    {
      src: "/assets/images/client-hub/project-brochure-1.jpg",
      alt: "Sevenloop project brochure spread 1",
    },
    {
      src: "/assets/images/client-hub/project-brochure-2.jpg",
      alt: "Sevenloop project brochure spread 2",
    },
  ],
};

export const sevenloopBrandVideo = {
  italic: "Brand",
  rest: "Video",
  image: {
    src: "/assets/images/client-hub/brand-video.jpg",
    alt: "Sevenloop brand video preview",
  },
};

export const sevenloopBehindTheScenes = {
  italic: "Behind",
  rest: "The Scenes",
  images: [
    {
      src: "/assets/images/client-hub/behind-the-scenes.jpg",
      alt: "Behind the scenes photo 1",
    },
    {
      src: "/assets/images/client-hub/behind-the-scenes.jpg",
      alt: "Behind the scenes photo 2",
    },
    {
      src: "/assets/images/client-hub/behind-the-scenes.jpg",
      alt: "Behind the scenes photo 3",
    },
  ],
};

export const sevenloopCaseStudy = {
  // Figma: "Case" is plain Figtree; "Study" is the Playfair italic span.
  rest: "Case",
  italic: "Study",
  subheading:
    "Read the full 5-month story repositioning, identity, the Webflow build, and the conversations it opened.",
  href: "/clients/sevenloop/case-study",
};

export const sevenloopPartnership = {
  label: "The Partnership",
  // Figma: "How Design Asylum helped" is Figtree regular; "Sevenloop" is the
  // Playfair italic span (client name treated as the accent word).
  heading: "How Design Asylum helped",
  headingAccent: "Sevenloop",
  paragraphs: [
    "Sevenloop is actually the third branding project Design Asylum did in this ecosystem — and the biggest of the three. The first was Ximkart (Sevenloop's sourcing platform), the second was Revind.ai, and Sevenloop itself is the parent brand. That history matters because it means Design Asylum didn't come to this project cold; they understood the business, the market, and the founder's vision intimately.",
    "Sharan, Sevenloop's founder, is a long-standing partner who keeps coming back — and who has since referred Design Asylum to their investors Z47 (previously Matrix Partners India), a project currently in progress. That referral chain tells you something about the quality of the relationship.",
    "The branding challenge was positioning a company at a fascinating intersection: old-world metal manufacturing meets AI-driven engineering. Sevenloop uses artificial intelligence to power custom manufacturing across aerospace, automotive, mining, and industrial machinery, operating with 150+ manufacturing partners across India, the US, Germany, Italy, the Netherlands, and the UK. The brand needed to speak to procurement heads and innovation officers with equal authority.",
    "Design Asylum delivered a comprehensive brand strategy — logo, visual identity, website at sevenloop.com built on Webflow, a project brochure for enterprise sales conversations, and a brand video. Something Sharan particularly valued was the team continuity: Tanmaya, who had designed the Ximkart logo and brand under Ekta's design leadership, returned for the Sevenloop project alongside Mejo, who had crafted the original Ximkart messaging. When Sharan came back years later for the Sevenloop brand, having the same core team meant the strategic context, brand essence, and mission understanding carried forward seamlessly. Tanmaya's deep expertise in the manufacturing, metals, and mechanical space — built across Ximkart, Revind, Sevenloop, and other industrial clients — made the design direction sharper and more informed from day one.",
    "That team continuity paid off especially on the brand video. Because Tanmaya, Ekta, and Mejo already understood Sevenloop's brand essence and mission deeply, the brand film came out as a true expression of the brand — not just another explainer video or generic brand film, but something that captured the manufacturing story with conviction and purpose. This is a pattern clients consistently appreciate about Design Asylum: the same people who build the brand are the ones who extend it across new formats and touchpoints, so the strategic thread never gets lost.",
    "The relationship continues to grow — after the initial website and branding, Sevenloop came back for a homepage revamp and the brand video. Building the Sevenloop brand isn't a one-off project; it's an ongoing collaboration. That's the model Design Asylum works best in: deep partnerships where each engagement builds on the last, and the brand strategy evolves alongside the business.",
  ],
};

export const sevenloopTransformation = {
  heading: "Transformation",
  subtext:
    "Drag to compare the old Sevenloop site against the Webflow rebuild.",
  before: {
    src: "/assets/images/client-hub/transformation-before.jpg",
    alt: "Sevenloop website before the Webflow rebuild",
  },
  after: {
    src: "/assets/images/client-hub/transformation-after.jpg",
    alt: "Sevenloop website after the Webflow rebuild",
  },
};

export const sevenloopProjectTeam = {
  heading: "Project Team",
  subheading:
    "The same core team across Ximkart, Revind and Sevenloop — strategy, design, film and build under one roof.",
  // All 6 cards share the same placeholder photo, name, role, and CTA per spec.
  members: Array.from({ length: 6 }, () => ({
    photo: {
      src: "/assets/images/client-hub/team-member.jpg",
      alt: "Tanmaya Rao",
    },
    name: "Tanmaya Rao",
    role: "Lead Brand Designer | Illustrator",
  })),
};
