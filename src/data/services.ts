// Services — Homepage Frame 2095588027 / updated Services section.
// Six cards in a 3×2 grid; subtext is identical across cards in Figma.
export type ServiceIcon = "stack" | "grid";

export interface Service {
  name: string;
  tags: string[];
  icon: ServiceIcon;
}

export const services: Service[] = [
  {
    name: "Brand strategy",
    tags: ["UX", "UI", "Art direction"],
    icon: "stack",
  },
  {
    name: "Website design",
    tags: ["UX", "UI", "Art direction"],
    icon: "stack",
  },
  {
    name: "Film & animation",
    tags: ["UX", "UI", "Art direction"],
    icon: "stack",
  },
  {
    name: "Brand & identity",
    tags: ["UX", "UI", "Art direction"],
    icon: "stack",
  },
  {
    name: "Website development",
    tags: ["UX", "UI", "Art direction"],
    icon: "grid",
  },
  {
    name: "Brand campaigns",
    tags: ["UX", "UI", "Art direction"],
    icon: "stack",
  },
];
