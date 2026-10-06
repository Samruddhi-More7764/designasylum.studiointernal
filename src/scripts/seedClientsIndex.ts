import { getPayload } from "payload";
import config from "@payload-config";
import { clientCards, clientsHeading } from "../data/clientsIndexPage";

async function seedClientsIndex() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "clients-index" as "site-footer",
    data: {
      breadcrumbCurrent: "Clients",
      heading: clientsHeading,
      cards: clientCards.map((card) => ({
        name: card.name,
        service: card.service,
      })),
    },
  } as Parameters<typeof payload.updateGlobal>[0]);

  payload.logger.info("Clients page CMS prefilled. Card URLs and photos were left empty.");
  process.exit(0);
}

seedClientsIndex().catch((error) => {
  console.error(error);
  process.exit(1);
});
