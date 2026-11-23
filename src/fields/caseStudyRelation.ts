import type { Field } from "payload";

/**
 * Hub section → an existing case study.
 * Do not create the study from this field. Payload validates the new id before
 * the row is visible, then the admin opens that id and reports it was not found.
 */
export const caseStudyRelation = (description: string): Field => ({
  name: "caseStudy",
  type: "relationship",
  relationTo: "case-studies",
  admin: {
    allowCreate: false,
    description: `${description} Save the case study under Case studies first, then select it here.`,
  },
});
