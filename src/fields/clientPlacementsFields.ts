import type { Field } from "payload";

const placementToggled = (
  section: string,
): ((data: unknown, siblingData: Record<string, unknown>) => boolean) => {
  return (_data, siblingData) => Boolean(siblingData?.[section]);
};

export const clientPlacementsFields: Field[] = [
  {
    name: "placements",
    type: "group",
    label: "Website Placements",
    admin: {
      description:
        "Select where this client appears across the website. Saving automatically syncs with the individual sections.",
    },
    fields: [
      {
        name: "featuredProject",
        type: "group",
        label: "Featured Project (Homepage Hero Carousel)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Feature this client in the Homepage Featured Projects carousel",
            defaultValue: false,
          },
          {
            name: "metric",
            type: "text",
            label: "Metric headline",
            admin: {
              condition: placementToggled("enabled"),
              description: "Highlight figure, e.g. “10x”, “300%”, “#1”.",
            },
          },
          {
            name: "metricLabel",
            type: "text",
            label: "Metric label",
            admin: {
              condition: placementToggled("enabled"),
              description: "Description of the metric, e.g. “Conversion rate increase”.",
            },
          },
          {
            name: "description",
            type: "textarea",
            label: "Short project summary",
            admin: {
              condition: placementToggled("enabled"),
              description: "1-2 sentences explaining what was built or achieved.",
            },
          },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Featured image",
            filterOptions: { mimeType: { contains: "image" } },
            admin: {
              condition: placementToggled("enabled"),
              description: "Landscape hero visual for the card.",
            },
          },
          {
            name: "alt",
            type: "text",
            label: "Image alt text",
            admin: {
              condition: placementToggled("enabled"),
            },
          },
          {
            name: "order",
            type: "number",
            label: "Display order",
            defaultValue: 0,
            admin: {
              condition: placementToggled("enabled"),
              description: "Lower numbers appear first.",
            },
          },
        ],
      },
      {
        name: "portfolioItem",
        type: "group",
        label: "Portfolio Item (Homepage Grid)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Show this client in the Homepage Portfolio grid",
            defaultValue: false,
          },
          {
            name: "category",
            type: "text",
            label: "Portfolio category tag",
            admin: {
              condition: placementToggled("enabled"),
              description: "e.g. “UI/UX & Web”, “Branding”, “Packaging”.",
            },
          },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Portfolio image",
            filterOptions: { mimeType: { contains: "image" } },
            admin: {
              condition: placementToggled("enabled"),
            },
          },
          {
            name: "alt",
            type: "text",
            label: "Image alt text",
            admin: {
              condition: placementToggled("enabled"),
            },
          },
          {
            name: "order",
            type: "number",
            label: "Display order",
            defaultValue: 0,
            admin: {
              condition: placementToggled("enabled"),
              description: "Lower numbers appear first.",
            },
          },
        ],
      },
      {
        name: "painPoint",
        type: "group",
        label: "Pain Point (Homepage Why Choose Us Carousel)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Feature as a challenge & resolution card",
            defaultValue: false,
          },
          {
            name: "tag",
            type: "text",
            label: "Service / Challenge tag",
            admin: {
              condition: placementToggled("enabled"),
              description: "e.g. “B2B Website Redesign”, “E-Commerce Conversion”.",
            },
          },
          {
            name: "quote",
            type: "textarea",
            label: "Client dilemma / quote",
            admin: {
              condition: placementToggled("enabled"),
              description: "What problem was the client facing before Design Asylum?",
            },
          },
          {
            name: "resolution",
            type: "textarea",
            label: "Design Asylum resolution",
            admin: {
              condition: placementToggled("enabled"),
              description: "How Design Asylum solved this challenge.",
            },
          },
          {
            name: "order",
            type: "number",
            label: "Display order",
            defaultValue: 0,
            admin: {
              condition: placementToggled("enabled"),
              description: "Lower numbers appear first.",
            },
          },
        ],
      },
      {
        name: "homepageCaseStudy",
        type: "group",
        label: "Homepage Case Study (Ranked Numbered List)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Show in the Homepage ranked case study list",
            defaultValue: false,
          },
          {
            name: "caseStudy",
            type: "relationship",
            relationTo: "case-studies",
            label: "Target case study",
            admin: {
              condition: placementToggled("enabled"),
              description:
                "Select which study this homepage item points to. Defaults to the client’s featured study.",
            },
          },
          {
            name: "number",
            type: "text",
            label: "List number (e.g. 01, 02)",
            admin: {
              condition: placementToggled("enabled"),
              description:
                "Numbered prefix displayed next to the project name in the homepage list (e.g. “01”, “02”).",
            },
          },
          {
            name: "description",
            type: "textarea",
            label: "Short summary",
            admin: {
              condition: placementToggled("enabled"),
              description: "Brief summary shown on the right side of the row.",
            },
          },
          {
            name: "tags",
            type: "array",
            label: "Category Tags (Pills below summary)",
            labels: {
              singular: "Tag",
              plural: "Tags",
            },
            admin: {
              condition: placementToggled("enabled"),
              description:
                "Pill tags displayed under the summary, e.g. 'BRANDING', 'DEVELOPMENT'. Click 'Add Tag' to add tags, or the trash icon to remove.",
            },
            fields: [
              {
                name: "label",
                type: "text",
                required: true,
                label: "Tag name",
              },
            ],
          },
          {
            name: "order",
            type: "number",
            label: "Display order",
            defaultValue: 0,
            admin: {
              condition: placementToggled("enabled"),
              description: "Lower numbers appear first.",
            },
          },
        ],
      },
      {
        name: "clientsPage",
        type: "group",
        label: "Clients Directory (/clients)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Include on the /clients directory page",
            defaultValue: false,
          },
          {
            name: "service",
            type: "text",
            label: "Service line",
            admin: {
              condition: placementToggled("enabled"),
              description: "e.g. “Brand Identity, Web Design”.",
            },
          },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Card thumbnail",
            filterOptions: { mimeType: { contains: "image" } },
            admin: {
              condition: placementToggled("enabled"),
            },
          },
        ],
      },
      {
        name: "workPage",
        type: "group",
        label: "Work Portfolio (/work)",
        fields: [
          {
            name: "enabled",
            type: "checkbox",
            label: "Include on the /work portfolio page",
            defaultValue: false,
          },
          {
            name: "service",
            type: "text",
            label: "Service line",
            admin: {
              condition: placementToggled("enabled"),
              description: "e.g. “B2B Website Redesign”.",
            },
          },
          {
            name: "category",
            type: "select",
            label: "Industry category",
            options: [
              { label: "Fashion & Beauty", value: "fashion" },
              { label: "Health & Wellness", value: "health" },
              { label: "Technology & Innovation", value: "technology" },
              { label: "Finance & Business", value: "finance" },
              { label: "Home & Living", value: "home" },
              { label: "Industry & Sustainability", value: "industry" },
            ],
            admin: {
              condition: placementToggled("enabled"),
              description: "Which industry tab this project appears under.",
            },
          },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Card image",
            filterOptions: { mimeType: { contains: "image" } },
            admin: {
              condition: placementToggled("enabled"),
            },
          },
        ],
      },
    ],
  },
];
