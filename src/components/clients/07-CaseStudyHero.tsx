import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { sevenloopCaseStudyHero } from "@/data/caseStudyPage";

/**
 * Case study — first section: breadcrumb + heading + hero image.
 * Figma: heading 1066×159, breadcrumb container 308×20 (gap 4), image
 * 1350×759 at top 406/left 60, 13.98px radius.
 *
 * Desktop (lg+): unchanged. Mobile: type scale, gutters, wrapping.
 */
export function CaseStudyHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center gap-4 px-5 pb-6 pt-6 sm:gap-6 sm:px-8 sm:pb-8 sm:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-center gap-1 font-satoshi text-[12px] leading-[19.6px] tracking-[-0.5px] uppercase sm:text-[14px]"
        >
          {sevenloopCaseStudyHero.breadcrumb.map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <Link
                href={item.href}
                className="text-center font-normal text-black transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
              <ChevronRight
                className="size-4 shrink-0 text-black"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
          ))}
          <span className="text-center font-medium text-black">
            {sevenloopCaseStudyHero.breadcrumbCurrent}
          </span>
        </nav>

        <h1 className="max-w-[1066px] text-center font-figtree text-[28px] font-normal leading-[1.2] tracking-[-0.5px] text-black uppercase sm:text-[40px] sm:leading-[1.25] lg:text-[56px] lg:leading-[79.2px]">
          {sevenloopCaseStudyHero.heading}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[1470px] px-5 pb-10 sm:px-8 sm:pb-12 lg:px-[60px] lg:pb-16">
        <div className="relative aspect-[1350/759] w-full overflow-hidden rounded-[13.98px]">
          <Image
            src={sevenloopCaseStudyHero.image.src}
            alt={sevenloopCaseStudyHero.image.alt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 1350px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
