// Featured Projects — Frame 2095587764.png. All four rows carry identical
// placeholder copy in the Figma file ("Northwind" / 41%); only the images
// differ. Kept verbatim — do not invent real content until the client
// supplies it.
export interface FeaturedProject {
  name: string;
  description: string;
  metric: string;
  metricLabel: string;
  image: string;
  alt: string;
  href: string;
}

const description =
  "A heritage law firm, repositioned with teeth. New name, new voice, a brand that argues its own case.";
const metricLabel = "Rise in inbound briefs in the year after relaunch";
const href = "/clients/sevenloop";

export const featuredProjects: FeaturedProject[] = [
  {
    name: "Northwind",
    description,
    metric: "41%",
    metricLabel,
    image: "/assets/images/project-plant-glass.png",
    alt: "Dark leaves and roots suspended in a glass vessel",
    href,
  },
  {
    name: "Northwind",
    description,
    metric: "41%",
    metricLabel,
    image: "/assets/images/project-bubbles-bottle.png",
    alt: "Glass bottle surrounded by floating iridescent bubbles",
    href,
  },
  {
    name: "Northwind",
    description,
    metric: "41%",
    metricLabel,
    image: "/assets/images/project-foam-circle.png",
    alt: "Circular dish filled with white foam bubbles",
    href,
  },
  {
    name: "Northwind",
    description,
    metric: "41%",
    metricLabel,
    image: "/assets/images/project-pink-fluid.png",
    alt: "Abstract pink fluid with red organic shapes",
    href,
  },
];
