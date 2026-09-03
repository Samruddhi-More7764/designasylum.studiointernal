// Case studies — Group 12.png. All four rows are identical placeholders
// in the Figma file (numbered "(01)" on every row, same copy and tags).
export interface CaseStudy {
  number: string;
  name: string;
  description: string;
  tags: string[];
}

const row: CaseStudy = {
  number: "(01)",
  name: "Cloudphys",
  description:
    "Visual branding and website design for an AI-powered platform that sharpens critical-care monitoring.",
  tags: [
    "Website Strategy",
    "Website Design",
    "Explainer Film",
    "Webflow Build",
  ],
};

export const caseStudies: CaseStudy[] = [row, row, row, row];
