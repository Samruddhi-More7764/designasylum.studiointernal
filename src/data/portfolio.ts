// Portfolio grid — Frame 8.png. All six cards carry the same placeholder
// caption in Figma ("DirectMeds — Branding & Website Design"); images differ.
export interface PortfolioItem {
  name: string;
  category: string;
  image: string;
  alt: string;
  href: string;
}

const href = "/clients/sevenloop";

export const portfolioItems: PortfolioItem[] = [
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-pink-fluid.png",
    alt: "Abstract pink fluid with red organic shapes",
    href,
  },
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-plant-glass.png",
    alt: "Dark leaves and roots suspended in a glass vessel",
    href,
  },
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-foam-circle.png",
    alt: "Circular dish filled with white foam bubbles",
    href,
  },
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-women-faces.png",
    alt: "Two women's faces close together with red and pink lipstick",
    href,
  },
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-black-plant.png",
    alt: "Black-and-white macro of a spidery dried seed head",
    href,
  },
  {
    name: "DirectMeds",
    category: "Branding & Website Design",
    image: "/assets/images/portfolio-bubbles-bottle.png",
    alt: "Glass bottle surrounded by floating iridescent bubbles",
    href,
  },
];
