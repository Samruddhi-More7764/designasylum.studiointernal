// Sevenloop case study — Figma: heading + breadcrumb + hero image.
export const sevenloopCaseStudyHero = {
  heading: "Sevenloop — Branding and project brochure design",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "clients", href: "/clients/sevenloop" },
    { label: "sevenloop", href: "/clients/sevenloop" },
  ],
  breadcrumbCurrent: "Branding",
  image: {
    src: "/assets/images/client-hub/case-study-hero.jpg",
    alt: "Sevenloop branding and project brochure design preview",
  },
};

// Sevenloop case study — pull-quote + "Details" fact table.
// NOTE: Industries / Headquarters / Target Audience have no value in Figma
// — they render as a plain "-" placeholder.
export const sevenloopCaseStudyDetails = {
  quote:
    "We wrote four thousand words on how that film actually got made. The brief, the dead ends, the bit we’d never do again. Worth a read.",
  tableHeading: "Details",
  rows: [
    { label: "Client", value: "Sevenloop" },
    { label: "Funding", value: "Seed Funding" },
    { label: "Lead Investors", value: "Matrix Partners, Better" },
    { label: "Industries", value: "-" },
    { label: "Headquarters", value: "-" },
    { label: "Target Audience", value: "-" },
  ],
};

// Sevenloop case study — 4 full-bleed gallery images, each 1350×759 with
// 13.98px radius, stacked one per section.
export const sevenloopCaseStudyGallery = [
  {
    src: "/assets/images/client-hub/case-study-gallery-1.jpg",
    alt: "Sevenloop case study gallery image 1",
  },
  {
    src: "/assets/images/client-hub/case-study-gallery-2.jpg",
    alt: "Sevenloop case study gallery image 2",
  },
  {
    src: "/assets/images/client-hub/case-study-gallery-3.jpg",
    alt: "Sevenloop case study gallery image 3",
  },
  {
    src: "/assets/images/client-hub/case-study-gallery-4.jpg",
    alt: "Sevenloop case study gallery image 4",
  },
];

// Sevenloop case study — "View all clients" CTA below the gallery.
// No dedicated clients-index page exists yet, so this links back home.
export const sevenloopCaseStudyViewAllClients = {
  label: "View All Clients",
  href: "/",
};
