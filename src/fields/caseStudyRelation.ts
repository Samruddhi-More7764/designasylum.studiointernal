import type { Field } from "payload";

/** Hub section → a case study owned by this client. */
export const caseStudyRelation = (description: string): Field => ({
  name: "caseStudy",
  type: "relationship",
  relationTo: "case-studies",
  admin: {
    description,
    allowCreate: true,
  },
  filterOptions: ({ id, data }) => {
    const clientId = id ?? data?.id;
    if (clientId == null) return true;
    return { client: { equals: clientId } };
  },
});
