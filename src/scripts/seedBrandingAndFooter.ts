import "dotenv/config";
import { getPayload } from "payload";
import config from "@payload-config";
import { FOOTER_COLUMNS } from "../data/footer";

const footerFields = {
  Work: "work",
  Company: "company",
  Solutions: "solutions",
  Services: "services",
  Industries: "industries",
  Studio: "studio",
} as const;

async function seedPageCms() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "site-footer",
    data: Object.fromEntries(
      Object.entries(footerFields).map(([title, field]) => {
        const column = FOOTER_COLUMNS.find((item) => item.title === title);
        return [
          field,
          (column?.links ?? []).map((link) => ({
            label: link.label,
          })),
        ];
      }),
    ),
  });

  payload.logger.info("Footer lists seeded.");
  process.exit(0);
}


seedPageCms().catch((error) => {
  console.error(error);
  process.exit(1);
});
