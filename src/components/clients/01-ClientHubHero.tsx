import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Client hub — first section (Sevenloop | Design Asylum Client Work).
 * Breadcrumb + title + category line + media placeholder.
 *
 * Desktop (lg+): unchanged. Mobile: type scale, gutters, fluid media.
 */
export function ClientHubHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center gap-3 px-5 pb-6 sm:gap-4 sm:px-8 sm:pb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-center gap-1 font-satoshi text-[12px] leading-[19.6px] tracking-[-0.5px] uppercase sm:text-[14px]"
        >
          <Link
            href="/"
            className="text-center font-normal text-black transition-opacity hover:opacity-70"
          >
            Home
          </Link>
          <ChevronRight
            className="size-4 shrink-0 text-black"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Link
            href="/clients/sevenloop"
            className="text-center font-normal text-black transition-opacity hover:opacity-70"
          >
            clients
          </Link>
          <ChevronRight
            className="size-4 shrink-0 text-black"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="text-center font-medium text-black">sevenloop</span>
        </nav>

        <h1 className="font-figtree text-[40px] font-normal leading-[1.15] tracking-[-0.5px] text-black uppercase sm:text-[48px] lg:text-[56px] lg:leading-[79.2px]">
          Sevenloop
        </h1>

        <p className="max-w-[842px] px-1 text-center font-satoshi text-[11px] font-normal leading-[140%] tracking-[-0.5px] text-black uppercase sm:text-[13px] sm:leading-[120%] lg:text-[14px]">
          <span>
            Design Agency for Manufacturing Firms – Branding, Website,&nbsp;
          </span>
          <span>Design Agency for Startups,&nbsp;</span>
          <span>Design Agency for Technology Businesses,&nbsp;</span>
          <span>Aviation Design Agency,&nbsp;</span>
          <span>Chemical Industry – Design Strategy Consultants</span>
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[1438px] items-center justify-center px-5 sm:px-8 lg:h-[573px]">
        <div
          className="aspect-[1150.4/532] w-full max-w-[1150.4px] rounded-xl bg-black"
          aria-label="Sevenloop media placeholder"
          role="img"
        />
      </div>
    </section>
  );
}
