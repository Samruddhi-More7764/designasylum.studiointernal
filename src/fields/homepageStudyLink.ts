import type { Field } from "payload";

/** Homepage row → a single Case study; URL is built from the study + its client. */
export const homepageStudyLink: Field = {
  name: "caseStudy",
  type: "relationship",
  relationTo: "case-studies",
  required: true,
  admin: {
    description:
      "Row opens this case study — /clients/{client}/{study}. Pick the project itself, not the brand.",
  },
};
