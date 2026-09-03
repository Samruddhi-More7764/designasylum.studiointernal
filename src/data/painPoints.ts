// Pain points — Container (Nivaro - Framer Template).png. All three cards
// are identical placeholders in the Figma file.
export interface PainPoint {
  tag: string;
  quote: string;
  resolution: string;
}

const card: PainPoint = {
  tag: "Cyber Security",
  quote:
    "We can\u2019t convey what the brand stands for, and it\u2019s costing us the talent we want.",
  resolution:
    "Design Asylum worked with Fortuna to drag the brand up to the pace of the industry while keeping the depth that attracts better people.",
};

export const painPoints: PainPoint[] = [card, card, card];
