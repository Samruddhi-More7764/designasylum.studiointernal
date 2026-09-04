import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";

function CaseStudyRow({ study }: { study: CaseStudy }) {
  // Desktop: number + name + VIEW WEBSITE on one row, then description + tags.
  // Mobile: index → title → description → View Website → wrapped tags.
  return (
    <div className="flex flex-col gap-4 border-b border-hairline py-8 first:pt-0 last:border-b-0 lg:gap-6 lg:py-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
        <span className="font-satoshi text-sm text-muted">{study.number}</span>
        <h3 className="font-figtree text-[28px] font-medium tracking-[-0.5px] text-black sm:text-[36px] lg:text-[44px] lg:tracking-[-1px]">
          {study.name}
        </h3>
        <PillButton
          variant="outline"
          size="sm"
          className="hidden w-fit lg:ml-auto lg:inline-flex"
          href="/clients/sevenloop"
        >
          View website
        </PillButton>
      </div>

      <p className="max-w-[520px] font-satoshi text-sm leading-relaxed text-black">
        {study.description}
      </p>

      <PillButton
        variant="outline"
        size="sm"
        className="w-fit lg:hidden"
        href="/clients/sevenloop"
      >
        View website
      </PillButton>

      <div className="flex flex-wrap gap-2">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-pill border border-black/10 bg-[#F2F2F2] px-3 py-1.5 font-satoshi text-[10px] uppercase tracking-wide text-black lg:bg-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Case studies — Group 12.
 * Desktop (lg+): sticky left image + right list — unchanged.
 * Mobile: image first, then stacked project rows.
 * BookStrategyCta (next section) provides the session CTA.
 */
export function CaseStudies() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-[60px]">
      <SectionHeading className="mb-10 max-w-[720px] text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-ink sm:mb-12 sm:text-[36px] lg:mb-16 lg:text-[40px] lg:leading-[1.15] lg:tracking-[-1px]">
        Worked with companies from a stubbornly{" "}
        <Accent>diverse</Accent> set of industries
      </SectionHeading>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,350px)_1fr] lg:items-start lg:gap-16">
        <div className="w-full lg:sticky lg:top-[100px] lg:self-start">
          <div className="relative aspect-[350/560] w-full overflow-hidden">
            <Image
              src="/assets/images/case-study-flower.png"
              alt="Black-and-white sculptural flower form"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 350px, 100vw"
            />
          </div>
        </div>

        <div className="flex flex-col">
          {caseStudies.map((study, i) => (
            <CaseStudyRow key={i} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
