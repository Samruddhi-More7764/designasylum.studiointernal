import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { getHomepageCaseStudies } from "@/cms/content";
import type { CaseStudy } from "@/data/caseStudies";

function CaseStudyRow({ study }: { study: CaseStudy }) {
  // Header (281×45) with View website under it. Description (326×73) on the
  // right, and the tag pills directly beneath that description.
  return (
    <div className="flex flex-col gap-4 border-b border-hairline py-8 first:pt-0 last:border-b-0 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:py-10">
      <div className="relative min-h-[142px] w-full lg:w-[281px] lg:shrink-0">
        <div className="flex h-[45px] items-center gap-3 lg:-mt-[2.38px]">
          <span className="font-satoshi text-sm text-muted">{study.number}</span>
          <h3 className="font-figtree text-[28px] font-medium tracking-[-0.5px] text-black sm:text-[36px] lg:text-[44px] lg:leading-[45px] lg:tracking-[-1px]">
            {study.name}
          </h3>
        </div>
        <PillButton
          variant="outline"
          size="sm"
          className="mt-6 h-[50px] w-[154px] !px-4 lg:absolute lg:top-[91.28px] lg:left-0 lg:mt-0"
          href={study.href}
        >
          View website
        </PillButton>
      </div>

      <div className="w-full max-w-[326px] lg:w-[326px] lg:shrink-0">
        <p className="font-satoshi text-sm leading-relaxed text-black lg:h-[73px]">
          {study.description}
        </p>
        <div className="flex flex-wrap content-start gap-2 pt-3.5 lg:h-[98px] lg:pt-[14px]">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-[64px] border-[1.5px] border-[#E3E3E3] bg-[#EDECEC] px-[14px] font-figtree text-[12px] font-medium leading-[10px] tracking-[0.8px] text-[#4B4B4B] uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
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
export async function CaseStudies() {
  const caseStudies = await getHomepageCaseStudies();

  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-[60px]">
      <SectionHeading className="mb-10 max-w-[720px] text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-ink sm:mb-12 sm:text-[36px] lg:mb-16 lg:text-[40px] lg:leading-[1.15] lg:tracking-[-1px]">
        Worked with companies from a stubbornly{" "}
        <Accent>diverse</Accent> set of industries
      </SectionHeading>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[485px_minmax(0,1fr)] lg:items-start lg:gap-16">
        <div className="w-full lg:sticky lg:top-[100px] lg:mt-[23.93px] lg:self-start">
          <div className="relative aspect-[485/539] w-full overflow-hidden lg:-ml-[0.1px] lg:h-[539px] lg:w-[485px]">
            <Image
              src="/assets/images/case-study-flower.png"
              alt="Black-and-white sculptural flower form"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 485px, 100vw"
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
