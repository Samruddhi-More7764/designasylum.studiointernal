import Image from "next/image";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { getClientsGridData, type ReturningClientCard } from "@/cms/content";

function renderHeading(heading: string) {
  if (heading.includes("come back")) {
    const parts = heading.split("come back");
    return (
      <>
        {parts[0]}
        <Accent>come back</Accent>
        {parts.slice(1).join("come back")}
      </>
    );
  }
  return heading;
}

function ClientCard({ item }: { item: ReturningClientCard }) {
  // Desktop: h-[374px]. Mobile: shorter card, same logo + dynamic description (e.g. "4 & Counting", "3 & Counting").
  return (
    <div className="flex h-[200px] flex-col overflow-hidden rounded-xl border border-hairline bg-white sm:h-[260px] lg:h-[374px]">
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-10">
        <Image
          src={item.image}
          alt={item.name}
          width={item.width}
          height={item.height}
          className="h-auto max-h-[60px] w-auto max-w-full object-contain sm:max-h-[70px] lg:max-h-[90px]"
        />
      </div>
      <div className="border-t border-hairline py-3 text-center lg:py-4">
        <span className="font-satoshi text-xs text-black sm:text-sm">
          {item.description}
        </span>
      </div>
    </div>
  );
}

/**
 * Clients grid — Group 2: 1418×937.
 * Desktop: 4-col rows. Mobile: 2-col cards with dynamic count description (e.g. "4 & Counting", "3 & Counting").
 */
export async function ClientsGrid() {
  const { heading, subheading, rows } = await getClientsGridData();

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[26px]">
      <div className="mx-auto flex max-w-[1418px] flex-col gap-10 sm:gap-[60px]">
        <div className="mx-auto flex max-w-[591px] flex-col items-center gap-4 text-center">
          <SectionHeading className="text-[28px] font-medium tracking-[-0.8px] text-ink sm:text-[36px] lg:text-[40px] lg:tracking-[-1px]">
            {renderHeading(heading)}
          </SectionHeading>
          <p className="max-w-[360px] font-satoshi text-[15px] leading-snug text-muted sm:text-base">
            {subheading}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {rows.map((row, r) => (
            <div
              key={r}
              className="grid grid-cols-2 gap-3 px-0 sm:gap-4 lg:grid-cols-4 lg:px-[33px]"
            >
              {row.map((item, c) => (
                <ClientCard key={`${r}-${c}-${item.name}`} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
