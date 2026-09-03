import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { featuredProjects, type FeaturedProject } from "@/data/projects";

function ProjectRow({ project }: { project: FeaturedProject }) {
  // Desktop: Frame 2095587764 row — unchanged at lg+.
  // Mobile: vertical stack — image → title → description → CTA → metric.
  return (
    <div className="flex flex-col gap-5 border-b border-hairline px-5 py-10 sm:gap-6 sm:px-6 sm:py-12 lg:flex-row lg:items-start lg:gap-[58.86px] lg:px-[60px] lg:pt-[56px] lg:pb-[90px]">
      <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-auto lg:h-[279px] lg:max-w-[496px] lg:shrink-0">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 496px"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-4 lg:w-[198px] lg:shrink-0 lg:gap-8">
        <h3 className="font-figtree text-[28px] font-medium leading-[1.15] tracking-[-0.5px] text-black sm:text-[32px] lg:text-[40px] lg:leading-[46px] lg:tracking-[-1px]">
          {project.name}
        </h3>

        {/* Mobile: description between title and CTA */}
        <p className="font-satoshi text-[15px] leading-relaxed text-black lg:hidden">
          {project.description}
        </p>

        <PillButton
          variant="outline"
          size="sm"
          href="/clients/sevenloop"
          className="w-[154px] !px-4"
        >
          View website
        </PillButton>

        {/* Mobile metric under CTA */}
        <div className="flex flex-row items-baseline gap-3 lg:hidden">
          <span className="font-figtree text-[32px] font-medium leading-none tracking-[-1px] text-black">
            {project.metric}
          </span>
          <span className="max-w-[180px] font-satoshi text-[13px] leading-snug text-muted">
            {project.metricLabel}
          </span>
        </div>
      </div>

      {/* Desktop copy + metric column */}
      <div className="hidden flex-col gap-10 lg:flex">
        <p className="max-w-[330px] font-satoshi text-base leading-relaxed text-black">
          {project.description}
        </p>
        <div className="flex w-[202px] flex-col gap-2">
          <span className="font-figtree text-[40px] font-medium leading-none tracking-[-1px] text-black">
            {project.metric}
          </span>
          <span className="font-satoshi text-[13px] leading-snug text-muted">
            {project.metricLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Featured Projects — Frame 2095587764 / Homepage.
 * Desktop: unchanged. Mobile: stacked project cards per Homepagemobile.
 */
export function FeaturedProjects() {
  return (
    <section className="mx-auto flex w-full max-w-[1471px] flex-col gap-px bg-white">
      <SectionHeading className="px-5 text-[32px] font-normal leading-[1.2] tracking-[-1.5px] text-[#05201F] sm:px-6 sm:text-[36px] lg:px-[60px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
        Featured <Accent>Projects</Accent>
      </SectionHeading>

      <div className="flex flex-col gap-px">
        {featuredProjects.map((project, i) => (
          <ProjectRow key={i} project={project} />
        ))}
      </div>

      <div className="flex justify-center py-8 lg:py-10">
        <PillButton
          variant="dark"
          size="sm"
          href="/clients/sevenloop"
          className="w-[196.19px] !px-4 font-satoshi text-[14px] font-medium leading-4 tracking-normal"
        >
          See more work
        </PillButton>
      </div>
    </section>
  );
}
