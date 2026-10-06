export const workFilters = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion & Beauty" },
  { id: "health", label: "Health & Wellness" },
  { id: "technology", label: "Technology & Innovation" },
  { id: "finance", label: "Finance & Business" },
  { id: "home", label: "Home & Living" },
  { id: "industry", label: "Industry & Sustainability" },
] as const;

export type WorkFilterId = (typeof workFilters)[number]["id"];

export const workProjects = [
  {
    id: "red-cells",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/01.png",
    category: "technology" as const,
  },
  {
    id: "plant",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/02.png",
    category: "home" as const,
  },
  {
    id: "foam",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/03.png",
    category: "health" as const,
  },
  {
    id: "portraits",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/04.png",
    category: "fashion" as const,
  },
  {
    id: "dandelion",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/05.png",
    category: "industry" as const,
  },
  {
    id: "bottle",
    name: "DirectMeds",
    service: "Branding & Website Design",
    image: "/assets/images/work/06.png",
    category: "finance" as const,
  },
];
