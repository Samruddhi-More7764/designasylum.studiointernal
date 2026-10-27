import type { Field } from "payload";

/** Homepage row → a single Case study; URL is built from the study + its client. */
export const homepageStudyLink: Field = {
  name: "caseStudy",
  type: "relationship",
  relationTo: "case-studies",
  required: false,
  admin: {
    description:
      "Row opens this case study — /clients/{client}/{study}. If omitted, opens the client profile.",
  },
};

