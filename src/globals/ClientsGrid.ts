import type { GlobalConfig } from "payload";

export const ClientsGridGlobal: GlobalConfig = {
  slug: "clients-grid",
  label: "8 in 10 Clients Grid",
  access: { read: () => true },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "8 in 10 clients come back for more.",
      admin: {
        description:
          "Section headline. Default: '8 in 10 clients come back for more.'",
      },
    },
    {
      name: "subheading",
      type: "textarea",
      defaultValue:
        "Once people work with us, they tend to keep working with us. The number we’re quietly proud of.",
      admin: {
        description: "Section subtitle.",
      },
    },
    {
      name: "cards",
      type: "array",
      label: "Client Cards",
      labels: {
        singular: "Card",
        plural: "Cards",
      },
      minRows: 0,
      admin: {
        description:
          "Assign logos from the 1st section (Client Logos) and specify each client's project count. Cards are displayed in a 4-column grid.",
      },
      fields: [
        {
          name: "logo",
          type: "relationship",
          relationTo: "client-logos",
          required: true,
          admin: {
            description: "Select a logo uploaded in Client Logos.",
          },
        },
        {
          name: "count",
          type: "number",
          required: true,
          defaultValue: 4,
          min: 1,
          admin: {
            description:
              "Project count shown below the logo. E.g. enter 3 to display '3 & Counting', or 2 to display '2 & Counting'.",
          },
        },
        {
          name: "customDescription",
          type: "text",
          admin: {
            description:
              "Optional description override. Leave empty to automatically display '{count} & Counting'.",
          },
        },
      ],
    },
  ],
};
