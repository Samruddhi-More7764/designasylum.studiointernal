export const studioHero = {
  breadcrumb: "Why Design Asylum",
  before: "We make B2B websites that communicate your value proposition in the most",
  accent: "compelling",
  after: " way",
  image: "/assets/images/studio/hero.png",
};

export const studioTestimonial = {
  image: "/assets/images/studio/testimonial.png",
  quote:
    "“Our entire experience, from design concept to the final product was glitch-free. Conversations with our clients have become so much more easier now.”",
  name: "Sharan Urubail R",
  role: "Masify Co-Founder",
  chips: [
    { label: "Series A", value: "$2.4M" },
    { label: "Deep Tech", value: "$3.3M" },
    { label: "Cybersecurity Global", value: "" },
    { label: "Insur-Tech", value: "$3.97M" },
  ],
};

export const studioProjectsHeading = { before: "Featured ", accent: "Projects" };

export const studioProjects = Array.from({ length: 6 }, (_, index) => ({
  id: `northwind-${index + 1}`,
  name: "Northwind",
  body: "A heritage law firm, repositioned with teeth. New name, new voice, a brand that argues its own case.",
  image: "/assets/images/studio/project.png",
  href: "",
}));

export const studioFit = {
  before: "We’re the ",
  accent: "right",
  after: " fit if you...",
  cards: [
    "Require on time delivery (this means you can go live quicker and start selling sooner)",
    "You're looking for a team that understands branding and how to take it forward on the website",
    "Follow universal good work ethics hire thoughtfully, let them do their job and not micro-manage",
  ],
};

export const studioMiss = {
  before: "We’re ",
  accent: "not",
  after: " the right fit if you...",
  cards: [
    "Are an early stage startup and think branding is expensive",
    "Need everything done in 3 weeks, but need 1 week to provide feedback",
    "haven't prioritized website for your business and hence tight on budget",
  ],
};

export const studioTeam = {
  before: "The team that’s making B2B ",
  accent: "interesting",
  people: [
    "Tanmaya Rao",
    "Meet Mejo",
    "Meet Sanjana",
    "Meet Tanmaya",
    "Meet Athira",
    "Meet Akhilesh",
    "Meet Arpan",
    "Meet Swathi",
  ].map((name, index) => ({
    name,
    image: `/assets/images/studio/person-${index}.png`,
  })),
};

export const studioOffer = {
  heading: "Want a no-brainer offer?",
  offer: "See the offer",
  intro: "Book an intro",
  introHref: "/#talk",
};
