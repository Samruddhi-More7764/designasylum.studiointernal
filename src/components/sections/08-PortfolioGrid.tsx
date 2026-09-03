import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { portfolioItems, type PortfolioItem } from "@/data/portfolio";

const CLIENT_HUB_HREF = "/clients/sevenloop";

function PortfolioCard({
  item,
  className = "",
}: {
  item: PortfolioItem;
  className?: string;
}) {
  // Desktop: 663×416, title · category · arrow on one row.
  // Mobile: image → title+arrow → category.
  return (
    <Link
      href={CLIENT_HUB_HREF}
      className={`flex w-full max-w-[663px] flex-col gap-[10px] transition-opacity hover:opacity-90 lg:h-[416px] ${className}`}
    >
      <div className="relative aspect-[663/373] w-full overflow-hidden lg:aspect-auto lg:min-h-0 lg:flex-1">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 663px"
        />
      </div>

      {/* Mobile caption */}
      <div className="flex shrink-0 flex-col gap-1 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <span className="font-figtree text-base font-medium text-black">
            {item.name}
          </span>
          <MoveRight
            className="h-5 w-5 shrink-0 text-arrow-accent"
            aria-hidden="true"
          />
        </div>
        <span className="font-satoshi text-[13px] text-muted">
          {item.category}
        </span>
      </div>

      {/* Desktop caption */}
      <div className="hidden shrink-0 items-center gap-6 lg:flex">
        <span className="font-figtree text-base font-medium text-black">
          {item.name}
        </span>
        <span className="font-satoshi text-[15px] text-muted">
          {item.category}
        </span>
        <MoveRight
          className="ml-auto h-5 w-5 text-arrow-accent"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

/**
 * Portfolio grid — Frame 8.
 * Desktop: 2×3 cards. Mobile: single-column stack.
 */
export function PortfolioGrid() {
  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px]">
      <div className="mx-auto flex h-auto w-full max-w-[1350px] flex-col gap-10 sm:gap-16 lg:min-h-[1613px]">
        <div className="flex min-h-0 w-full flex-col gap-6 lg:min-h-[174px] lg:flex-row lg:items-start lg:justify-between lg:gap-[23px]">
          <div className="flex max-w-[640px] flex-col gap-5 lg:gap-[23px]">
            <SectionHeading className="text-[28px] font-medium leading-[1.15] tracking-[-0.8px] text-ink sm:text-[36px] lg:text-[40px] lg:tracking-[-1px]">
              Design Asylum&apos;s <Accent>strategic</Accent>
              <br />
              branding projects
            </SectionHeading>
            <p className="font-satoshi text-[15px] leading-relaxed text-muted sm:text-base">
              The value of branding isn&rsquo;t how a thing looks or sounds.
              It&rsquo;s the story, confidence and clarity you unearth in the
              process, the part that makes your: audience say &ldquo;yes,
              this&rdquo;, team want to be part of it, investors reach for the
              chequebook.
            </p>
          </div>
          <PillButton
            variant="dark"
            size="lg"
            className="shrink-0"
            href="/clients/sevenloop"
          >
            See more work
          </PillButton>
        </div>

        <div className="grid w-full grid-cols-1 justify-items-stretch gap-y-10 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
          {portfolioItems.map((item, i) => (
            <PortfolioCard
              key={i}
              item={item}
              className={i === 4 ? "lg:translate-x-px" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
