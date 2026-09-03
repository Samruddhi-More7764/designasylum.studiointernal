import Image from "next/image";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { clientsGridRows, type ClientLogo } from "@/data/clients";

function ClientCard({ logo }: { logo: ClientLogo }) {
  // Desktop: h-[374px]. Mobile: shorter card, same logo + "4 & Counting".
  return (
    <div className="flex h-[200px] flex-col overflow-hidden rounded-xl border border-hairline bg-white sm:h-[260px] lg:h-[374px]">
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-10">
        <Image
          src={logo.image}
          alt={logo.name}
          width={logo.width}
          height={logo.height}
          className="h-auto max-h-[60px] w-auto max-w-full object-contain sm:max-h-[70px] lg:max-h-[90px]"
        />
      </div>
      <div className="border-t border-hairline py-3 text-center lg:py-4">
        <span className="font-satoshi text-xs text-black sm:text-sm">
          4 &amp; Counting
        </span>
      </div>
    </div>
  );
}

/**
 * Clients grid — Group 2: 1418×937.
 * Desktop: 4-col rows. Mobile: 2-col cards with "4 & Counting".
 */
export function ClientsGrid() {
  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[26px]">
      <div className="mx-auto flex max-w-[1418px] flex-col gap-10 sm:gap-[60px]">
        <div className="mx-auto flex max-w-[591px] flex-col items-center gap-4 text-center">
          <SectionHeading className="text-[28px] font-medium tracking-[-0.8px] text-ink sm:text-[36px] lg:text-[40px] lg:tracking-[-1px]">
            8 in 10 clients <Accent>come back</Accent> for more.
          </SectionHeading>
          <p className="max-w-[360px] font-satoshi text-[15px] leading-snug text-muted sm:text-base">
            Once people work with us, they tend to keep working with us. The
            number we&rsquo;re quietly proud of.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {clientsGridRows.map((row, r) => (
            <div
              key={r}
              className="grid grid-cols-2 gap-3 px-0 sm:gap-4 lg:grid-cols-4 lg:px-[33px]"
            >
              {row.map((logo, c) => (
                <ClientCard key={`${r}-${c}`} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
